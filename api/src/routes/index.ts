import express, { Router } from 'express';
import { verifyToken } from '../config/auth';
import petsRouter from './pets';
import userRouter from './user';

const router: Router = express.Router();

router.use('/pets', verifyToken, petsRouter);
router.use('/user', userRouter);

export default router;
