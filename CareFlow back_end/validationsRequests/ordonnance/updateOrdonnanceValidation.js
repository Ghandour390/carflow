const { body, param } = require('express-validator');

const updateOrdonnanceValidation = [
    param('id').notEmpty().withMessage('L\'ID de l\'ordonnance est requis').isMongoId().withMessage('L\'ID de l\'ordonnance est invalide'),
    body('instructions').optional().notEmpty().withMessage('Les instructions ne peuvent pas être vides').isString().withMessage('Les instructions doivent être une chaîne de caractères')
];

module.exports = updateOrdonnanceValidation;