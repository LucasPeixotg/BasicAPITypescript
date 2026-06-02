import { z, ZodError } from 'zod';
import type { ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors.js';

export const withBodyValidation = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new BadRequestError(JSON.stringify(z.treeifyError(err))));
        return;
      }
      next(err); // unexpected error — pass it through unchanged
    }
  };
};