import { randomBytes } from 'node:crypto'

/**
 * Generate a random code
 * @param {number} len - The length of the code
 * @returns {string} - The generated random code
 */
export function randomCode(len: number = 6): string {
  const buffer = randomBytes(Math.ceil(len / 2)) // Generate enough random bytes
  const code = buffer.toString('hex').slice(0, len) // Convert to hex and take the first len characters
  return code
}
