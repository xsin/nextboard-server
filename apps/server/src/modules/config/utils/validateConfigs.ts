import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { ConfigDto } from '../dto'

export function validateConfigs(config: Record<string, unknown>): ConfigDto {
  const validatedConfig = plainToClass(ConfigDto, config, { enableImplicitConversion: true })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
