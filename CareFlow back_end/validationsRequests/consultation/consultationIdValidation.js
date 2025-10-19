const { param } = require('express-validator');

const consultationIdValidation = [
    param('id').notEmpty().withMessage('L\'ID de la consultation est requis').isMongoId().withMessage('L\'ID de la consultation est invalide')
];

module.exports = consultationIdValidation;