const { param } = require('express-validator');

const getOrdonnancesByConsultationValidation = [
    param('consultationId').notEmpty().withMessage('L\'ID de la consultation est requis').isMongoId().withMessage('L\'ID de la consultation est invalide')
];

module.exports = getOrdonnancesByConsultationValidation;