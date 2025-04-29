import { Router } from "express";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/user", userRoutes);

export default router;
