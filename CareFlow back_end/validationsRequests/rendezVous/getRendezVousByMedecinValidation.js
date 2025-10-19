const { param } = require('express-validator');

const getRendezVousByMedecinValidation = [
    param('medecinId').notEmpty().withMessage('L\'ID du médecin est requis').isMongoId().withMessage('L\'ID du médecin est invalide')
];

module.exports = getRendezVousByMedecinValidation;