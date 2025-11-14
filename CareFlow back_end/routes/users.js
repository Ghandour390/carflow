const AuthController = require('../controller/AuthController');
const UserController = require('../controller/UserController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../medlwers/verifyToken');
const infermier = require('../medlwers/infermier');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');

    // Routes publiques
    router.post('/register', AuthController.register);
    router.post('/login', AuthController.login);
    router.post('/logout', verifyToken, AuthController.logout);
    
    // Routes pour la confirmation d'email
    router.get('/confirmation-email/:email', AuthController.getConfirmationEmail);
    router.post('/confirmation-email/:email/:codeConfirmation', AuthController.confirmationEmail);

    // Routes protégées nécessitant une confirmation d'email
    router.get('/:id', verifyToken, isEmailConfirmed, UserController.getUser);
    router.put('/:id', verifyToken, isEmailConfirmed, UserController.updateUser);
    router.delete('/:id', verifyToken, isEmailConfirmed, UserController.deleteUser);
    router.get('/', verifyToken, isEmailConfirmed, infermier, UserController.getAllUsers);
    router.post('/', verifyToken, isEmailConfirmed, infermier, UserController.createUser);
    router.get('/confirm/:id', verifyToken, isEmailConfirmed, infermier, UserController.confirmationCompte);
    router.get('/medecins/specialite/:specialiteId', verifyToken, isEmailConfirmed, UserController.getMedecinsBySpecialite);

    module.exports = router;