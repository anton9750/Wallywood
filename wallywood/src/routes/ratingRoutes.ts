import { Router} from 'express';
import {
    createRating,
    getRatingsByPoster
}  from '../controllers/ratingController.js';

const router = Router();

router.get('/poster/:posterId', getRatingsByPoster);

router.post('/', createRating);

export default router;

