import jwt from 'jsonwebtoken'
import authTokenSchema from '../models/authToken.ts'
import type { User } from '../models/user.ts'

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'

function createToken(user: User, daysToExpire: number): string {
  const tokenBody = authTokenSchema.parse({
    user,
    exp: Math.floor((Date.now() + new Date(0).setHours(24 * daysToExpire)) / 1000),
    iat: Math.floor(Date.now() / 1000),
  })
  const token = jwt.sign(tokenBody, SECRET_KEY)
  return token
}

function decodeToken(token: string) {
  const decoded = jwt.verify(token, SECRET_KEY)

  const authPayload = authTokenSchema.parse(decoded)
  return authPayload
}

export { createToken, decodeToken }
