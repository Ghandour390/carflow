const { param, body } = require('express-validator');

const updateDossierMedicalValidation = [
    param('id').notEmpty().withMessage('L\'id du dossier médical est requis'),
    body('etat').notEmpty().withMessage('L\'état est requis').isIn(['actif', 'archive', 'en_cours']).withMessage('L\'état du dossier médical est invalide')
];

module.exports = updateDossierMedicalValidation;
