import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export default function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    console.log(err)
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request data',
    })
  }
  
  console.error('Error:', err)
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
