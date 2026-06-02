import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors.js'

export const requireAuth: RequestHandler = (req, _res, next) => {
  const secret = process.env['JWT_SECRET']
  if (!secret) throw new UnauthorizedError()

  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) throw new UnauthorizedError()

  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, secret) as { id: string; role: string }
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    throw new UnauthorizedError()
  }
}
