import assert from 'node:assert'
import { test } from 'node:test'
import { $q, _q } from '../build/index.js'

// ============================================================================
// PRIMITIVE TYPES
// ============================================================================

test('$q converts string primitive to JSON Schema', () => {
  const result = $q('string')
  assert.deepStrictEqual(result, { type: 'string' })
})

test('$q converts number primitive to JSON Schema', () => {
  const result = $q('number')
  assert.deepStrictEqual(result, { type: 'number' })
})

test('$q converts boolean primitive to JSON Schema', () => {
  const result = $q('boolean')
  assert.deepStrictEqual(result, { type: 'boolean' })
})

test('$q converts null primitive to JSON Schema', () => {
  const result = $q('null')
  assert.deepStrictEqual(result, { type: 'null' })
})

// ============================================================================
// ARRAYS
// ============================================================================

test('$q converts array with string items to JSON Schema', () => {
  const result = $q(['string'])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: { type: 'string' },
  })
})

test('$q converts array with number items to JSON Schema', () => {
  const result = $q(['number'])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: { type: 'number' },
  })
})

test('$q converts array with boolean items to JSON Schema', () => {
  const result = $q(['boolean'])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: { type: 'boolean' },
  })
})

test('$q converts array with null items to JSON Schema', () => {
  const result = $q(['null'])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: { type: 'null' },
  })
})

test('$q converts nested arrays to JSON Schema', () => {
  const result = $q([['string']])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'string' },
    },
  })
})

test('$q converts array with object items to JSON Schema', () => {
  const result = $q([{ name: 'string' }])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: {
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
      additionalProperties: false,
    },
  })
})

// ============================================================================
// SIMPLE OBJECTS
// ============================================================================

test('$q converts simple object with one property to JSON Schema', () => {
  const result = $q({ name: 'string' })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
    additionalProperties: false,
  })
})

test('$q converts object with multiple properties to JSON Schema', () => {
  const result = $q({ name: 'string', age: 'number' })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' },
    },
    required: ['name', 'age'],
    additionalProperties: false,
  })
})

test('$q converts object with all primitive types to JSON Schema', () => {
  const result = $q({
    str: 'string',
    num: 'number',
    bool: 'boolean',
    nul: 'null',
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      str: { type: 'string' },
      num: { type: 'number' },
      bool: { type: 'boolean' },
      nul: { type: 'null' },
    },
    required: ['str', 'num', 'bool', 'nul'],
    additionalProperties: false,
  })
})

// ============================================================================
// OPTIONAL PROPERTIES (keys ending with ?)
// ============================================================================

test('$q converts object without optional properties to JSON Schema', () => {
  const result = $q({ name: 'string', email: 'string' })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
    },
    required: ['name', 'email'],
    additionalProperties: false,
  })
})

test('$q converts object with optional property (with ?) to JSON Schema', () => {
  const result = $q({ name: 'string', 'email?': 'string' })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
    },
    required: ['name', 'email'],
    additionalProperties: false,
  })
})

test('$q handles multiple optional properties', () => {
  const result = $q({
    name: 'string',
    'email?': 'string',
    'age?': 'number',
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
      age: {
        anyOf: [{ type: 'number' }, { type: 'null' }],
      },
    },
    required: ['name', 'email', 'age'],
    additionalProperties: false,
  })
})

test('$q handles all optional properties', () => {
  const result = $q({
    'name?': 'string',
    'email?': 'string',
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
      email: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
    },
    required: ['name', 'email'],
    additionalProperties: false,
  })
})

test('$q handles optional property with array value', () => {
  const result = $q({
    name: 'string',
    'tags?': ['string'],
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      tags: {
        anyOf: [
          {
            type: 'array',
            items: { type: 'string' },
          },
          { type: 'null' },
        ],
      },
    },
    required: ['name', 'tags'],
    additionalProperties: false,
  })
})

test('$q handles optional property with object value', () => {
  const result = $q({
    name: 'string',
    'address?': { street: 'string' },
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      address: {
        anyOf: [
          {
            type: 'object',
            properties: { street: { type: 'string' } },
            required: ['street'],
            additionalProperties: false,
          },
          { type: 'null' },
        ],
      },
    },
    required: ['name', 'address'],
    additionalProperties: false,
  })
})

// ============================================================================
// NESTED OBJECTS
// ============================================================================

test('$q converts nested object to JSON Schema', () => {
  const result = $q({
    user: {
      name: 'string',
      age: 'number',
    },
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name', 'age'],
        additionalProperties: false,
      },
    },
    required: ['user'],
    additionalProperties: false,
  })
})

test('$q converts deeply nested objects to JSON Schema', () => {
  const result = $q({
    user: {
      profile: {
        name: 'string',
      },
    },
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          profile: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            required: ['name'],
            additionalProperties: false,
          },
        },
        required: ['profile'],
        additionalProperties: false,
      },
    },
    required: ['user'],
    additionalProperties: false,
  })
})

// ============================================================================
// COMPLEX COMBINATIONS
// ============================================================================

test('$q converts object with array property to JSON Schema', () => {
  const result = $q({
    name: 'string',
    tags: ['string'],
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['name', 'tags'],
    additionalProperties: false,
  })
})

test('$q converts object with array of objects to JSON Schema', () => {
  const result = $q({
    users: [
      {
        name: 'string',
        age: 'number',
      },
    ],
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
          required: ['name', 'age'],
          additionalProperties: false,
        },
      },
    },
    required: ['users'],
    additionalProperties: false,
  })
})

test('$q converts complex nested structure to JSON Schema', () => {
  const result = $q({
    name: 'string',
    'email?': 'string',
    addresses: [
      {
        street: 'string',
        'zip?': 'string',
        country: {
          code: 'string',
          name: 'string',
        },
      },
    ],
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
      addresses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            zip: {
              anyOf: [{ type: 'string' }, { type: 'null' }],
            },
            country: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                name: { type: 'string' },
              },
              required: ['code', 'name'],
              additionalProperties: false,
            },
          },
          required: ['street', 'zip', 'country'],
          additionalProperties: false,
        },
      },
    },
    required: ['name', 'email', 'addresses'],
    additionalProperties: false,
  })
})

// ============================================================================
// PRE-FORMATTED SCHEMAS (_q function)
// ============================================================================

test('_q allows simple JSON Schema to pass through unchanged', () => {
  const schema = { type: 'string', format: 'email' }
  const preformatted = _q(schema)
  const result = $q(preformatted)
  assert.strictEqual(result.type, 'string')
  assert.strictEqual(result.format, 'email')
})

test('_q allows JSON Schema with additionalProperties: true to pass through', () => {
  const schema = {
    type: 'object',
    properties: {
      custom: { type: 'string', pattern: '^[A-Z]+$' },
    },
    required: ['custom'],
    additionalProperties: true,
  }
  const preformatted = _q(schema)
  const result = $q(preformatted)
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties, {
    custom: { type: 'string', pattern: '^[A-Z]+$' },
  })
  assert.deepStrictEqual(result.required, ['custom'])
  assert.strictEqual(result.additionalProperties, true)
})

test('_q allows custom JSON Schema properties that $q cannot generate', () => {
  const schema = {
    type: 'string',
    pattern: '^[0-9]{4}$',
    minLength: 4,
    maxLength: 4,
    examples: ['1234', '5678'],
  }
  const preformatted = _q(schema)
  const result = $q(preformatted)
  assert.strictEqual(result.type, 'string')
  assert.strictEqual(result.pattern, '^[0-9]{4}$')
  assert.strictEqual(result.minLength, 4)
  assert.strictEqual(result.maxLength, 4)
  assert.deepStrictEqual(result.examples, ['1234', '5678'])
})

test('_q can be used within object properties to escape $q processing', () => {
  const result = $q({
    name: 'string',
    email: _q({ type: 'string', format: 'email' }),
  })
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties.name, { type: 'string' })
  assert.strictEqual(result.properties.email.type, 'string')
  assert.strictEqual(result.properties.email.format, 'email')
  assert.deepStrictEqual(result.required, ['name', 'email'])
  assert.strictEqual(result.additionalProperties, false)
})

test('_q can be used within arrays to escape $q processing', () => {
  const result = $q([_q({ type: 'string', format: 'email' })])
  assert.strictEqual(result.type, 'array')
  assert.strictEqual(result.items.type, 'string')
  assert.strictEqual(result.items.format, 'email')
})

test('_q can be used with optional properties to escape $q processing', () => {
  const result = $q({
    name: 'string',
    'email?': _q({ type: 'string', format: 'email' }),
  })
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties.name, { type: 'string' })
  assert.strictEqual(result.properties.email.anyOf.length, 2)
  assert.strictEqual(result.properties.email.anyOf[0].type, 'string')
  assert.strictEqual(result.properties.email.anyOf[0].format, 'email')
  assert.deepStrictEqual(result.properties.email.anyOf[1], { type: 'null' })
  assert.deepStrictEqual(result.required, ['name', 'email'])
  assert.strictEqual(result.additionalProperties, false)
})

test('_q allows nested complex JSON Schema structures', () => {
  const schema = {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          profile: {
            type: 'object',
            properties: {
              metadata: {
                type: 'object',
                additionalProperties: true,
              },
            },
            required: ['metadata'],
            additionalProperties: false,
          },
        },
        required: ['profile'],
        additionalProperties: false,
      },
    },
    required: ['user'],
    additionalProperties: false,
  }
  const preformatted = _q(schema)
  const result = $q(preformatted)
  assert.strictEqual(result.type, 'object')
  assert.strictEqual(
    result.properties.user.properties.profile.properties.metadata
      .additionalProperties,
    true
  )
})

test('_q allows truly optional properties (not in required array)', () => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  }
  const preformatted = _q(schema)
  const result = $q(preformatted)
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties, {
    name: { type: 'string' },
    email: { type: 'string' },
  })
  assert.deepStrictEqual(result.required, ['name'])
  assert.strictEqual(result.required.includes('email'), false)
  assert.strictEqual(result.additionalProperties, false)
})

test('_q can be used within $q to create truly optional properties', () => {
  const result = $q({
    name: 'string',
    email: _q({
      type: 'object',
      properties: {
        address: { type: 'string' },
        phone: { type: 'string' },
      },
      required: ['address'],
      additionalProperties: false,
    }),
  })
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties.name, { type: 'string' })
  assert.strictEqual(result.properties.email.type, 'object')
  assert.deepStrictEqual(result.properties.email.properties, {
    address: { type: 'string' },
    phone: { type: 'string' },
  })
  assert.deepStrictEqual(result.properties.email.required, ['address'])
  assert.strictEqual(result.properties.email.required.includes('phone'), false)
  assert.deepStrictEqual(result.required, ['name', 'email'])
  assert.strictEqual(result.additionalProperties, false)
})

// ============================================================================
// EDGE CASES
// ============================================================================

test('$q handles empty object', () => {
  const result = $q({})
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
  })
})

test('$q handles object with only optional properties', () => {
  const result = $q({
    'name?': 'string',
    'age?': 'number',
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      name: {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
      age: {
        anyOf: [{ type: 'number' }, { type: 'null' }],
      },
    },
    required: ['name', 'age'],
    additionalProperties: false,
  })
})

test('$q handles property name that is just a question mark', () => {
  const result = $q({ '?': 'string' })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      '': {
        anyOf: [{ type: 'string' }, { type: 'null' }],
      },
    },
    required: [''],
    additionalProperties: false,
  })
})

test('$q throws error for property key ending with multiple question marks', () => {
  assert.throws(
    () => {
      $q({ 'name??': 'string' })
    },
    {
      message: /Property key ending with multiple '\?' is not supported/,
    }
  )
})

test('$q throws error for property key ending with three or more question marks', () => {
  assert.throws(
    () => {
      $q({ 'name???': 'string' })
    },
    {
      message: /Property key ending with multiple '\?' is not supported/,
    }
  )
})

test('_q can still be used to create properties with ? in the name', () => {
  const schema = _q({
    type: 'object',
    properties: {
      'name?': { type: 'string' },
      'email?': { type: 'string' },
    },
    required: ['name?', 'email?'],
    additionalProperties: false,
  })
  const result = $q(schema)
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties, {
    'name?': { type: 'string' },
    'email?': { type: 'string' },
  })
  assert.deepStrictEqual(result.required, ['name?', 'email?'])
})

test('_q can be used to create JSON Schema with properties ending in ??', () => {
  const schema = _q({
    type: 'object',
    properties: {
      'name??': { type: 'string' },
      'email??': { type: 'number' },
    },
    required: ['name??', 'email??'],
    additionalProperties: false,
  })
  const result = $q(schema)
  assert.strictEqual(result.type, 'object')
  assert.deepStrictEqual(result.properties, {
    'name??': { type: 'string' },
    'email??': { type: 'number' },
  })
  assert.deepStrictEqual(result.required, ['name??', 'email??'])
})

test('$q throws error when same base name is used for both required and optional', () => {
  assert.throws(
    () => {
      $q({
        name: 'string',
        'name?': 'number',
      })
    },
    {
      message: /Duplicate property in required array: "name"/,
    }
  )
})

test('$q throws error when duplicate normalized keys are used', () => {
  assert.throws(
    () => {
      $q({
        'email?': 'string',
        email: 'string',
      })
    },
    {
      message: /Duplicate property in required array: "email"/,
    }
  )
})

test('$q handles very deep nesting', () => {
  const result = $q({
    level1: {
      level2: {
        level3: {
          level4: {
            value: 'string',
          },
        },
      },
    },
  })
  assert.deepStrictEqual(result, {
    type: 'object',
    properties: {
      level1: {
        type: 'object',
        properties: {
          level2: {
            type: 'object',
            properties: {
              level3: {
                type: 'object',
                properties: {
                  level4: {
                    type: 'object',
                    properties: {
                      value: { type: 'string' },
                    },
                    required: ['value'],
                    additionalProperties: false,
                  },
                },
                required: ['level4'],
                additionalProperties: false,
              },
            },
            required: ['level3'],
            additionalProperties: false,
          },
        },
        required: ['level2'],
        additionalProperties: false,
      },
    },
    required: ['level1'],
    additionalProperties: false,
  })
})

test('$q handles array with nested arrays and objects', () => {
  const result = $q([
    {
      items: ['string'],
      metadata: {
        count: 'number',
      },
    },
  ])
  assert.deepStrictEqual(result, {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { type: 'string' },
        },
        metadata: {
          type: 'object',
          properties: {
            count: { type: 'number' },
          },
          required: ['count'],
          additionalProperties: false,
        },
      },
      required: ['items', 'metadata'],
      additionalProperties: false,
    },
  })
})

// ============================================================================
// VERIFICATION: additionalProperties is always false
// ============================================================================

test('$q always sets additionalProperties to false for objects', () => {
  const result1 = $q({ name: 'string' })
  assert.strictEqual(result1.additionalProperties, false)

  const result2 = $q({
    user: {
      profile: {
        data: 'string',
      },
    },
  })
  assert.strictEqual(result2.additionalProperties, false)
  assert.strictEqual(result2.properties.user.additionalProperties, false)
  assert.strictEqual(
    result2.properties.user.properties.profile.additionalProperties,
    false
  )
})

// ============================================================================
// VERIFICATION: required array contains correct keys
// ============================================================================

test('$q correctly identifies required vs optional properties', () => {
  const result = $q({
    required1: 'string',
    'optional1?': 'string',
    required2: 'number',
    'optional2?': 'number',
  })

  // All properties are required, but optional ones can be null
  assert.deepStrictEqual(result.required, [
    'required1',
    'optional1',
    'required2',
    'optional2',
  ])
  // Verify optional properties use anyOf with null
  assert.deepStrictEqual(result.properties.optional1, {
    anyOf: [{ type: 'string' }, { type: 'null' }],
  })
  assert.deepStrictEqual(result.properties.optional2, {
    anyOf: [{ type: 'number' }, { type: 'null' }],
  })
})
