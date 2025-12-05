import { Request, Response } from 'express'
import registerPayload from '../models/registerPayload'
import { prisma } from '../config/prisma'
import { hashPassword } from '../utils/auth.utils'
import loginPayload from '../models/loginPayload'

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

  return res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  })
}

async function loginUser(req: Request, res: Response) {
  const parsedPayload = loginPayload.parse(req.body)

  const user = await prisma.user.findFirst({ where: { email: parsedPayload.email } })

  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email or password',
    })
  }

  const { pass_hash, ...userWithoutPassHash } = user

  const hashedPassword = await hashPassword(parsedPayload.password)
  if (pass_hash !== hashedPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email or password',
    })
  }

  return res.status(200).json({
    status: 'success',
    data: {
      user: userWithoutPassHash,
    },
  })
}

async function getUser(req: Request, res: Response) {
  // Handle fetching user info logic here
}

export default { registerUser, loginUser, getUser }
