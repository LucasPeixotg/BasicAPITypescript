import { friendshipRepository } from '../../repositories/friendship.repository.js'
import { userRepository } from '../../repositories/user.repository.js'
import type { SafeUser } from '../../repositories/user.repository.js'
import type { FriendshipRecord } from '../../repositories/friendship.repository.js'
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '../../errors.js'

export const friendsService = {
  async sendRequest(requesterId: string, targetId: string): Promise<FriendshipRecord> {
    if (requesterId === targetId) {
      throw new BadRequestError('You cannot send a friend request to yourself')
    }

    const target = await userRepository.findById(targetId)
    if (!target) throw new NotFoundError('User not found')

    const existing = await friendshipRepository.findBetween(requesterId, targetId)
    if (existing) {
      if (existing.status === 'accepted') throw new ConflictError('You are already friends with this user')
      if (existing.status === 'blocked') throw new ForbiddenError('Cannot send a request to this user')
      throw new ConflictError('A friend request already exists between you and this user')
    }

    return friendshipRepository.create(requesterId, targetId)
  },

  async acceptRequest(currentUserId: string, requesterId: string): Promise<FriendshipRecord> {
    if (currentUserId === requesterId) {
      throw new BadRequestError('Invalid operation')
    }

    const existing = await friendshipRepository.findBetween(currentUserId, requesterId)
    if (!existing) throw new NotFoundError('No friend request found from this user')
    if (existing.status === 'accepted') throw new ConflictError('You are already friends with this user')
    if (existing.friendId !== currentUserId) throw new ForbiddenError('You can only accept requests sent to you')

    const updated = await friendshipRepository.updateStatus(requesterId, currentUserId, 'accepted')
    if (!updated) throw new NotFoundError('Friend request not found')
    return updated
  },

  async listFriends(userId: string): Promise<SafeUser[]> {
    const records = await friendshipRepository.findAcceptedFriends(userId)
    const otherIds = records.map(r => r.userId === userId ? r.friendId : r.userId)
    const users = await Promise.all(otherIds.map(id => userRepository.findById(id)))
    return users.filter((u): u is SafeUser => u !== null)
  },

  async listPendingReceived(userId: string): Promise<FriendshipRecord[]> {
    return friendshipRepository.findPendingReceived(userId)
  },
}
