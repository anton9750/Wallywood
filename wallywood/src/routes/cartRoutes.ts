import { Router } from "express";
import {
    getCartLinesByUser,
    addToCart
} from '../controllers/cartController.js';

const router = Router();

router.get('/:userID, getCartLinesByuser');

router.post('/', addToCart);

export default router;