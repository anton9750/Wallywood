import { Router } from 'express';
import {
    getAllRatings,
    getRatingsByPoster,
    createRating,
    deleteRating
} from '../controllers/ratingController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';
 
const router = Router();
 
// GET /api/ratings                    - Hent alle ratings
router.get('/', getAllRatings);
 
// GET /api/ratings/poster/:posterId   - Hent ratings for en plakat
router.get('/poster/:posterId', getRatingsByPoster);
 
// POST /api/ratings                   - Opret rating (kræver admin)
router.post('/', authorizeAdmin, createRating);
 
// PUT /api/ratings/:id                - Opdater rating (kræver admin)
// NOTE: updateRating is not exported from ratingController.js — route disabled until available
 
// DELETE /api/ratings/:id             - Slet rating (kræver admin)
router.delete('/:id', authorizeAdmin, deleteRating);
 
export default router;