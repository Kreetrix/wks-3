import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser
} from '../models/user-model.js';

import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const postUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await addUser(req.body);
    res.status(201).json({message: 'New user added.', result});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const putUser = async (req, res) => {
  try {
    const success = await modifyUser(req.body, req.params.id);
    if (success) {
      res.json({message: 'User updated.'});
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const deleteUser = async (req, res) => {
  try {
    const success = await removeUser(req.params.id);
    if (success) {
      res.json({message: 'User deleted.'});
    } else {
      res.status(404).json({message: 'User not found'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser
};