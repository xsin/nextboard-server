import { describe, expect, it } from 'vitest'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CreateUserDto } from '../../modules/user/dto/create.dto'
import { Match, MatchConstraint } from './match.decorator'

describe('match Decorator', () => {
  describe('matchConstraint', () => {
    const constraint = new MatchConstraint()

    it('should return true when values match', () => {
      const args = {
        object: { password: 'test', confirmPassword: 'test' },
        property: 'confirmPassword',
        constraints: ['password'],
      } as any

      expect(constraint.validate('test', args)).toBe(true)
    })

    it('should return false when values do not match', () => {
      const args = {
        object: { password: 'test', confirmPassword: 'different' },
        property: 'confirmPassword',
        constraints: ['password'],
      } as any

      expect(constraint.validate('different', args)).toBe(false)
    })

    it('should return correct default message', () => {
      const args = {
        property: 'confirmPassword',
        constraints: ['password'],
      } as any

      expect(constraint.defaultMessage(args)).toBe('password and confirmPassword do not match')
    })
  })

  describe('match decorator', () => {
    class TestDto {
      password: string

      @Match('password')
      confirmPassword: string
    }

    it('should not return errors when values match', async () => {
      const dto = plainToInstance(TestDto, {
        password: 'test',
        confirmPassword: 'test',
      })

      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should return an error when values do not match', async () => {
      const dto = plainToInstance(TestDto, {
        password: 'test',
        confirmPassword: 'different',
      })

      const errors = await validate(dto)
      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('confirmPassword')
      expect(errors[0].constraints).toHaveProperty('MatchConstraint')
      expect(errors[0].constraints?.MatchConstraint).toBe('password and confirmPassword do not match')
    })
  })

  describe('createUserDto integration', () => {
    it('should validate a correct CreateUserDto', async () => {
      const dto = plainToInstance(CreateUserDto, {
        email: 'test@example.com',
        password: 'ValidPass123!',
        password1: 'ValidPass123!',
        name: 'Test User',
      })

      const errors = await validate(dto)
      expect(errors.length).toBe(0)
    })

    it('should return an error for mismatched passwords in CreateUserDto', async () => {
      const dto = plainToInstance(CreateUserDto, {
        email: 'test@example.com',
        password: 'ValidPass123!',
        password1: 'DifferentPass123!',
        name: 'Test User',
      })

      const errors = await validate(dto)
      expect(errors.length).toBe(1)
      expect(errors[0].property).toBe('password1')
      expect(errors[0].constraints).toHaveProperty('MatchConstraint')
      expect(errors[0].constraints?.MatchConstraint).toBe('Passwords do not match')
    })

    it('should validate all fields in CreateUserDto', async () => {
      const dto = plainToInstance(CreateUserDto, {
        email: 'invalid-email',
        password: 'short',
        password1: 'different',
        name: 'A',
        displayName: 'TooLongDisplayNameExceedingTwentyCharacters',
        emailVerifiedAt: 'not-a-date',
      })

      const errors = await validate(dto)
      expect(errors.length).toBe(6) // One error for each invalid field
    })
  })
})
