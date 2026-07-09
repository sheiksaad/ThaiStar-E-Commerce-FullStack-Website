import { Router } from "express";
import {
  createOrder, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus,
} from "../controllers/order.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
