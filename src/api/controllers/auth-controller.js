import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { login, register } from '../models/auth-model.js';

const postLogin = async (req, res, next) => {
  try {
    const user = await login(req.body.username);
    if (!user) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      throw error;
    }
    
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      const error = new Error('Invalid username or password');
      error.status = 401;
      throw error;
    }
    
    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({user: userWithNoPassword, token});
  } catch (error) {
    next(error);
  }
};

const postRegister = async (req, res, next) => {
  try {
    const role = 'user';
    req.body.role = role;
    req.body.passwd = bcrypt.hashSync(req.body.passwd, 10);
    const user = await register(req.body);
    res.status(201).json({message: 'New user added.', user});
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (!res.locals.user) {
      const error = new Error('Not authenticated');
      error.status = 401;
      throw error;
    }
    res.json({message: 'token ok', user: res.locals.user});
  } catch (error) {
    next(error);
  }
};

export {postLogin, getMe, postRegister};