// All of this information is available to the client-side code
// DO NOT retrieve sensitive information from the environment in here! :O

// webpack is configured to provide our clientSettings as `process.env.clientSettings`
// (through DefinePlugin), so we can just use these here, and fall back to the defaults
// if a setting is not set in clientSettings.json
const clientSettings: any = process.env.clientSettings ?? {}

export const ADMIN_SERVER_PORT = clientSettings.ADMIN_SERVER_PORT ?? 3030
export const ADMIN_SERVER_HOST = clientSettings.ADMIN_SERVER_HOST ?? "localhost"
export const BAKED_BASE_URL =
    clientSettings.BAKED_BASE_URL ??
    `http://${ADMIN_SERVER_HOST}:${ADMIN_SERVER_PORT}`

export const ENV = clientSettings.ENV ?? "development"
export const BAKED_GRAPHER_URL =
    clientSettings.BAKED_GRAPHER_URL ?? `${BAKED_BASE_URL}/grapher`
export const ADMIN_BASE_URL =
    clientSettings.ADMIN_BASE_URL ??
    `http://${ADMIN_SERVER_HOST}:${ADMIN_SERVER_PORT}`
