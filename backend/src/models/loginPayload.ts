import z from 'zod'

const loginPayload = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type LoginPayload = z.infer<typeof loginPayload>

export default loginPayload
