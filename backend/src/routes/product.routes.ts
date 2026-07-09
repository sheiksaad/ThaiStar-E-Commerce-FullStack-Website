import { Router } from "express";
import {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, getFilters,
} from "../controllers/product.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";

const router = Router();

router.get("/meta/filters", getFilters);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
