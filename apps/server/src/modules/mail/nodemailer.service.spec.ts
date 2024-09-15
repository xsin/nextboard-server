import type { Transporter } from 'nodemailer'
import { createTransport } from 'nodemailer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from '../config/config.service'
import { NodeMailerService } from './nodemailer.service'

vi.mock('nodemailer', () => ({
  createTransport: vi.fn(),
}))

describe('nodeMailerService', () => {
  let nodeMailerService: NodeMailerService
  let configService: AppConfigService
  let transporter: Transporter

  beforeEach(() => {
    configService = {
      NB_SMTP_HOST: 'smtp.example.com',
      NB_SMTP_PORT: 587,
      NB_SMTP_SECURE: false,
      NB_SMTP_USER: 'user@example.com',
      NB_SMTP_PASS: 'password',
    } as AppConfigService

    transporter = {
      sendMail: vi.fn(),
    } as unknown as Transporter

    vi.mocked(createTransport).mockReturnValue(transporter)

    nodeMailerService = new NodeMailerService(configService)
  })

  it('should be defined', () => {
    expect(nodeMailerService).toBeDefined()
  })

  it('should send email successfully', async () => {
    const options = {
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    }

    const info = { messageId: '12345' }
    vi.mocked(transporter.sendMail).mockResolvedValue(info)

    const result = await nodeMailerService.sendEmail(options)

    expect(result).toEqual({
      data: { id: '12345' },
      error: null,
    })
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  })

  it('should handle email sending error', async () => {
    const options = {
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    }

    const error = new Error('Failed to send email')
    vi.mocked(transporter.sendMail).mockRejectedValue(error)

    const result = await nodeMailerService.sendEmail(options)

    expect(result).toEqual({
      data: null,
      error,
    })
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  })
})
