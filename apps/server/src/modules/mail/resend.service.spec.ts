import type { ICreateEmailResponse } from '@/types'
import { Test, TestingModule } from '@nestjs/testing'
import { Resend } from 'resend'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from '../config/config.service'
import { ResendService } from './resend.service'

vi.mock('resend', () => {
  const Resend = vi.fn()
  Resend.prototype.emails = {
    send: vi.fn(),
  }
  return {
    Resend,
  }
})

describe('resendService', () => {
  let service: ResendService
  let configService: AppConfigService
  let resendMock: Resend

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResendService,
        {
          provide: AppConfigService,
          useValue: {
            RESEND_API_KEY: 'test-api-key',
          },
        },
      ],
    }).compile()

    service = module.get<ResendService>(ResendService)
    configService = module.get<AppConfigService>(AppConfigService)
    resendMock = new Resend(configService.RESEND_API_KEY)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should initialize Resend with the correct API key', () => {
    expect(Resend).toHaveBeenCalledWith('test-api-key')
  })

  it('should send an email', async () => {
    const sendMock = vi.spyOn(resendMock.emails, 'send').mockImplementation(() => {
      return Promise.resolve({
        data: { id: '123456' },
        error: null,
      })
    })

    const options = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    }

    const result = await service.sendEmail(options)

    expect(sendMock).toHaveBeenCalledWith(options)
    expect(result).toEqual({
      data: { id: '123456' },
      error: null,
    })
  })

  it('should throw an error if sending email fails', async () => {
    const sendMock = vi.spyOn(resendMock.emails, 'send').mockRejectedValue(new Error('Send failed'))

    const options = {
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    }

    await expect(service.sendEmail(options)).rejects.toThrow('Send failed')
    expect(sendMock).toHaveBeenCalledWith(options)
  })

  it('should handle multiple recipients', async () => {
    const mockResponse: ICreateEmailResponse = {
      data: { id: '123456' },
      error: null,
    }
    vi.spyOn(resendMock.emails, 'send').mockResolvedValue(mockResponse)

    const options = {
      from: 'test@example.com',
      to: ['recipient1@example.com', 'recipient2@example.com'],
      subject: 'Test Email',
      html: '<p>This is a test email</p>',
    }

    const result = await service.sendEmail(options)

    expect(resendMock.emails.send).toHaveBeenCalledWith(options)
    expect(result).toEqual(mockResponse)
  })
})
