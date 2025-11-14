# QuickSchema

> **⚠️ Deprecation Notice:** This package will soon be deprecated in favor of an organization-supported scope. No breaking changes will be made.

Builds JSON Schema for rigid APIs with interface-like shorthand.

## Overview

QuickSchema is an **opinionated** library for generating JSON Schema 7. It uses a **TypeScript interface-like typing syntax** with intentional restrictions, making it feel natural to TypeScript developers while enforcing rigid API structures.

Instead of writing verbose JSON Schema, you write clean, interface-like definitions:

```typescript
// TypeScript interface
interface User {
  name: string
  age: number
  email?: string  // Optional
}

// QuickSchema (similar syntax, with restrictions)
$q({
  name: 'string',
  age: 'number',
  'email?': 'string'  // Nullable (required but can be null)
})
```

QuickSchema is designed for APIs with **strong, rigid structures** where consistency is key. It intentionally doesn't cover all JSON Schema use cases—instead, it provides a simple, intuitive syntax for the most common patterns.

**Key restriction**: Unlike TypeScript interfaces, properties marked with `?` are still **required** in the JSON (they can be `null`, but cannot be omitted). This enforces rigid API contracts. If you need truly optional properties or full JSON Schema flexibility, use `_q()` to escape into raw JSON Schema, or consider a different library.

## Installation

```bash
npm install @austin-butters/quickschema
```

## Quick Start

```javascript
import { $q } from '@austin-butters/quickschema'

// Simple types
const stringSchema = $q('string')
// → { type: 'string' }

// Objects
const userSchema = $q({
  name: 'string',
  age: 'number',
  email: 'string'
})
// → {
//     type: 'object',
//     properties: {
//       name: { type: 'string' },
//       age: { type: 'number' },
//       email: { type: 'string' }
//     },
//     required: ['name', 'age', 'email'],
//     additionalProperties: false
//   }

// Arrays
const tagsSchema = $q(['string'])
// → { type: 'array', items: { type: 'string' } }

// Nested structures
const complexSchema = $q({
  users: [{
    name: 'string',
    'email?': 'string',  // nullable (required but can be null)
    tags: ['string']
  }]
})
// → {
//     type: 'object',
//     properties: {
//       users: {
//         type: 'array',
//         items: {
//           type: 'object',
//           properties: {
//             name: { type: 'string' },
//             email: { anyOf: [{ type: 'string' }, { type: 'null' }] },
//             tags: { type: 'array', items: { type: 'string' } }
//           },
//           required: ['name', 'email', 'tags'],
//           additionalProperties: false
//         }
//       }
//     },
//     required: ['users'],
//     additionalProperties: false
//   }
```

## Usage

### Types

#### `type QSchema`

The input type for `$q()`. Can be:

- **Primitive strings**: `'string'`, `'number'`, `'boolean'`, `'null'`
- **Arrays**: `[QSchema]` - an array containing a single schema definition
- **Objects**: `{ [key: string]: QSchema }` - an object where keys are property names and values are schema definitions
  - Keys ending with `?` indicate nullable properties (required but can be `null`)
- **Pre-formatted schemas**: Return value from `_q()` - allows escaping to raw JSON Schema

#### `type QFormatted`

An alias for `JSONSchema7`. Represents a pre-formatted JSON Schema that bypasses QuickSchema's processing when used with `_q()`.

### Functions

### `$q(schema: QSchema): JSONSchema7`

Converts a `QSchema` shorthand into a full JSON Schema 7 object.

#### Optional Properties (Nullable)

Properties ending with `?` are **required but nullable** (can be `null`, not `undefined`):

```javascript
$q({
  name: 'string',
  'email?': 'string'  // Required, but can be null
})
// → {
//     properties: {
//       name: { type: 'string' },
//       email: { anyOf: [{ type: 'string' }, { type: 'null' }] }
//     },
//     required: ['name', 'email']  // Both are required!
//   }
```

**Important**: QuickSchema doesn't support truly optional properties (omitted from JSON). All properties must be present, but nullable ones can be `null`. If you need truly optional properties, use `_q()` to escape to fully formatted JSON Schema.

#### Nested Structures

QuickSchema supports deep nesting:

```javascript
$q({
  user: {
    profile: {
      name: 'string',
      'avatar?': 'string'
    },
    tags: ['string']
  }
})
```

### `_q(schema: JSONSchema7): QFormatted`

Takes a `JSONSchema7` object and marks it as pre-formatted, allowing it to bypass QuickSchema's processing when used with `$q()`. Returns a `QFormatted` type that can be passed to `$q()`.

Use this when you need:

- Truly optional properties (not in `required` array)
- `additionalProperties: true`
- Custom JSON Schema properties (e.g., `pattern`, `format`, `minLength`, etc.)
- Properties with `?` in their names
- Any other JSON Schema feature QuickSchema doesn't support

```javascript
import { $q, _q } from '@austin-butters/quickschema'

// Use _q to escape for custom properties
const schema = $q({
  name: 'string',
  email: _q({ type: 'string', format: 'email' })  // Custom format
})

// Use _q for truly optional properties
const optionalSchema = _q({
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' }
  },
  required: ['name']  // email is truly optional, can be undefined
})

// Use _q for additionalProperties: true
const flexibleSchema = _q({
  type: 'object',
  properties: {
    name: { type: 'string' }
  },
  required: ['name'],
  additionalProperties: true  // Not possible with $q alone
})
```

## Examples

### Basic API Response

```javascript
const apiResponse = $q({
  status: 'string',
  data: {
    id: 'number',
    name: 'string',
    'description?': 'string',  // Nullable
    createdAt: 'string'
  },
  errors: [{
    code: 'string',
    message: 'string'
  }]
})
```

### User Profile with Nested Data

```javascript
const userProfile = $q({
  id: 'number',
  username: 'string',
  'email?': 'string',
  address: {
    street: 'string',
    city: 'string',
    'zip?': 'string'
  },
  preferences: {
    theme: 'string',
    notifications: 'boolean'
  }
})
```

### Combining with _q for Custom Validation

```javascript
const validatedSchema = $q({
  username: 'string',
  password: _q({
    type: 'string',
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
  }),
  'email?': _q({
    type: 'string',
    format: 'email'
  })
})
```

## Requirements

- Node.js >= 18
- TypeScript types included

## License

MIT
