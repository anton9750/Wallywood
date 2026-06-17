import { Router} from 'express';
import {
    getAllGenres,
    createGenre
} from '../controllers/genreController.js';

const router = Router();

router.get('/', getAllGenres);

router.post('/', createGenre);

export default router;