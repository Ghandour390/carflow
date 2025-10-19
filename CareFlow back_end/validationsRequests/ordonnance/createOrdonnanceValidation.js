const { body } = require('express-validator');

const createOrdonnanceValidation = [
    body('consultationId').notEmpty().withMessage('L\'ID de la consultation est requis').isMongoId().withMessage('L\'ID de la consultation est invalide'),
    body('instructions').notEmpty().withMessage('Les instructions sont requises').isString().withMessage('Les instructions doivent être une chaîne de caractères')
];

module.exports = createOrdonnanceValidation;