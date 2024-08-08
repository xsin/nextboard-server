import bcrypt from 'bcrypt'

export async function saltAndHashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePasswords(pwd: string, pwdHashed: string): Promise<boolean> {
  return bcrypt.compare(pwd, pwdHashed)
}
