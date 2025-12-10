import type { Request, Response } from 'express'
import registerPayload from '../models/registerPayload.ts'
import { prisma } from '../config/prisma.ts'
import { comparePassword, hashPassword } from '../utils/auth.utils.ts'
import loginPayloadSchema from '../models/loginPayload.ts'
import { createToken } from '../services/jwt.ts'
import userSchema from '../models/user.ts'

async function registerUser(req: Request, res: Response) {
  // Validate and parse the incoming registration payload
  const parsedPayload = registerPayload.parse(req.body)

  // Check if a user with the same email already exists
  const exists = await prisma.user.findFirst({
    where: { email: parsedPayload.email },
  })

  if (exists) {
    // If user exists, return error
    return res.status(400).json({
      status: 'error',
      message: 'User with this email already exists',
    })
  }

  // Hash the user's password before saving
  const hashedPassword = await hashPassword(parsedPayload.password)

  // Create the new user in the database, omitting the password hash from the returned object
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

  // Parse and format the user object for the response
  const user = userSchema.parse({
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.first_name,
    middleName: newUser.middle_name,
    lastName: newUser.last_name,
    createdAt: newUser.created_at,
    updatedAt: newUser.updated_at,
  })

  // Create a JWT token for the new user (valid for 7 days)
  const token = createToken(user, 7)

  // Return the user and token in the response
  return res.status(201).json({
    status: 'success',
    data: {
      user,
      token,
    },
  })
}

async function loginUser(req: Request, res: Response) {
  // Validate and parse the login payload
  const parsedPayload = loginPayloadSchema.parse(req.body)

  // Find the user by email
  const rawUser = await prisma.user.findFirst({ where: { email: parsedPayload.email } })

  if (!rawUser) {
    // If user not found, return generic error (do not reveal which field is wrong)

    prisma.loginMetric.create({
      data: {
        success: false,
        error: 'EMAIL_ACCOUNT_NOT_FOUND'
      }
    })

    return res.status(400).json({
      status: 'error',
      message: 'Invalid email or password'
    })
  }

  // Compare the provided password with the stored password hash
  const isCorrectPassword = await comparePassword(parsedPayload.password, rawUser.pass_hash)

  if (!isCorrectPassword) {
    // If password is incorrect, return same error as above

    prisma.loginMetric.create({
      data: {
        success: false,
        error: 'INCORRECT_PASSWORD',
        user_id: rawUser.id
      }
    })

    return res.status(400).json({
      status: 'error',
      message: 'Invalid email or password'
    })
  }

  prisma.loginMetric.create({
    data: {
      success: true,
      user_id: rawUser.id
    }
  })

  // Parse and format the user object for the response
  const user = userSchema.parse({
    id: rawUser.id,
    email: rawUser.email,
    firstName: rawUser.first_name,
    middleName: rawUser.middle_name,
    lastName: rawUser.last_name,
    createdAt: rawUser.created_at,
    updatedAt: rawUser.updated_at
  })

  // Create a JWT token for the user (valid for 7 days)
  const token = createToken(user, 7)

  // Return the user and token in the response
  return res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    }
  })
}

async function getUser(req: Request, res: Response) {
  // Find the user by their unique ID, omitting the password hash
  const rawUser = await prisma.user.findUnique({
    where: { id: req.user!.id },
    omit: {
      pass_hash: true,
    },
  })

  // This check is mostly redundant due to requireAuth middleware
  if (!rawUser) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    })
  }

  // Parse and format the user object for the response
  const user = userSchema.parse({
    id: rawUser.id,
    email: rawUser.email,
    firstName: rawUser.first_name,
    middleName: rawUser.middle_name,
    lastName: rawUser.last_name,
    createdAt: rawUser.created_at,
    updatedAt: rawUser.updated_at,
  })

  // Re-use same token, exp should only reset with login
  const token = req.headers.authorization!.split(' ')[1]

  // Return the user data
  return res.status(200).json({
    status: 'success',
    data: {
      user,
      token
    },
  })
}

// Export the controller functions for use in routes
export default { registerUser, loginUser, getUser }
