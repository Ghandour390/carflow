const { param } = require('express-validator');

const getConsultationsByDossierMedicalValidation = [
    param('dossierMedicalId').notEmpty().withMessage('L\'id du dossier médical est requis')
];

module.exports = getConsultationsByDossierMedicalValidation;
