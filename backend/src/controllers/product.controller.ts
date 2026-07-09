import { Request, Response } from "express";
import prisma from "../prisma";
import { Category } from "@prisma/client";

// ── GET /api/products ─────────────────────
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort, page = "1", limit = "12" } = req.query;

    const where: any = { isActive: true };

    if (category) where.category = category as Category;
    if (brand) where.brand = { contains: brand as string, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { brand: { contains: search as string, mode: "insensitive" } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy: any =
      sort === "price_asc" ? { price: "asc" }
      : sort === "price_desc" ? { price: "desc" }
      : sort === "name" ? { name: "asc" }
      : { createdAt: "desc" };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: Number(limit) }),
      prisma.product.count({ where }),
    ]);

    res.json({ total, page: Number(page), pages: Math.ceil(total / Number(limit)), products });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/products/:id ─────────────────
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || !product.isActive) {
      res.status(404).json({ message: "Product nahi mila" });
      return;
    }
    res.json(product);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── POST /api/products (admin) ────────────
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, brand, stock, image } = req.body;
    if (!name || !description || !price || !category || !brand) {
      res.status(400).json({ message: "Zaroori fields missing hain" });
      return;
    }
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), category, brand, stock: Number(stock) || 0, image },
    });
    res.status(201).json({ message: "Product add ho gaya!", product });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── PUT /api/products/:id (admin) ─────────
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, brand, stock, image, isActive } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category && { category }),
        ...(brand && { brand }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    res.json({ message: "Product update ho gaya!", product });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── DELETE /api/products/:id (admin) ──────
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: "Product hata diya gaya" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/products/meta/filters ────────
export const getFilters = async (_req: Request, res: Response) => {
  try {
    const [categories, brands] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { category: true }, distinct: ["category"] }),
      prisma.product.findMany({ where: { isActive: true }, select: { brand: true }, distinct: ["brand"] }),
    ]);
    res.json({
      categories: categories.map((c) => c.category),
      brands: brands.map((b) => b.brand),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
