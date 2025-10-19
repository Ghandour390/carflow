const { body } = require('express-validator');

const loginValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('motDePasse').notEmpty().withMessage('Le mot de passe est requis')
];

module.exports = loginValidation;
