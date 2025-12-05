import z from 'zod'
import userSchema from './user'

const authTokenSchema = z.object({
  user: userSchema,
  exp: z.number(),
  iat: z.number(),
})

export type AuthToken = z.infer<typeof authTokenSchema>

export default authTokenSchema
