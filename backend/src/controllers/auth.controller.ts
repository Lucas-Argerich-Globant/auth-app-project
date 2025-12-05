import { Request, Response } from 'express'
import registerPayload from '../models/registerPayload'
import { prisma } from '../config/prisma'
import { hashPassword } from '../utils/auth.utils'
import loginPayloadSchema from '../models/loginPayload'
import { createToken } from '../services/jwt'
import userSchema from '../models/user'

async function registerUser(req: Request, res: Response) {
  const parsedPayload = registerPayload.parse(req.body)

  const exists = await prisma.user.findFirst({
    where: { email: parsedPayload.email },
  })

  if (exists) {
    return res.status(400).json({
      status: 'error',
      message: 'User with this email already exists',
    })
  }

  const hashedPassword = await hashPassword(parsedPayload.password)

  const newUser = await prisma.user.create({
    data: {
      email: parsedPayload.email,
      pass_hash: hashedPassword,
      first_name: parsedPayload.firstName,
      middle_name: parsedPayload.middleName,
      last_name: parsedPayload.lastName,
    },
    omit: {
      pass_hash: true,
    },
  })

  const user = userSchema.parse({
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.first_name,
    middleName: newUser.middle_name,
    lastName: newUser.last_name,
    createdAt: newUser.created_at,
    updatedAt: newUser.updated_at,
  })

  const token = createToken(user, 7)

  return res.status(201).json({
    status: 'success',
    data: {
      user,
      token,
    },
  })
}

async function loginUser(req: Request, res: Response) {
  const parsedPayload = loginPayloadSchema.parse(req.body)

  const rawUser = await prisma.user.findFirst({ where: { email: parsedPayload.email } })

  if (!rawUser) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email or password',
    })
  }

  const hashedPassword = await hashPassword(parsedPayload.password)

  if (rawUser.pass_hash !== hashedPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email or password',
    })
  }

  const user = userSchema.parse({
    id: rawUser.id,
    email: rawUser.email,
    firstName: rawUser.first_name,
    middleName: rawUser.middle_name,
    lastName: rawUser.last_name,
    createdAt: rawUser.created_at,
    updatedAt: rawUser.updated_at,
  })

  const token = createToken(user, 7)

  return res.status(200).json({
    status: 'success',
    data: {
      user,
      token,
    },
  })
}

async function getUser(req: Request, res: Response) {
  const user = req.user

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
}

export default { registerUser, loginUser, getUser }
