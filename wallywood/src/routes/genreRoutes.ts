import { Router } from 'express';
import {
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre
} from '../controllers/genreController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/genres        - Hent alle genrer
router.get('/', getAllGenres);

// GET /api/genres/:id    - Hent én genre
router.get('/:id', getGenreById);

// POST /api/genres       - Opret genre (kræver admin)
router.post('/', authorizeAdmin, createGenre);

// PUT /api/genres/:id    - Opdater genre (kræver admin)
router.put('/:id', authorizeAdmin, updateGenre);

// DELETE /api/genres/:id - Slet genre (kræver admin)
router.delete('/:id', authorizeAdmin, deleteGenre);

export default router;