import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;