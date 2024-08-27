import { Log } from './prisma'

export interface ILog extends Log {}

export interface ICreateLogDto {
  /**
   * User ID associated with the log entry
   */
  userId?: string

  /**
   * User email associated with the log entry
   */
  userEmail?: string

  /**
   * IP address from which the log entry was created
   */
  ip?: string

  /**
   * User agent string from which the log entry was created
   */
  userAgent?: string

  /**
   * Operation performed that is being logged
   */
  operation: string

  /**
   * Log level
   * @default 'info'
   */
  level?: string

  /**
   * Additional metadata for the log entry
   */
  meta?: Record<string, any>

  /**
   * Indicates if the log entry is system-generated
   * @default false
   */
  isSystem?: boolean
}
