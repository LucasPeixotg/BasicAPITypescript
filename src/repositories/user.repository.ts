import { eq } from 'drizzle-orm'
import { db } from '../db/client.js'
import { users } from '../db/schema.js'

// What comes back from the DB — includes password_hash
export type UserRecord = typeof users.$inferSelect

// What we expose outside this layer — password_hash stripped
export type SafeUser = Omit<UserRecord, 'passwordHash'>

function stripPassword(user: UserRecord): SafeUser {
  const { passwordHash: _, ...safe } = user
  return safe
}

export const userRepository = {
  /**
   * Find a user by ID.
   * Returns SafeUser (no passwordHash) — safe for service layer use.
   */
  async findById(id: string): Promise<SafeUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return result[0] ? stripPassword(result[0]) : null
  },

  /**
   * Find a user by username.
   * Returns SafeUser — no passwordHash.
   */
  async findByUsername(username: string): Promise<SafeUser | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    return result[0] ? stripPassword(result[0]) : null
  },

  /**
   * Find a user by username.
   * Returns the FULL record including passwordHash — used only for login verification.
   * Never pass this return value outside the auth context.
   */
  async findByUsernameWithPassword(username: string): Promise<UserRecord | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    return result[0] ?? null
  },

  /**
   * Create a new user.
   * Expects passwordHash already hashed — never raw passwords here.
   */
  async create(username: string, passwordHash: string): Promise<SafeUser> {
    const result = await db
      .insert(users)
      .values({ username, passwordHash })
      .returning()

    return stripPassword(result[0]!)
  },

  /**
   * Delete a user by ID.
   * CASCADE in the DB handles friendship cleanup automatically.
   */
  async delete(id: string): Promise<void> {
    await db
      .delete(users)
      .where(eq(users.id, id))
  },
}