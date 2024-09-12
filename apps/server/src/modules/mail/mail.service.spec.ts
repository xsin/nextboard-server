import { InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { EmailType } from '@nextboard/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from '../config/config.service'
import { VCodeService } from '../vcode/vcode.service'
import { MailService } from './mail.service'
import { ResendService } from './resend.service'

vi.mock('@/common/utils', () => ({
  randomCode: vi.fn().mockReturnValue('123456'),
}))

describe('mailService', () => {
  let service: MailService
  let configService: AppConfigService
  let vcodeService: VCodeService
  let resendService: ResendService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: AppConfigService,
          useValue: {
            RESEND_API_KEY: 'test-api-key',
            RESEND_FROM: 'test@example.com',
            RESEND_VERIFY_MAIL_SUBJECT: 'Verify your email',
            NB_BASE_URL: 'http://localhost',
            NB_API_PREFIX: 'api',
            NB_OTP_EXPIRY: 300,
          },
        },
        {
          provide: VCodeService,
          useValue: {
            create: vi.fn(),
          },
        },
        {
          provide: ResendService,
          useValue: {
            sendEmail: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<MailService>(MailService)
    configService = module.get<AppConfigService>(AppConfigService)
    vcodeService = module.get<VCodeService>(VCodeService)
    resendService = module.get<ResendService>(ResendService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('sendVerificationEmail', () => {
    it('should send a verification email', async () => {
      const email = 'test@example.com'
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const result = await service.sendVerificationEmail(email)

      expect(sendMock).toHaveBeenCalledWith({
        from: configService.RESEND_FROM,
        to: email,
        subject: configService.RESEND_VERIFY_MAIL_SUBJECT,
        html: expect.stringContaining('Verify Email'),
      })
      expect(result).toEqual({
        time: expect.any(Date),
        type: EmailType.VERIFY,
      })
    })

    it('should send a verification email with custom HTML content', async () => {
      const email = 'user@example.com'
      const customHtml = '<p>Custom verification email</p>'
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({ data: { id: '123' }, error: null })

      await service.sendVerificationEmail(email, customHtml)

      expect(resendService.sendEmail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: email,
        subject: 'Verify your email',
        html: customHtml,
      })
    })

    it('should throw an InternalServerErrorException if sending email fails', async () => {
      const email = 'test@example.com'
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockRejectedValue(new InternalServerErrorException('Send failed'))

      await expect(service.sendVerificationEmail(email)).rejects.toThrow(InternalServerErrorException)
      expect(sendMock).toHaveBeenCalled()
    })

    it('should throw an InternalServerErrorException if Resend returns an error', async () => {
      const email = 'test@example.com'
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: null,
        error: { message: 'Resend API error', name: 'internal_server_error' },
      })

      await expect(service.sendVerificationEmail(email)).rejects.toThrow(InternalServerErrorException)
      await expect(service.sendVerificationEmail(email)).rejects.toThrow('Resend API error')
    })
  })

  describe('sendOTP', () => {
    it('should send an OTP email', async () => {
      const email = 'test@example.com'
      const code = '123456'
      const expiresInMs = configService.NB_OTP_EXPIRY * 1000
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })
      const createMock = vi.spyOn(vcodeService, 'create').mockResolvedValue({
        id: 1,
        owner: email,
        code,
        expiredAt: expect.any(Date),
        createdAt: expect.any(Date),
      })

      const result = await service.sendOTP(email)

      expect(createMock).toHaveBeenCalledWith({
        owner: email,
        code,
        expiredAt: expect.any(Date),
      })
      expect(sendMock).toHaveBeenCalledWith({
        from: configService.RESEND_FROM,
        to: email,
        subject: 'NextBoard login code',
        html: `Your login verification code is ${code}`,
      })
      expect(result).toEqual({
        time: expect.any(Date),
        duration: expiresInMs,
        type: EmailType.OTP,
      })
    })

    it('should throw an InternalServerErrorException if sending OTP email fails', async () => {
      const email = 'test@example.com'
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockRejectedValue(new InternalServerErrorException('Send failed'))

      await expect(service.sendOTP(email)).rejects.toThrow(InternalServerErrorException)
      expect(sendMock).toHaveBeenCalled()
    })

    it('should handle missing NB_API_PREFIX', async () => {
      const email = 'user@example.com'
      vi.spyOn(configService, 'NB_API_PREFIX', 'get').mockReturnValue('')
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({ data: { id: '123' }, error: null })

      await service.sendVerificationEmail(email)

      expect(resendService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        html: expect.stringContaining('http://localhost/user/verify?email=user@example.com'),
      }))
    })

    it('should use default subject if RESEND_VERIFY_MAIL_SUBJECT is not set', async () => {
      const email = 'user@example.com'
      vi.spyOn(configService, 'RESEND_VERIFY_MAIL_SUBJECT', 'get').mockReturnValue(undefined)
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({ data: { id: '123' }, error: null })

      await service.sendVerificationEmail(email)

      expect(resendService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
        subject: 'Welcome to NextBoard, Pls verify your email address',
      }))
    })

    it('should throw an InternalServerErrorException if Resend returns an error for OTP email', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'create').mockResolvedValue({
        id: 1,
        owner: email,
        code: '123456',
        expiredAt: new Date(),
        createdAt: new Date(),
      })
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: null,
        error: { message: 'Resend API error for OTP', name: 'internal_server_error' },
      })

      await expect(service.sendOTP(email)).rejects.toThrow(InternalServerErrorException)
      await expect(service.sendOTP(email)).rejects.toThrow('Resend API error for OTP')
    })
  })
})
