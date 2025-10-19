const { param } = require('express-validator');

const deleteDossierMedicalValidation = [
    param('id').notEmpty().withMessage('L\'id du dossier médical est requis')
];

module.exports = deleteDossierMedicalValidation;
