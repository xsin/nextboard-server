import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

// relative to project root directory
const destinations = [
  ['package.json', 'dist/package.json'],
]

const currentDir = process.cwd()
destinations.forEach(([src, dest]) => {
  const destDir = dirname(resolve(currentDir, dest))
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }
  copyFileSync(resolve(currentDir, src), resolve(currentDir, dest))
})
