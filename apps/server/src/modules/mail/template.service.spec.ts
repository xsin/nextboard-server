import fs from 'node:fs/promises'
import path from 'node:path'
import juice from 'juice'
import { template as radashTemplate } from 'radash'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TemplateService } from './template.service'

vi.mock('node:fs/promises')
vi.mock('radash', () => ({
  template: vi.fn(),
}))
vi.mock('juice', () => ({
  default: vi.fn(),
}))

describe('templateService', () => {
  let service: TemplateService

  beforeEach(() => {
    service = new TemplateService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('renderTemplate', () => {
    it('should read, juice, and render the template correctly', async () => {
      const templateName = 'verification'
      const context = { verificationLink: 'http://example.com/verify' }
      const templateContent = '<a href="{{verificationLink}}">Verify Email</a>'
      const juicedContent = '<a href="{{verificationLink}}" style="color: red;">Verify Email</a>'
      const renderedContent = '<a href="http://example.com/verify" style="color: red;">Verify Email</a>'

      vi.spyOn(fs, 'readFile').mockResolvedValue(templateContent)
      vi.mocked(juice).mockReturnValue(juicedContent)
      vi.mocked(radashTemplate).mockReturnValue(renderedContent)

      const result = await service.render(templateName, context)

      expect(fs.readFile).toHaveBeenCalledWith(path.join(__dirname, 'templates', `${templateName}.html`), 'utf-8')
      expect(juice).toHaveBeenCalledWith(templateContent)
      expect(radashTemplate).toHaveBeenCalledWith(juicedContent, context)
      expect(result).toBe(renderedContent)
    })

    it('should throw an error if template file is not found', async () => {
      const templateName = 'nonexistent'
      const context = {}

      vi.spyOn(fs, 'readFile').mockRejectedValue(new Error('File not found'))

      await expect(service.render(templateName, context)).rejects.toThrow('File not found')
    })
  })
})
