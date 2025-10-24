
const AuthController = require('../controller/AuthController');
const UserController = require('../controller/UserController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../medlwers/verifyToken');
const infermier = require('../medlwers/infermier');


    router.post('/register', AuthController.register);
    router.post('/login', AuthController.login);

    router.get('/:id',verifyToken, UserController.getUser);
    router.put('/:id', UserController.updateUser);
    router.delete('/:id', UserController.deleteUser);
    router.get('/', infermier, UserController.getAllUsers);
    router.post('/', infermier, UserController.createUser);
    router.get('/confirm/:id', infermier, UserController.confirmationCompte);

    module.exports = router;