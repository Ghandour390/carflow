const { param } = require('express-validator');

const getMedicamentsByOrdonnanceValidation = [
    param('ordonnanceId').notEmpty().withMessage('L\'ID de l\'ordonnance est requis').isMongoId().withMessage('L\'ID de l\'ordonnance est invalide')
];

module.exports = getMedicamentsByOrdonnanceValidation;