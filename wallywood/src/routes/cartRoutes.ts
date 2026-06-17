import { Router } from 'express';
import {
    getCartLinesByUser,
    addToCart,
    updateCartLine,
    deleteCartLine
} from '../controllers/cartController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';
 
const router = Router();
 
// GET /api/cart/:userId   - Hent kurv for en bruger
router.get('/:userId', getCartLinesByUser);
 
// POST /api/cart          - Tilføj vare til kurv (kræver admin)
router.post('/', authorizeAdmin, addToCart);
 
// PUT /api/cart/:id       - Opdater antal i kurv (kræver admin)
router.put('/:id', authorizeAdmin, updateCartLine);
 
// DELETE /api/cart/:id    - Slet kurv-linje (kræver admin)
router.delete('/:id', authorizeAdmin, deleteCartLine);
 
export default router;
 