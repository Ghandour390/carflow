const { body, param } = require('express-validator');

const updateMedicamentValidation = [
    param('id').notEmpty().withMessage('L\'ID du médicament est requis').isMongoId().withMessage('L\'ID du médicament est invalide'),
    body('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide').isString(),
    body('dosage').optional().isString(),
    body('frequence').optional().isString()
];

module.exports = updateMedicamentValidation;