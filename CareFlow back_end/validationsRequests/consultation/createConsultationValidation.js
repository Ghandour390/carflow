const { body } = require('express-validator');

const createConsultationValidation = [
    body('medcinId').notEmpty().withMessage('Le medcinId est requis'),
    body('motif').notEmpty().withMessage('Le motif est requis'),
    body('dossierMedicalId').notEmpty().withMessage('Le dossierMedicalId est requis')
];

module.exports = createConsultationValidation;
