const { param } = require('express-validator');

const annulerRendezVousValidation = [
    param('id').notEmpty().withMessage('L\'id du rendez-vous est requis')
];

module.exports = annulerRendezVousValidation;
