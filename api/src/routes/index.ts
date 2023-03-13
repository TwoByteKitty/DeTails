import express, { Router } from 'express';
import petsRouter from './pets';

const router: Router = express.Router();

router.use('/pets', petsRouter);

export default router;
