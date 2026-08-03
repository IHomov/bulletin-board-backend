import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
  req.body = result.data;
  next();
};

export const validateQuery = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
 
  req.query = result.data as any;
  next();
};

export const validateParams = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }
 
  req.params = result.data as any;
  next();
};