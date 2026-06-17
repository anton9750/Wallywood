import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';
 
const router = Router();
 
// GET /api/users        - Hent alle brugere (kræver admin)
router.get('/', authorizeAdmin, getAllUsers);
 
// GET /api/users/:id    - Hent én bruger (kræver admin)
router.get('/:id', authorizeAdmin, getUserById);
 
// POST /api/users       - Opret ny bruger (kræver admin)
router.post('/', authorizeAdmin, createUser);
 
// PUT /api/users/:id    - Opdater bruger (kræver admin)
router.put('/:id', authorizeAdmin, updateUser);
 
// DELETE /api/users/:id - Slet bruger (kræver admin)
router.delete('/:id', authorizeAdmin, deleteUser);
 
export default router;
 