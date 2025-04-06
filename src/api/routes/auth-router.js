import express from 'express';
import { postLogin, getMe, postRegister } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares.js';

const authRouter = express.Router();

authRouter.route('/login')
    .post(postLogin)

authRouter.route('/register')
    .post(postRegister)

authRouter.route('/me')
    .get(authenticateToken, getMe)

export default authRouter;