import express, { Router } from 'express';
import { getAllPets } from '../controllers/pets';

const router: Router = express.Router();

router.get('/', getAllPets);

export default router;
