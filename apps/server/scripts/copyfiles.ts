import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

// relative to project root directory
const destinations = [
  ['package.json', 'dist/package.json'],
]

const currentDir = process.cwd()
destinations.forEach(([src, dest]) => {
  copyFileSync(resolve(currentDir, src), resolve(currentDir, dest))
})
