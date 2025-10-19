const { param } = require('express-validator');

const getConsultationByIdValidation = [
    param('id').notEmpty().withMessage('L\'id de la consultation est requis')
];

module.exports = getConsultationByIdValidation;
