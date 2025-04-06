import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { login, register } from '../models/auth-model.js';

const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  
  const user = await login(req.body.username);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.sendStatus(401);
    return;
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
};

const postRegister = async (req, res) => {
  console.log('postRegister', req.body);
  try {
    const role = 'user'; //hardcoded for now
    req.body.role = role;
    req.body.passwd = bcrypt.hashSync(req.body.passwd, 10);
    const user = await register(req.body);
    res.status(201).json({message: 'New user added.', user});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getMe = async (req, res) => {
    console.log('getMe', res.locals.user);
    if ( res.locals.user) {
        res.json({message: 'token ok', user:  res.locals.user});
    } else {
        res.sendStatus(401);
    }
};

export {postLogin, getMe, postRegister};