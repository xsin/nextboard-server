import { describe, expect, it } from 'vitest'
import { comparePasswords, saltAndHashPassword } from './password'

describe('password Utils', () => {
  describe('saltAndHashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123!'
      const hashedPassword = await saltAndHashPassword(password)

      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword).toMatch(/^\$2b\$10\$/)
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123!'
      const hash1 = await saltAndHashPassword(password)
      const hash2 = await saltAndHashPassword(password)

      expect(hash1).not.toBe(hash2)
    })

    it('should handle empty string', async () => {
      const password = ''
      const hashedPassword = await saltAndHashPassword(password)

      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword).toMatch(/^\$2b\$10\$/)
    })
  })

  describe('comparePasswords', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123!'
      const hashedPassword = await saltAndHashPassword(password)

      const result = await comparePasswords(password, hashedPassword)
      expect(result).toBe(true)
    })

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123!'
      const wrongPassword = 'wrongPassword123!'
      const hashedPassword = await saltAndHashPassword(password)

      const result = await comparePasswords(wrongPassword, hashedPassword)
      expect(result).toBe(false)
    })

    it('should return false for empty password and valid hash', async () => {
      const password = 'testPassword123!'
      const emptyPassword = ''
      const hashedPassword = await saltAndHashPassword(password)

      const result = await comparePasswords(emptyPassword, hashedPassword)
      expect(result).toBe(false)
    })

    it('should handle comparing with invalid hash format', async () => {
      const password = 'testPassword123!'
      const invalidHash = 'invalid-hash-format'

      await expect(comparePasswords(password, invalidHash)).resolves.toBe(false)
    })
  })
})
