import { Response } from "express";
import prisma from "../prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { OrderStatus } from "@prisma/client";

// ── POST /api/orders ──────────────────────
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, name, phone, address, city, paymentMethod, bikeModel, notes } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: "Cart khali hai" });
      return;
    }
    if (!name || !phone || !address || !city) {
      res.status(400).json({ message: "Delivery address poora bharo" });
      return;
    }

    // Verify each product from DB — never trust frontend price
    let itemsTotal = 0;
    const verifiedItems: { productId: string; name: string; price: number; quantity: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.isActive) {
        res.status(400).json({ message: `"${item.name}" available nahi hai` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ message: `"${product.name}" ka sirf ${product.stock} piece bacha hai` });
        return;
      }
      verifiedItems.push({ productId: product.id, name: product.name, price: product.price, quantity: item.quantity });
      itemsTotal += product.price * item.quantity;
    }

    const deliveryPrice = 150;
    const totalPrice = itemsTotal + deliveryPrice;

    // Create order + update stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          name, phone, address, city,
          paymentMethod: paymentMethod || "COD",
          bikeModel, notes,
          deliveryPrice,
          totalPrice,
          items: { create: verifiedItems },
        },
        include: { items: true },
      });

      for (const item of verifiedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json({ message: "Order place ho gaya! 🎉", order });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/orders/my ────────────────────
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { items: { include: { product: { select: { name: true, image: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ count: orders.length, orders });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/orders/:id ───────────────────
export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    if (!order) { res.status(404).json({ message: "Order nahi mila" }); return; }
    if (order.userId !== req.user!.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ message: "Yeh order tumhara nahi" }); return;
    }
    res.json(order);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GET /api/orders (admin) ───────────────
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;
    const where: any = {};
    if (status) where.status = status as OrderStatus;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total, revenue] = await Promise.all([
      prisma.order.findMany({
        where, skip, take: Number(limit),
        include: { user: { select: { name: true, email: true, phone: true } }, items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
      prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalPrice: true } }),
    ]);

    res.json({ total, totalRevenue: revenue._sum.totalPrice || 0, page: Number(page), orders });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ── PUT /api/orders/:id/status (admin) ────
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Galat status" }); return;
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, ...(status === "DELIVERED" && { isPaid: true }) },
    });
    res.json({ message: `Status "${status}" ho gaya`, order });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
