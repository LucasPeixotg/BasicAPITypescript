import { z } from 'zod'

export const sendRequestSchema = z.object({
  friendId: z.string().uuid(),
})

export const acceptRequestSchema = z.object({
  requesterId: z.string().uuid(),
})

export type SendRequestBody = z.infer<typeof sendRequestSchema>
export type AcceptRequestBody = z.infer<typeof acceptRequestSchema>
