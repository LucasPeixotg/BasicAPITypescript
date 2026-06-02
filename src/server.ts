import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/logger.js'
import swaggerSpec from './swagger.js'

import authRouter from './routes/auth/auth.router.js'
import friendsRouter from './routes/friends/friends.router.js'
import healthzRouter from './routes/healthcheck/healthz.router.js'

const app = express();

// 1. Security & parsing (global — runs on every request)
app.use(helmet())
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }))
app.use(express.json())
app.use(requestLogger)

// 2. API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// 3. Routes
app.use('/auth', authRouter)
app.use('/friends', friendsRouter)
app.use('/healthz', healthzRouter)

// 4. Error handler — MUST be last
app.use(errorHandler)

export default app;