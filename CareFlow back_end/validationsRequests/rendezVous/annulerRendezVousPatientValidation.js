const { param, body } = require('express-validator');

const annulerRendezVousPatientValidation = [
    param('id').notEmpty().withMessage('L\'ID du rendez-vous est requis').isMongoId().withMessage('L\'ID du rendez-vous est invalide'),
    body('patientId').notEmpty().withMessage('L\'ID du patient est requis').isMongoId().withMessage('L\'ID du patient est invalide')
];

module.exports = annulerRendezVousPatientValidation;