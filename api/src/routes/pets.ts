import express, { Router } from 'express';
import { addPet, editPet, getAllPets, getSinglePet } from '../controllers/pets';

const router: Router = express.Router();

router.get('/', getAllPets);
router.get('/:id', getSinglePet);
router.put('/:id', editPet);
router.post('/add', addPet);

export default router;
