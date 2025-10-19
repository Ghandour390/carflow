const { param, body } = require('express-validator');

const reserverRendezVousValidation = [
    param('disponibiliteId').notEmpty().withMessage('L\'id de la disponibilité est requis'),
    body('patientId').notEmpty().withMessage('Le patientId est requis')
];

module.exports = reserverRendezVousValidation;
