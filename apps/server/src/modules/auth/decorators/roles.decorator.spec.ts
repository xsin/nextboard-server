import { Reflector } from '@nestjs/core'
import { describe, expect, it } from 'vitest'
import { Roles } from './roles.decorator'

describe('roles Decorator', () => {
  it('should set metadata with provided roles', () => {
    const roles = ['admin', 'user']
    const decorator = Roles(...roles)

    class TestClass {
      @decorator
      testMethod() {}
    }

    const reflector = new Reflector()
    const metadata = reflector.get('roles', TestClass.prototype.testMethod)

    expect(metadata).toEqual(roles)
  })

  it('should set metadata with a single role', () => {
    const role = 'admin'
    const decorator = Roles(role)

    class TestClass {
      @decorator
      testMethod(): void {}
    }

    const reflector = new Reflector()
    const metadata = reflector.get('roles', TestClass.prototype.testMethod)

    expect(metadata).toEqual([role])
  })

  it('should set metadata with no roles', () => {
    const decorator = Roles()

    class TestClass {
      @decorator
      testMethod(): void {}
    }

    const reflector = new Reflector()
    const metadata = reflector.get('roles', TestClass.prototype.testMethod)

    expect(metadata).toEqual([])
  })

  it('should work with class decorators', () => {
    const decorator = Roles('admin', 'superuser')

    @decorator
    class TestClass {}

    const reflector = new Reflector()
    const metadata = reflector.get('roles', TestClass)

    expect(metadata).toEqual(['admin', 'superuser'])
  })
})
