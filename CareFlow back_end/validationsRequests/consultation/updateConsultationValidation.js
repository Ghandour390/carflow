const { param, body } = require('express-validator');

const updateConsultationValidation = [
    param('id').notEmpty().withMessage('L\'id de la consultation est requis'),
    body('motif').optional().notEmpty().withMessage('Le motif ne peut pas être vide'),
    body('observation').optional(),
    body('diagnostic').optional()
];

module.exports = updateConsultationValidation;
