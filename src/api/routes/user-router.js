import express from 'express';
import {
    deleteUser,
    getUser,
    getUserById,
    postUser,
    putUser
} from '../controllers/user-controller.js';
import { authenticateToken, validationErrors } from '../../middlewares.js';
import { body, param } from 'express-validator';

const userRouter = express.Router();

userRouter.route("/")
  .get(getUser)
  .post([
    body('name').trim().isLength({ min: 2, max: 50 }).escape(),
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    validationErrors,
    postUser
  ]);

userRouter.route('/:id')
  .get(
    param('id').isInt(),
    validationErrors,
    getUserById
  )
  .put(
    authenticateToken,
    [
      param('id').isInt(),
      body('name').optional().trim().isLength({ min: 2, max: 50 }).escape(),
      body('username').optional().trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
      body('email').optional().trim().isEmail().normalizeEmail(),
      body('password').optional().isLength({ min: 8 }),
    ],
    validationErrors,
    putUser
  )
  .delete(
    authenticateToken,
    param('id').isInt(),
    validationErrors,
    deleteUser
  );

export default userRouter;