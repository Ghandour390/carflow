const { param } = require('express-validator');

const getDossierMedicalByIdValidation = [
    param('id').notEmpty().withMessage('L\'id du dossier médical est requis').isMongoId().withMessage('L\'ID du dossier médical est invalide')
];

module.exports = getDossierMedicalByIdValidation;
