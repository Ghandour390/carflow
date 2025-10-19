const { body } = require('express-validator');

const createConsultationValidation = [
    body('medcinId').notEmpty().withMessage('L\'ID du médecin est requis').isMongoId().withMessage('L\'ID du médecin est invalide'),
    body('motif').notEmpty().withMessage('Le motif est requis').isString(),
    body('dossierMedicalId').notEmpty().withMessage('L\'ID du dossier médical est requis').isMongoId().withMessage('L\'ID du dossier médical est invalide'),
    body('observation').optional().isString(),
    body('diagnostic').optional().isString()
];

module.exports = createConsultationValidation;
