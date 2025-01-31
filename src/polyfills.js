import { Buffer } from 'buffer'

window.Buffer = Buffer
globalThis.process = { env: {} }