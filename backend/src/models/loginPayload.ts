import z from 'zod'

const loginPayloadSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type LoginPayload = z.infer<typeof loginPayloadSchema>

export default loginPayloadSchema
