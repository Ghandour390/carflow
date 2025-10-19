const { body, param } = require('express-validator');

const updateConsultationValidation = [
    param('id').notEmpty().withMessage('L\'ID de la consultation est requis').isMongoId().withMessage('L\'ID de la consultation est invalide'),
    body('motif').optional().notEmpty().withMessage('Le motif ne peut pas être vide').isString(),
    body('observation').optional().isString(),
    body('diagnostic').optional().isString()
];

module.exports = updateConsultationValidation;