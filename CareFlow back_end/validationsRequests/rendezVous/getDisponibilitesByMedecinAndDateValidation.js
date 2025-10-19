const { param } = require('express-validator');

const getDisponibilitesByMedecinAndDateValidation = [
    param('medecinId').notEmpty().withMessage('Le medecinId est requis'),
    param('date').isISO8601().withMessage('Format de date invalide')
];

module.exports = getDisponibilitesByMedecinAndDateValidation;
