import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { CheckoutController } from '../controllers/checkout.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const cartController = new CartController();
const checkoutController = new CheckoutController();

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:productId', cartController.updateCartItem);
router.delete('/items/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

// Checkout routes
router.post('/checkout', checkoutController.checkout);
router.get('/orders', checkoutController.getUserOrders);
router.get('/orders/:id', checkoutController.getOrder);

export default router;
