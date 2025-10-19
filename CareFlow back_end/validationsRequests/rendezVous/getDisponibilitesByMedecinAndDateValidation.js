const { param } = require('express-validator');

const getDisponibilitesByMedecinAndDateValidation = [
    param('medecinId').notEmpty().withMessage('L\'ID du médecin est requis').isMongoId().withMessage('L\'ID du médecin est invalide'),
    param('date').notEmpty().withMessage('La date est requise').isISO8601().withMessage('Le format de la date est invalide (YYYY-MM-DD)')
];

module.exports = getDisponibilitesByMedecinAndDateValidation;