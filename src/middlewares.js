import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { validationResult } from 'express-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  try {
    const thumbnailPath = path.join(
      __dirname,
      '../uploads',
      `${req.file.filename}_thumb.jpg`
    );

    await sharp(req.file.path)
      .resize(160, 160)
      .toFormat('jpeg')
      .toFile(thumbnailPath);

    console.log(`Thumbnail created at -> ${thumbnailPath}`);
    next();
  } catch (error) {
    console.error('Error with thumbnail:', error);
    next(error);
  }
};

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

const authenticateRole = (role) => {
  return (req, res, next) => {
    if (res.locals.user?.role !== role) {
      return res.status(403).json({ message: 'no permission' });
    }
    next();
  };
};

const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array()
      .map(error => `${error.msg} (field: ${error.path})`)
      .join(', ');
    
    const error = new Error(`Validation failed: ${errorMessages}`);
    error.status = 400;
    return next(error);
  }
  
  next();
};


export { createThumbnail, authenticateToken, authenticateRole, validationErrors };