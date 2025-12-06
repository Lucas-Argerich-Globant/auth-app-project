import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import authTokenSchema from '../models/authToken.ts'

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, SECRET_KEY)

    const authPayload = authTokenSchema.parse(decoded)

    if (authPayload.exp && Date.now() >= authPayload.exp * 1000) {
      return res.status(401).json({ message: 'Token expired' })
    }

    req.user = authPayload.user

    next()
  } catch (err) {
    console.error('JWT verification error:', err)
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}