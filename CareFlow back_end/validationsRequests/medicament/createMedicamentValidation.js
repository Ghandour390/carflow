const { body } = require('express-validator');

const createMedicamentValidation = [
    body('nom').notEmpty().withMessage('Le nom du médicament est requis').isString(),
    body('dosage').optional().isString(),
    body('frequence').optional().isString(),
    body('ordonnanceId').notEmpty().withMessage('L\'ID de l\'ordonnance est requis').isMongoId().withMessage('L\'ID de l\'ordonnance est invalide')
];

module.exports = createMedicamentValidation;