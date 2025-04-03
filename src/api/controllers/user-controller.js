import {addUser, listAllUsers, findUserById} from '../models/user-model.js';


const getUser = (req, res) => {
    res.json(listAllUsers());
}

const postUser = (req, res) => {
    const result = addUser(req.body);
    if (result.user_id) {
        res.status(201);
        res.json({message: 'New user added.', result});
    } else {
        res.sendStatus(400);
    }
}

const getUserById = (req, res) => {
    const user = findUserById(req.user_id);
    user ? res.json(user) : res.sendStatus(404);
}

const putUser = (req, res) => {
    res.json({message: 'User item updated.'});
}

const deleteUser = (req, res) => {
    res.json({message: 'User item deleted.'})
}

export {getUser, postUser, getUserById, putUser, deleteUser}