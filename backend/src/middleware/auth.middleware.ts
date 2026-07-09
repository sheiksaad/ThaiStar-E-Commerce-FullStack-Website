import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

// ── Login check ───────────────────────────
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Pehle login karo" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, email: true },
    });
    if (!user) {
      res.status(401).json({ message: "User nahi mila" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token galat hai" });
  }
};

// ── Admin only ────────────────────────────
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === "ADMIN") return next();
  res.status(403).json({ message: "Sirf admin kar sakta hai" });
};
