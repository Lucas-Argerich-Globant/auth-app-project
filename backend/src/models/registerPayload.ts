import z from 'zod'

const registerPayloadSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  email: z.email(),
  password: z.string().min(8).regex(/\d/)
})

export type RegisterPayload = z.infer<typeof registerPayloadSchema>

export default registerPayloadSchema
