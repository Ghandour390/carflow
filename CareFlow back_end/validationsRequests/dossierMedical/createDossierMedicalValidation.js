const { body } = require('express-validator');

const createDossierMedicalValidation = [
    body('patientId').notEmpty().withMessage('Le patientId est requis').isMongoId().withMessage('L\'ID du patient est invalide'),
    body('medecinId').notEmpty().withMessage('Le medecinId est requis').isMongoId().withMessage('L\'ID du médecin est invalide')
    // body('etat').optional().isIn(['actif', 'archive', 'en_cours']).withMessage('L\'état du dossier médical est invalide')
];

module.exports = createDossierMedicalValidation;
