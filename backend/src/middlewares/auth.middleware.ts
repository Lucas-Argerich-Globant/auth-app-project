import type { Request, Response, NextFunction } from 'express'
import { decodeToken } from '../services/jwt.ts'
import type { User } from '../models/user.ts'
import { prisma } from '../config/prisma.ts'
import { objectSnakeToCamelCase } from '../utils/index.ts'
import userSchema from '../models/user.ts'

export async function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.split(' ')[1]
  try {
    const authPayload = decodeToken(token)

    if (authPayload.exp && Date.now() >= authPayload.exp * 1000) {
      return res.status(401).json({ status: 'error', message: 'Token expirado' })
    }

    const user = await prisma.user.findFirst({ where: { id: authPayload.user.id }})

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' })
    }

    req.user = userSchema.parse(objectSnakeToCamelCase(user))

    next()
  } catch (err) {
    console.error('JWT verification error:', err)
    return res.status(401).json({ status: 'error', message: 'Token invalido' })
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'No autorizado' })
  }
  next()
}

export function requireRole(...roles: User['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Acceso prohibido' })
    }
    next()
  }
}
