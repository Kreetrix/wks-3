import express from 'express';
import multer from 'multer';
import { createThumbnail } from '../../middlewares.js';
import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat
} from '../controllers/cat-controller.js';
import { authenticateToken, validationErrors } from '../../middlewares.js';
import { body, param } from 'express-validator';

const upload = multer({ dest: 'uploads/' });
const catRouter = express.Router();

catRouter.route('/')
  .get(getCat)
  .post(upload.single('file'), createThumbnail, postCat);

catRouter.route('/')
  .get(getCat)
  .post(
    upload.single('file'),
    [
      body('cat_name').trim().isLength({ min: 3, max: 100 }).escape(),
      body('weight').isFloat({ min: 0.1, max: 100 }),
      body('owner').isInt(),
      body('birthdate').isISO8601(),
    ],
    createThumbnail,
    validationErrors,
    postCat
  );


catRouter.route('/:id')
  .get(getCatById)
  .put(
    authenticateToken,
    [
      param('id').isInt(),
      body('cat_name').optional().trim().isLength({ min: 3, max: 100 }).escape(),
      body('weight').optional().isFloat({ min: 0.1, max: 100 }),
      body('owner').optional().isInt(),
      body('birthdate').optional().isISO8601(),
    ],
    validationErrors,
    putCat
  )
  .delete(
    authenticateToken,
    param('id').isInt(),
    validationErrors,
    deleteCat
  );

catRouter.route('/user/:userId')
  .get(
    param('userId').isInt(),
    validationErrors,
    getCatsByUserId
  );

export default catRouter;