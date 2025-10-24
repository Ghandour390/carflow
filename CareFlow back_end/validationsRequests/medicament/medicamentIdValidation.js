const { param } = require('express-validator');

const medicamentIdValidation = [
    param('id').notEmpty().withMessage('L\'ID du médicament est requis').isMongoId().withMessage('L\'ID du médicament est invalide')
];

module.exports = medicamentIdValidation;