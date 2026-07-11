import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const generateToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
// ── POST /api/auth/register ───────────────
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, city } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Naam, email aur password zaroori hain" });
      return;
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      res.status(400).json({ message: "Yeh email already registered hai" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, phone, city: city || "Karachi" },
      select: { id: true, name: true, email: true, role: true, city: true },
    });

    res.status(201).json({ message: "Account ban gaya!", token: generateToken(user.id), user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── POST /api/auth/login ──────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email aur password chahiye" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Email ya password galat hai" });
      return;
    }

    const { password: _pw, ...safeUser } = user;
    res.json({ message: "Login ho gaye!", token: generateToken(user.id), user: safeUser });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/auth/me ──────────────────────
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, role: true, phone: true, city: true, address: true, createdAt: true },
    });
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── PUT /api/auth/profile ─────────────────
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address, city } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { name, phone, address, city },
      select: { id: true, name: true, email: true, phone: true, address: true, city: true },
    });
    res.json({ message: "Profile update ho gaya", user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
