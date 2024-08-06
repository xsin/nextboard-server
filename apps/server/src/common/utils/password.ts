import * as bcrypt from 'bcrypt'

export async function saltAndHashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
