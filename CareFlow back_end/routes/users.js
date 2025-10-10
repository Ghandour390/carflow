
const AuthController = require('../controller/AuthController');
const UserController = require('../controller/UserController');
const express = require('express');
// const { model } = require('mongoose');
const router = express.Router();
const verifyToken = require('../medlwers/verifyToken');


    router.post('/register', AuthController.register);
    router.post('/login', AuthController.login);
    // route.get('/api/user', AuthController.getUser);
    // route.get('/logout', AuthController.logout);

    router.get('/user',verifyToken, UserController.getUser);
    router.put('/user/:id', UserController.updateUser);
    router.delete('/user/:id', UserController.deleteUser);
    router.get('/users', UserController.getAllUsers);
    router.post('/users', UserController.createUser);

    module.exports = router;