const { body } = require('express-validator');

const registerValidation = [
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('prenom').notEmpty().withMessage('Le prénom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('dateNaissance').isDate().withMessage('Date de naissance invalide'),
    body('gender').isIn(['homme', 'femme']).withMessage('Le sexe doit être homme ou femme'),
    body('adresse').notEmpty().withMessage('L\'adresse est requise'),
    body('CIN').notEmpty().withMessage('Le CIN est requis')
];

module.exports = registerValidation;
