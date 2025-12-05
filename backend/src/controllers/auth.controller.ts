import { Request, Response } from 'express'

async function registerUser(req: Request, res: Response) {
  // Handle registration logic here
}

async function loginUser(req: Request, res: Response) {
  // Handle login logic here
}

async function getUser(req: Request, res: Response) {
  // Handle fetching user info logic here
}

export default { registerUser, loginUser, getUser }
