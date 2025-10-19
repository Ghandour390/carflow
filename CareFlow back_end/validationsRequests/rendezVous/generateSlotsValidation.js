const { body } = require('express-validator');

const generateSlotsValidation = [
    body('medecinId').notEmpty().withMessage('Le medecinId est requis'),
    body('jour').notEmpty().withMessage('Le jour est requis'),
    body('heureDebut').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format heureDebut invalide (HH:mm)'),
    body('heureFin').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Format heureFin invalide (HH:mm)'),
    body('dureeSlot').isInt({ min: 1 }).withMessage('La dureeSlot doit être un nombre positif')
];

module.exports = generateSlotsValidation;
