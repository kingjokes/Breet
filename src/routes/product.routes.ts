import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes (require authentication)
router.post("/", authMiddleware, productController.createProduct);
router.put("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
