import { and, eq, or } from 'drizzle-orm'
import { db } from '../db/client.js'
import { friendships } from '../db/schema.js'

export type FriendshipRecord = typeof friendships.$inferSelect
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked'

export const friendshipRepository = {
  /**
   * Send a friend request.
   * Creates a directional row: userId → friendId with status 'pending'.
   */
  async create(userId: string, friendId: string): Promise<FriendshipRecord> {
    const result = await db
      .insert(friendships)
      .values({ userId, friendId, status: 'pending' })
      .returning()

    return result[0]!
  },

  /**
   * Update the status of a friendship row.
   * Only the recipient (friendId) should be allowed to accept/block —
   * enforce that rule in the service layer, not here.
   */
  async updateStatus(
    userId: string,
    friendId: string,
    status: FriendshipStatus
  ): Promise<FriendshipRecord | null> {
    const result = await db
      .update(friendships)
      .set({ status })
      .where(
        and(
          eq(friendships.userId, userId),
          eq(friendships.friendId, friendId)
        )
      )
      .returning()

    return result[0] ?? null
  },

  /**
   * Get ALL accepted friends for a user (both directions).
   * A friendship row is directional, so we check both user_id and friend_id.
   */
  async findAcceptedFriends(userId: string): Promise<FriendshipRecord[]> {
    return db
      .select()
      .from(friendships)
      .where(
        and(
          or(
            eq(friendships.userId, userId),
            eq(friendships.friendId, userId)
          ),
          eq(friendships.status, 'accepted')
        )
      )
  },

  /**
   * Get pending requests RECEIVED by this user (they need to act on these).
   */
  async findPendingReceived(userId: string): Promise<FriendshipRecord[]> {
    return db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.friendId, userId),
          eq(friendships.status, 'pending')
        )
      )
  },

  /**
   * Get pending requests SENT by this user (waiting on others).
   */
  async findPendingSent(userId: string): Promise<FriendshipRecord[]> {
    return db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.userId, userId),
          eq(friendships.status, 'pending')
        )
      )
  },

  /**
   * Find the friendship row between two specific users (either direction).
   * Useful for checking if a relationship already exists before creating one.
   */
  async findBetween(
    userA: string,
    userB: string
  ): Promise<FriendshipRecord | null> {
    const result = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(eq(friendships.userId, userA), eq(friendships.friendId, userB)),
          and(eq(friendships.userId, userB), eq(friendships.friendId, userA))
        )
      )
      .limit(1)

    return result[0] ?? null
  },

  /**
   * Remove a friendship row entirely (unfriend).
   * Works regardless of which user initiated the original request.
   */
  async delete(userA: string, userB: string): Promise<void> {
    await db
      .delete(friendships)
      .where(
        or(
          and(eq(friendships.userId, userA), eq(friendships.friendId, userB)),
          and(eq(friendships.userId, userB), eq(friendships.friendId, userA))
        )
      )
  },
}