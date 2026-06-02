import type { RequestHandler } from 'express';
import { authService } from './auth.service.js';
import type { LoginBody, RegisterBody } from './auth.schemas.js';


export const login: RequestHandler<object, unknown, LoginBody> = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const token = await authService.login(username, password);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export const register: RequestHandler<object, unknown, RegisterBody> = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    await authService.register(username, password);
    res.status(201).send()
  } catch (err) {
    next(err);
  }
};
