const { param } = require('express-validator');

const rendezVousIdValidation = [
    param('id').notEmpty().withMessage('L\'ID du rendez-vous est requis').isMongoId().withMessage('L\'ID du rendez-vous est invalide')
];

module.exports = rendezVousIdValidation;