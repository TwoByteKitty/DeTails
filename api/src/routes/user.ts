import express, { Router } from 'express';
import { registerUser, login } from '../controllers/user';

const router: Router = express.Router();

router.post('/create', registerUser);
router.post('/login', login);

export default router;
