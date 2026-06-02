import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userRepository } from '../../repositories/user.repository.js'
import { ConflictError, UnauthorizedError } from '../../errors.js'

const SALT_ROUNDS = 10

export const authService = {
  async register(username: string, password: string): Promise<void> {
    const existing = await userRepository.findByUsername(username)
    if (existing) throw new ConflictError('Username already taken')

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    await userRepository.create(username, passwordHash)
  },

  async login(username: string, password: string): Promise<string> {
    const secret = process.env['JWT_SECRET']
    if (!secret) throw new Error('JWT_SECRET is not set')

    const user = await userRepository.findByUsernameWithPassword(username)
    if (!user) throw new UnauthorizedError('Invalid credentials')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedError('Invalid credentials')

    return jwt.sign({ id: user.id }, secret, { expiresIn: '7d' })
  },
}
