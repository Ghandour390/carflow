const { param } = require('express-validator');

const getConsultationsByDossierValidation = [
    param('dossierMedicalId').notEmpty().withMessage('L\'ID du dossier médical est requis').isMongoId().withMessage('L\'ID du dossier médical est invalide')
];

module.exports = getConsultationsByDossierValidation;