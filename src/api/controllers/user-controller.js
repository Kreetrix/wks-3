import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser
} from '../models/user-model.js';

import bcrypt from 'bcrypt';

const getUser = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await addUser(req.body);
    res.status(201).json({message: 'New user added.', result});
  } catch (error) {
    next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const success = await modifyUser(req.body, req.params.id);
    if (success) {
      res.json({message: 'User updated.'});
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const success = await removeUser(req.params.id);
    if (success) {
      res.json({message: 'User deleted.'});
    } else {
      const error = new Error('User not found');
      error.status = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser
};