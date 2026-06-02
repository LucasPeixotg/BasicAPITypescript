import { Router } from 'express';
import { withBodyValidation } from '../../middleware/withBodyValidation.js';

import { register, login } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *           minLength: 8
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCredentials'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
authRouter.post('/register', withBodyValidation(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCredentials'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
authRouter.post('/login', withBodyValidation(loginSchema), login);

export default authRouter;