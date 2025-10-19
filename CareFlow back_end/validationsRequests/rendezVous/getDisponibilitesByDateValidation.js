const { param } = require('express-validator');

const getDisponibilitesByDateValidation = [
    param('date').notEmpty().withMessage('La date est requise').isISO8601().withMessage('Le format de la date est invalide (YYYY-MM-DD)')
];

module.exports = getDisponibilitesByDateValidation;