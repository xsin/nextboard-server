import type {
  CreateEmailOptions,
  CreateEmailResponse,
} from 'resend'

export type TCreateEmailOptions = CreateEmailOptions
export interface ICreateEmailResponse extends CreateEmailResponse {}

export interface INodeMailerResponse {
  messageId: string
}

export interface IEmailContext {
  verifyUrl?: string
  brandName?: string
  brandDesc?: string
  authorName?: string
  authorUrl?: string
  appName?: string
  appUrl?: string
  vCode?: string
}
