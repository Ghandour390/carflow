const { param } = require('express-validator');

const ordonnanceIdValidation = [
    param('id').notEmpty().withMessage('L\'ID de l\'ordonnance est requis').isMongoId().withMessage('L\'ID de l\'ordonnance est invalide')
];

module.exports = ordonnanceIdValidation;