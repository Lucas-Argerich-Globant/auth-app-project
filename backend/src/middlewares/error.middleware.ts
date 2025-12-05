import { Request, Response } from 'express'

export default function errorMiddleware(err: Error, _req: Request, res: Response) {
  console.error('Error:', err)
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
