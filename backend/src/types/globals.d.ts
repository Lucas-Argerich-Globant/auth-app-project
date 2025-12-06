import type { User } from '../models/user.ts'

declare global {
  namespace Express {
    export interface Request {
      user?: User
    }
  }
}
