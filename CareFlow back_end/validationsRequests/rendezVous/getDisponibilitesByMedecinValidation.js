const { param } = require('express-validator');

const getDisponibilitesByMedecinValidation = [
    param('medecinId').notEmpty().withMessage('Le medecinId est requis')
];

module.exports = getDisponibilitesByMedecinValidation;
