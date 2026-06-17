import { Router } from 'express';
import { 
    getAllPosters,      // Rettet navn: Skiftede fra getALLPosters til getAllPosters
    getPosterById,      // Rettet navn: Skiftede fra getPosterbyId til getPosterById
    createPoster, 
    updatePoster, 
    deletePoster 
} from '../controllers/posterController.js';

const router = Router();

router.get('/', getAllPosters);
router.get('/:id', getPosterById);
router.post('/', createPoster);
router.put('/:id', updatePoster);
router.delete('/:id', deletePoster);

export default router;