import { Router } from 'express';
import {
    getAllPosters,
    getPosterById,
    createPoster,
    updatePoster,
    deletePoster
} from '../controllers/posterController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';
 
const router = Router();
 
// GET /api/posters        - Hent alle plakater
router.get('/', getAllPosters);
 
// GET /api/posters/:id    - Hent én plakat
router.get('/:id', getPosterById);
 
// POST /api/posters       - Opret plakat (kræver admin)
router.post('/', authorizeAdmin, createPoster);
 
// PUT /api/posters/:id    - Opdater plakat (kræver admin)
router.put('/:id', authorizeAdmin, updatePoster);
 
// DELETE /api/posters/:id - Slet plakat (kræver admin)
router.delete('/:id', authorizeAdmin, deletePoster);
 
export default router;