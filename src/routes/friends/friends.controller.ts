import type { RequestHandler } from 'express'
import { friendsService } from './friends.service.js'
import type { SendRequestBody, AcceptRequestBody } from './friends.schemas.js'

export const sendRequest: RequestHandler<object, unknown, SendRequestBody> = async (req, res, next) => {
  try {
    const friendship = await friendsService.sendRequest(req.user!.id, req.body.friendId)
    res.status(201).json({ success: true, data: friendship })
  } catch (err) {
    next(err)
  }
}

export const acceptRequest: RequestHandler<object, unknown, AcceptRequestBody> = async (req, res, next) => {
  try {
    const friendship = await friendsService.acceptRequest(req.user!.id, req.body.requesterId)
    res.status(200).json({ success: true, data: friendship })
  } catch (err) {
    next(err)
  }
}
