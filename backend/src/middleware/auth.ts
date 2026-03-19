// ============================================================
// FILE: backend/src/middleware/auth.ts
// PURPOSE: JWT verification middleware for protected admin routes.
//          Attach this to any route that requires admin login.
// USAGE:   router.post('/route', requireAuth, handler)
// ============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include admin payload
export interface AuthRequest extends Request {
  admin?: { id: string; email: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  // Token must be in Authorization header as: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string; email: string; role: string;
    };
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid or expired. Please log in again.' });
  }
}