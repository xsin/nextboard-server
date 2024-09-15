import type {
  CreateEmailOptions,
  CreateEmailResponse,
} from 'resend'

export type TCreateEmailOptions = CreateEmailOptions
export interface ICreateEmailResponse extends CreateEmailResponse {}

export interface INodeMailerResponse {
  messageId: string
}
