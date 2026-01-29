import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.js";

import {
  getAllProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController
} from "../controllers/productController.js";

const router = Router();

// GET /api/products/ all
router.get("/", authMiddleware, getAllProductsController);

// GET /api/products/:id by id
router.get("/:id", authMiddleware, getProductController);

// POST /api/products/ create 
router.post("/", authMiddleware, createProductController);

// PUT /api/products/:id update
router.put("/:id", authMiddleware, updateProductController);

// DELETE /api/products/:id delete
router.delete("/:id", authMiddleware, deleteProductController);

export default router;