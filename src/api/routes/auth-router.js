import express from 'express';
import { postLogin, getMe, postRegister } from '../controllers/auth-controller.js';
import { authenticateToken, validationErrors } from '../../middlewares.js';
import { body } from 'express-validator';

const authRouter = express.Router();

authRouter.route('/login')
  .post([
    body('username').trim().notEmpty(),
    body('password').notEmpty(),
    validationErrors,
    postLogin
  ]);

authRouter.route('/register')
  .post([
    body('name').trim().isLength({ min: 2, max: 50 }).escape(),
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('email').trim().isEmail().normalizeEmail(),
    body('passwd').isLength({ min: 8 }),
    validationErrors,
    postRegister
  ]);

authRouter.route('/me')
    .get(authenticateToken, getMe)

export default authRouter;