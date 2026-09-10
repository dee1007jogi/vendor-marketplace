import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

const JWT_SECRET = process.env.JWT_SECRET || "vendimatch_secret_mvp_2024";

export interface UserPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Try JWT Bearer header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      req.user = decoded;
      return next();
    } catch (error) {
      // Continue to fallback
    }
  }

  // 2. Try userId from Query, Body or Headers
  const userId = (req.query.userId as string) || (req.body?.userId as string) || (req.headers["x-user-id"] as string);
  if (userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        req.user = { id: user.id, role: user.role };
        return next();
      }
    } catch (err) {
      // Ignore
    }
  }

  return res.status(401).json({ error: "Unauthorized. Token or valid user session missing." });
};

export const requireRole = (role: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const expectedRoles = (Array.isArray(role) ? role : [role]).map(r => r.toLowerCase());
    const userRole = (req.user.role || "").toLowerCase();

    if (!expectedRoles.includes(userRole) && userRole !== "admin") {
      return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
    }

    next();
  };
};
