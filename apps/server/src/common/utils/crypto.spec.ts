import { randomCode } from './crypto'

describe('randomCode', () => {
  it('should generate a code of the specified length', () => {
    const len = 6
    const code = randomCode(len)
    expect(code).toHaveLength(len)
  })

  it('should generate a valid hex string', () => {
    const len = 6
    const code = randomCode(len)
    expect(/^[a-f0-9]+$/.test(code)).toBe(true) // Check if the code is a valid hex string
  })

  it('should generate unique codes', () => {
    const len = 6
    const code1 = randomCode(len)
    const code2 = randomCode(len)
    expect(code1).not.toBe(code2)
  })

  it('should generate a default length code if no length is provided', () => {
    const defaultLen = 6
    const code = randomCode()
    expect(code).toHaveLength(defaultLen)
  })

  it('should handle odd lengths correctly', () => {
    const len = 7
    const code = randomCode(len)
    expect(code).toHaveLength(len)
  })
})
