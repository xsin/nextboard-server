import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { EmailService, EmailType } from '@nextboard/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from '../config/config.service'
import { VCodeService } from '../vcode/vcode.service'
import { MailService } from './mail.service'
import { NodeMailerService } from './nodemailer.service'
import { ResendService } from './resend.service'

vi.mock('@/common/utils', () => ({
  randomCode: vi.fn().mockReturnValue('123456'),
}))

describe('mailService', () => {
  let service: MailService
  let configService: AppConfigService
  let vcodeService: VCodeService
  let resendService: ResendService
  let nodemailerService: NodeMailerService

  let service1: MailService
  let configService1: AppConfigService
  let vcodeService1: VCodeService
  let resendService1: ResendService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: AppConfigService,
          useValue: {
            RESEND_API_KEY: 'test-api-key',
            RESEND_FROM: 'test@example.com',
            NB_MAIL_SUBJECT_VERIFY: 'Verify your email',
            NB_BASE_URL: 'http://localhost',
            NB_API_PREFIX: 'api',
            NB_OTP_EXPIRY: 300,
            NB_SMTP_HOST: 'smtp.example.com',
            NB_SMTP_PORT: 587,
            NB_SMTP_USER: 'user',
            NB_SMTP_PASS: 'password',
            NB_SMTP_SECURE: false,
            NB_MAIL_VERIFY_EXPIRY: 86400,
          },
        },
        {
          provide: VCodeService,
          useValue: {
            create: vi.fn(),
            hasValidCode: vi.fn(),
            generateOwner: vi.fn().mockImplementation((email, type) => `${email}:${type}`),
            verify: vi.fn(),
          },
        },
        {
          provide: ResendService,
          useValue: {
            sendEmail: vi.fn(),
          },
        },
        {
          provide: NodeMailerService,
          useValue: {
            sendEmail: vi.fn(),
          },
        },
      ],
    }).compile()

    const module1: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: AppConfigService,
          useValue: {
            RESEND_API_KEY: 'test-api-key',
            RESEND_FROM: 'test@example.com',
            NB_MAIL_SUBJECT_VERIFY: '',
            NB_BASE_URL: 'http://localhost',
            NB_API_PREFIX: '',
            NB_OTP_EXPIRY: 300,
            NB_SMTP_HOST: 'smtp.example.com',
            NB_SMTP_PORT: 587,
            NB_SMTP_USER: 'user',
            NB_SMTP_PASS: 'password',
            NB_SMTP_SECURE: false,
            NB_MAIL_VERIFY_EXPIRY: 86400,
          },
        },
        {
          provide: VCodeService,
          useValue: {
            create: vi.fn(),
            hasValidCode: vi.fn(),
            generateOwner: vi.fn().mockImplementation((email, type) => `${email}:${type}`),
            verify: vi.fn(),
          },
        },
        {
          provide: ResendService,
          useValue: {
            sendEmail: vi.fn(),
          },
        },
        {
          provide: NodeMailerService,
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
    nodemailerService = module.get<NodeMailerService>(NodeMailerService)

    configService1 = module1.get<AppConfigService>(AppConfigService)
    vcodeService1 = module1.get<VCodeService>(VCodeService)
    resendService1 = module1.get<ResendService>(ResendService)
    service1 = module1.get<MailService>(MailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('sendVerificationEmail', () => {
    it('should send a verification email using default subject', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService1, 'hasValidCode').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService1, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const result = await service1.sendVerificationEmail(email, undefined, EmailService.RESEND)
      const defaultSubject = 'Welcome to NextBoard, Pls verify your email address'

      expect(sendMock).toHaveBeenCalledWith({
        from: configService1.RESEND_FROM,
        to: email,
        subject: defaultSubject,
        html: expect.stringContaining('/user/verify?email='),
      })
      expect(result).toEqual({
        time: expect.any(Date),
        type: EmailType.VERIFY,
      })
    })

    it('should send a verification email using ResendService', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const result = await service.sendVerificationEmail(email, undefined, EmailService.RESEND)

      expect(sendMock).toHaveBeenCalledWith({
        from: configService.RESEND_FROM,
        to: email,
        subject: configService.NB_MAIL_SUBJECT_VERIFY,
        html: expect.stringContaining('Verify Email'),
      })
      expect(result).toEqual({
        time: expect.any(Date),
        type: EmailType.VERIFY,
      })
    })

    it('should send a verification email using NodeMailerService', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      const sendMock = vi.spyOn(nodemailerService, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const result = await service.sendVerificationEmail(email, undefined, EmailService.NODEMAILER)

      expect(sendMock).toHaveBeenCalledWith({
        from: configService.RESEND_FROM,
        to: email,
        subject: configService.NB_MAIL_SUBJECT_VERIFY,
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
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({ data: { id: '123' }, error: null })

      await service.sendVerificationEmail(email, customHtml, EmailService.RESEND)

      expect(resendService.sendEmail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: email,
        subject: 'Verify your email',
        html: customHtml,
      })
    })

    it('should throw an InternalServerErrorException if sending email fails', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockRejectedValue(new InternalServerErrorException('Send failed'))

      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      expect(sendMock).toHaveBeenCalled()
    })

    it('should throw an InternalServerErrorException if Resend returns an error', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: null,
        error: { message: 'Resend API error', name: 'internal_server_error' },
      })

      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow('Resend API error')
    })

    it('should throw a BadRequestException if a valid verification email already sent', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(true)

      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(BadRequestException)
    })
  })

  describe('sendOTP', () => {
    it('should send an OTP email using ResendService', async () => {
      const email = 'test@example.com'
      const code = '123456'
      const expiresInMs = configService.NB_OTP_EXPIRY * 1000
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
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

      const result = await service.sendOTP(email, EmailService.RESEND)

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

    it('should send an OTP email using NodeMailerService', async () => {
      const email = 'test@example.com'
      const code = '123456'
      const expiresInMs = configService.NB_OTP_EXPIRY * 1000
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      const sendMock = vi.spyOn(nodemailerService, 'sendEmail').mockResolvedValue({
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

      const result = await service.sendOTP(email, EmailService.NODEMAILER)

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
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockRejectedValue(new InternalServerErrorException('Send failed'))

      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      expect(sendMock).toHaveBeenCalled()
    })

    it('should throw a BadRequestException if a valid OTP already exists', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasValidCode').mockResolvedValue(true)

      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(BadRequestException)
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

      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow('Resend API error for OTP')
    })
  })
})
