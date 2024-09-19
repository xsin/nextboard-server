import { BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { EmailService, EmailType, NBError } from '@nextboard/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from '../config/config.service'
import { VCodeService } from '../vcode/vcode.service'
import { MailService } from './mail.service'
import { NodeMailerService } from './nodemailer.service'
import { ResendService } from './resend.service'
import { TemplateService } from './template.service'

vi.mock('@/common/utils', () => ({
  randomCode: vi.fn().mockReturnValue('123456'),
}))

describe('mailService', () => {
  let service: MailService
  let configService: AppConfigService
  let vcodeService: VCodeService
  let resendService: ResendService
  let nodemailerService: NodeMailerService
  let templateService: TemplateService

  let service1: MailService
  let configService1: AppConfigService
  let vcodeService1: VCodeService
  let resendService1: ResendService
  let templateService1: TemplateService

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
            NB_MAIL_SUBJECT_OTP: 'NextBoard login code custom',
            NB_MAIL_RESEND_INTERVAL: 60,
            NB_BRAND_NAME: 'NextBoard',
            description: 'NextBoard Description',
            author: { name: 'Author', url: 'http://author.com' },
            name: 'NextBoard',
          },
        },
        {
          provide: VCodeService,
          useValue: {
            create: vi.fn(),
            hasCodeWithinResendInterval: vi.fn(),
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
        {
          provide: TemplateService,
          useValue: {
            render: vi.fn(),
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
            NB_MAIL_SUBJECT_OTP: '',
            NB_MAIL_RESEND_INTERVAL: 60,
            NB_BRAND_NAME: 'NextBoard',
            description: 'NextBoard Description',
            author: { name: 'Author', url: 'http://author.com' },
            name: 'NextBoard',
          },
        },
        {
          provide: VCodeService,
          useValue: {
            create: vi.fn(),
            hasCodeWithinResendInterval: vi.fn(),
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
        {
          provide: TemplateService,
          useValue: {
            render: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<MailService>(MailService)
    configService = module.get<AppConfigService>(AppConfigService)
    vcodeService = module.get<VCodeService>(VCodeService)
    resendService = module.get<ResendService>(ResendService)
    nodemailerService = module.get<NodeMailerService>(NodeMailerService)
    templateService = module.get<TemplateService>(TemplateService)

    configService1 = module1.get<AppConfigService>(AppConfigService)
    vcodeService1 = module1.get<VCodeService>(VCodeService)
    resendService1 = module1.get<ResendService>(ResendService)
    service1 = module1.get<MailService>(MailService)
    templateService1 = module1.get<TemplateService>(TemplateService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getFromEmail', () => {
    it('should return NB_SMTP_USER when serviceType is NODEMAILER', () => {
      const result = service.getFromEmail(EmailService.NODEMAILER)
      expect(result).toBe(configService.NB_SMTP_USER)
    })

    it('should return RESEND_FROM when serviceType is RESEND', () => {
      const result = service.getFromEmail(EmailService.RESEND)
      expect(result).toBe(configService.RESEND_FROM)
    })
  })

  describe('sendVerificationEmail', () => {
    it('should send a verification email using default subject', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService1, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService1, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const defaultHtmlContent = '<p>Default verification email</p>'
      const templateRenderMock = vi.spyOn(templateService1, 'render').mockResolvedValue(defaultHtmlContent)

      const result = await service1.sendVerificationEmail(email, undefined, EmailService.RESEND)
      const defaultSubject = 'Welcome to NextBoard, Pls verify your email address'

      expect(sendMock).toHaveBeenCalledWith({
        from: configService1.RESEND_FROM,
        to: email,
        subject: defaultSubject,
        html: defaultHtmlContent,
      })

      expect(templateRenderMock).toHaveBeenCalledWith('verify', {
        verifyUrl: expect.stringContaining('http://localhost/user/verify?email='),
        brandName: 'NextBoard',
        brandDesc: 'NextBoard Description',
        authorName: 'Author',
        authorUrl: 'http://author.com',
        appName: 'NextBoard',
        appUrl: 'http://localhost',
      })

      expect(result).toEqual({
        time: expect.any(Date),
        type: EmailType.VERIFY,
      })
    })

    it('should send a verification email using ResendService', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const defaultHtmlContent = '<p>Default verification email</p>'
      vi.spyOn(templateService, 'render').mockResolvedValue(defaultHtmlContent)

      const result = await service.sendVerificationEmail(email, undefined, EmailService.RESEND)

      expect(sendMock).toHaveBeenCalledWith({
        from: configService.RESEND_FROM,
        to: email,
        subject: configService.NB_MAIL_SUBJECT_VERIFY,
        html: defaultHtmlContent,
      })
      expect(result).toEqual({
        time: expect.any(Date),
        type: EmailType.VERIFY,
      })
    })

    it('should send a verification email using NodeMailerService', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      const sendMock = vi.spyOn(nodemailerService, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })

      const defaultHtmlContent = '<p>Default verification email</p>'
      vi.spyOn(templateService, 'render').mockResolvedValue(defaultHtmlContent)

      const result = await service.sendVerificationEmail(email, undefined, EmailService.NODEMAILER)

      expect(sendMock).toHaveBeenCalledWith({
        from: configService.NB_SMTP_USER,
        to: email,
        subject: configService.NB_MAIL_SUBJECT_VERIFY,
        html: defaultHtmlContent,
      })
      expect(result).toEqual({
        time: expect.any(Date),
        type: EmailType.VERIFY,
      })
    })

    it('should send a verification email with custom HTML content', async () => {
      const email = 'user@example.com'
      const customHtml = '<p>Custom verification email</p>'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
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
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockRejectedValue(new InternalServerErrorException('Send failed'))

      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      expect(sendMock).toHaveBeenCalled()
    })

    it('should throw an InternalServerErrorException if Resend returns an error', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      vi.spyOn(resendService, 'sendEmail').mockResolvedValue({
        data: null,
        error: { message: 'Resend API error', name: 'internal_server_error' },
      })

      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(NBError.EMAIL_SENT_FAILED)
    })

    it('should throw a BadRequestException if a valid verification email already sent', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(true)

      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(BadRequestException)
      await expect(service.sendVerificationEmail(email, undefined, EmailService.RESEND)).rejects.toThrow(NBError.EMAIL_ALREADY_SENT)
    })
  })

  describe('sendOTP', () => {
    it('should send an OTP email with default subject using ResendService', async () => {
      const email = 'test@example.com'
      const code = '123456'
      const expiresInMs = configService.NB_OTP_EXPIRY * 1000
      vi.spyOn(vcodeService1, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService1, 'sendEmail').mockResolvedValue({
        data: { id: '123456' },
        error: null,
      })
      const createMock = vi.spyOn(vcodeService1, 'create').mockResolvedValue({
        id: 1,
        owner: email,
        code,
        expiredAt: expect.any(Date),
        createdAt: expect.any(Date),
      })

      const defaultHtmlContent = '<p>Your OTP code is 123456</p>'
      vi.spyOn(templateService1, 'render').mockResolvedValue(defaultHtmlContent)

      const result = await service1.sendOTP(email, EmailService.RESEND)

      expect(createMock).toHaveBeenCalledWith({
        owner: email,
        code,
        expiredAt: expect.any(Date),
      })
      expect(sendMock).toHaveBeenCalledWith({
        from: configService1.RESEND_FROM,
        to: email,
        subject: 'NextBoard login code',
        html: defaultHtmlContent,
      })
      expect(result).toEqual({
        time: expect.any(Date),
        duration: expiresInMs,
        type: EmailType.OTP,
      })
    })

    it('should send an OTP email using ResendService', async () => {
      const email = 'test@example.com'
      const code = '123456'
      const expiresInMs = configService.NB_OTP_EXPIRY * 1000
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
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

      const defaultHtmlContent = '<p>Your OTP code is 123456</p>'
      vi.spyOn(templateService, 'render').mockResolvedValue(defaultHtmlContent)

      const result = await service.sendOTP(email, EmailService.RESEND)

      expect(createMock).toHaveBeenCalledWith({
        owner: email,
        code,
        expiredAt: expect.any(Date),
      })
      expect(sendMock).toHaveBeenCalledWith({
        from: configService.RESEND_FROM,
        to: email,
        subject: configService.NB_MAIL_SUBJECT_OTP,
        html: defaultHtmlContent,
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
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
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

      const defaultHtmlContent = '<p>Your OTP code is 123456</p>'
      vi.spyOn(templateService, 'render').mockResolvedValue(defaultHtmlContent)

      const result = await service.sendOTP(email, EmailService.NODEMAILER)

      expect(createMock).toHaveBeenCalledWith({
        owner: email,
        code,
        expiredAt: expect.any(Date),
      })
      expect(sendMock).toHaveBeenCalledWith({
        from: configService.NB_SMTP_USER,
        to: email,
        subject: configService.NB_MAIL_SUBJECT_OTP,
        html: defaultHtmlContent,
      })
      expect(result).toEqual({
        time: expect.any(Date),
        duration: expiresInMs,
        type: EmailType.OTP,
      })
    })

    it('should throw an InternalServerErrorException if sending OTP email fails', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(false)
      const sendMock = vi.spyOn(resendService, 'sendEmail').mockRejectedValue(new InternalServerErrorException('Send failed'))

      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(InternalServerErrorException)
      expect(sendMock).toHaveBeenCalled()
    })

    it('should throw a BadRequestException if a valid OTP already exists', async () => {
      const email = 'test@example.com'
      vi.spyOn(vcodeService, 'hasCodeWithinResendInterval').mockResolvedValue(true)

      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(BadRequestException)
      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(NBError.AUTH_OTP_EXISTS)
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
      await expect(service.sendOTP(email, EmailService.RESEND)).rejects.toThrow(NBError.EMAIL_SENT_FAILED)
    })
  })
})
