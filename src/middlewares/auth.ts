import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { secret } from "../access/index";

export async function authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const [_, token] = authHeader.split(' ');

  try {
    verify(token, secret, (err, _decoded) => {
      if(err) {
        return res.status(403).json({ error: 'Failed to authenticate' });
      }

      next();
    });

  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}