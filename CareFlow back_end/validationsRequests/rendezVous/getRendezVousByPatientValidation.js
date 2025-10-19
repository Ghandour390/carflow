const { param } = require('express-validator');

const getRendezVousByPatientValidation = [
    param('patientId').notEmpty().withMessage('Le patientId est requis')
];

module.exports = getRendezVousByPatientValidation;
