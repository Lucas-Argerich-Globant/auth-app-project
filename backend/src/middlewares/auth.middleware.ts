import type { Request, Response, NextFunction } from 'express'
import { decodeToken } from '../services/jwt.ts'
import type { User } from '../models/user.ts'

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.split(' ')[1]
  try {
    const authPayload = decodeToken(token)

    if (authPayload.exp && Date.now() >= authPayload.exp * 1000) {
      return res.status(401).json({ status: 'error', message: 'Token expired' })
    }

    req.user = authPayload.user

    next()
  } catch (err) {
    console.error('JWT verification error:', err)
    return res.status(401).json({ status: 'error', message: 'Invalid token' })
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
  next()
}

export function requireRole(...roles: User['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' })
    }
    next()
  }
}
