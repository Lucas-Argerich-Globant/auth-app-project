import z from 'zod'

const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

export default userSchema
