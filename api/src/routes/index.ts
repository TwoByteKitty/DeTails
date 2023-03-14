import express, { Router } from 'express';
import petsRouter from './pets';
import userRouter from './user';

const router: Router = express.Router();

router.use('/pets', petsRouter);
router.use('/user', userRouter);

export default router;
