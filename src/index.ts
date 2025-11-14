import { type JSONSchema7 } from 'json-schema'

export type QFormatted = JSONSchema7
const preformattedSymbol = Symbol()
const markJSONSchemaPreformatted = (jsonSchema: QFormatted) => {
  return {
    ...jsonSchema,
    [preformattedSymbol]: true,
  }
}

export type QSchema =
  | ReturnType<typeof markJSONSchemaPreformatted>
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | [QSchema]
  | { [key: string]: QSchema }

const formatJSONSchemaFromQSchema = (schema: QSchema): QFormatted => {
  if (typeof schema === 'object' && preformattedSymbol in schema) return schema
  if (typeof schema === 'string') return { type: schema }
  if (Array.isArray(schema))
    return { type: 'array', items: formatJSONSchemaFromQSchema(schema[0]) }
  const properties: Record<string, JSONSchema7> = {}
  const required: string[] = []
  for (const [key, value] of Object.entries(schema)) {
    if (key.endsWith('??')) {
      throw new Error(
        `Property key ending with multiple '?' is not supported: "${key}". Use '_q()' to escape if you need a property name ending with '?'.`
      )
    }
    const normalizedKey = key.endsWith('?') ? key.slice(0, -1) : key
    if (required.includes(normalizedKey)) {
      throw new Error(
        `Duplicate property in required array: "${normalizedKey}" (from keys "${key}" and possibly another). Properties with the same base name cannot be both required and optional.`
      )
    }
    required.push(normalizedKey)
    if (key.endsWith('?')) {
      properties[normalizedKey] = {
        anyOf: [
          formatJSONSchemaFromQSchema(value),
          {
            type: 'null',
          },
        ],
      }
    } else {
      properties[normalizedKey] = formatJSONSchemaFromQSchema(value)
    }
  }
  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  }
}

export const $q = formatJSONSchemaFromQSchema
export const _q = markJSONSchemaPreformatted
