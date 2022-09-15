import express, { Router } from 'express';
import { addPet, getAllPets } from '../controllers/pets';

const router: Router = express.Router();

router.get('/', getAllPets);
router.post('/add', addPet);

export default router;
