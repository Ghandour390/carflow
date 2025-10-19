const { param } = require('express-validator');

const getDossiersMedicalByPatientValidation = [
    param('patientId').notEmpty().withMessage('L\'id du patient est requis').isMongoId().withMessage('L\'ID du patient est invalide')
];

module.exports = getDossiersMedicalByPatientValidation;