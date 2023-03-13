import express, { Router } from 'express';
import { registerUser, login, logout } from '../controllers/user';

const router: Router = express.Router();

router.post('/create', registerUser);
router.post('/login', login);
router.post('/logout', logout);

export default router;
