import { describe, expect, it } from 'vitest'
import { undefinedToNull } from '../../src/utils/undefinedToNull'

describe('undefinedToNull', () => {
  it('should convert undefined to null at the top level', () => {
    const input = undefined
    const output = undefinedToNull(input)
    expect(output).toBeNull()
  })

  it('should not change non-undefined values at the top level', () => {
    const input = 42
    const output = undefinedToNull(input)
    expect(output).toBe(42)
  })

  it('should convert undefined to null in an object', () => {
    const input = { a: undefined, b: 42 }
    const output = undefinedToNull(input)
    expect(output).toEqual({ a: null, b: 42 })
  })

  it('should convert undefined to null deeply when deep is true', () => {
    const input = { a: { b: undefined, c: 42 }, d: undefined }
    const output = undefinedToNull(input, true)
    expect(output).toEqual({ a: { b: null, c: 42 }, d: null })
  })

  it('should not convert undefined to null deeply when deep is false', () => {
    const input = { a: { b: undefined, c: 42 }, d: undefined }
    const output = undefinedToNull(input, false)
    expect(output).toEqual({ a: { b: undefined, c: 42 }, d: null })
  })

  it('should handle null values correctly', () => {
    const input = { a: null, b: 42 }
    const output = undefinedToNull(input)
    expect(output).toEqual({ a: null, b: 42 })
  })

  it('should handle nested objects correctly when deep is true', () => {
    const input = { a: { b: { c: undefined } } }
    const output = undefinedToNull(input, true)
    expect(output).toEqual({ a: { b: { c: null } } })
  })

  it('should handle nested objects correctly when deep is false', () => {
    const input = { a: { b: { c: undefined } } }
    const output = undefinedToNull(input, false)
    expect(output).toEqual({ a: { b: { c: undefined } } })
  })
})
