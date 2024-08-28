import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// relative to scripts directory
const destinations = [
  ['../package.json', '../dist/package.json'],
]

const _filename = fileURLToPath(import.meta.url)
destinations.forEach(([src, dest]) => {
  copyFileSync(resolve(_filename, '..', src), resolve(_filename, '..', dest))
})
