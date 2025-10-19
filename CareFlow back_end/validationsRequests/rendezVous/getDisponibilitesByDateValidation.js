const { param } = require('express-validator');

const getDisponibilitesByDateValidation = [
    param('date').isISO8601().withMessage('Format de date invalide')
];

module.exports = getDisponibilitesByDateValidation;
