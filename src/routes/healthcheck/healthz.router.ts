import { Router, type RequestHandler } from 'express';

const healthzRouter = Router();

/**
 * @openapi
 * /healthz:
 *   get:
 *     tags:
 *       - Health
 *     summary: Liveness probe
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
const health: RequestHandler = (_req, res) => {
  res.json({ status: 'ok' });
};

healthzRouter.get('/', health);

export default healthzRouter;
