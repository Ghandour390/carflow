const { param } = require('express-validator');

const confirmerRendezVousValidation = [
    param('id').notEmpty().withMessage('L\'id du rendez-vous est requis')
];

module.exports = confirmerRendezVousValidation;
