import z from 'zod'

const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  role: z.enum(['user', 'admin']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof userSchema>

export default userSchema
