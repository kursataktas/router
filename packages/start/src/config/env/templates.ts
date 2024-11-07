import type { ValidAccessSchema, ValidEnvFieldUnion } from './schema'

export const ENV_MODULES_IDS = {
  client: '@tanstack/start/env/client',
  server: '@tanstack/start/env/server',
  internal: 'virtual:tsr:env/internal',
}
export const ENV_MODULES_IDS_SET = new Set(Object.values(ENV_MODULES_IDS))

export function buildTemplates(options: {
  schema: Record<string, ValidEnvFieldUnion>
  variables: Array<{ key: string; value: any; access: ValidAccessSchema }>
}): { client: string; server: string; internal: string } {
  let client = ''
  let server = ''

  for (const { key, value, access } of options.variables) {
    if (access === 'public') {
      client += `export const ${key} = ${JSON.stringify(value)}\n`
    } else {
      server += `export const ${key} = ${JSON.stringify(value)}\n`
    }
  }

  return {
    client,
    server,
    internal: ``,
  }
}

export function buildTypeAnnotation(schema: ValidEnvFieldUnion) {
  const type = schema.type
  const isOptional = schema.optional
    ? schema.default !== undefined
      ? false
      : true
    : false

  return `${type}${isOptional ? ' | undefined' : ''}`
}