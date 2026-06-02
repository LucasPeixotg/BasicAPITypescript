import { Router } from 'express'
import { requireAuth } from '../../middleware/requireAuth.js'
import { withBodyValidation } from '../../middleware/withBodyValidation.js'
import { sendRequestSchema, acceptRequestSchema } from './friends.schemas.js'
import {
  sendRequest,
  acceptRequest,
} from './friends.controller.js'

/**
 * @openapi
 * components:
 *   schemas:
 *     FriendshipRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         friendId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [pending, accepted, blocked]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     SendRequestBody:
 *       type: object
 *       required:
 *         - friendId
 *       properties:
 *         friendId:
 *           type: string
 *           format: uuid
 *     AcceptRequestBody:
 *       type: object
 *       required:
 *         - requesterId
 *       properties:
 *         requesterId:
 *           type: string
 *           format: uuid
 */

const friendsRouter = Router()

/**
 * @openapi
 * /friends/requests:
 *   post:
 *     tags:
 *       - Friends
 *     summary: Send a friend request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendRequestBody'
 *     responses:
 *       201:
 *         description: Friend request sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendshipRecord'
 *       400:
 *         description: Validation error or self-request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Target user not found
 *       409:
 *         description: Request or friendship already exists
 */
friendsRouter.post('/requests', requireAuth, withBodyValidation(sendRequestSchema), sendRequest)

/**
 * @openapi
 * /friends/requests/accept:
 *   post:
 *     tags:
 *       - Friends
 *     summary: Accept a pending friend request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptRequestBody'
 *     responses:
 *       200:
 *         description: Friend request accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendshipRecord'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Request was not addressed to you
 *       404:
 *         description: No pending request found from this user
 *       409:
 *         description: Already friends
 */
friendsRouter.post('/requests/accept', requireAuth, withBodyValidation(acceptRequestSchema), acceptRequest)

export default friendsRouter
