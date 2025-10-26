const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controller/OrdonnanceController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');

// Importations des validations
const createOrdonnanceValidation = require('../validationsRequests/ordonnance/createOrdonnanceValidation');
const ordonnanceIdValidation = require('../validationsRequests/ordonnance/ordonnanceIdValidation');
const getOrdonnancesByConsultationValidation = require('../validationsRequests/ordonnance/getOrdonnancesByConsultationValidation');
const updateOrdonnanceValidation = require('../validationsRequests/ordonnance/updateOrdonnanceValidation');

router.post('/', verifyToken, isEmailConfirmed, createOrdonnanceValidation, ordonnanceController.createOrdonnance);
router.get('/:id', verifyToken, isEmailConfirmed, ordonnanceIdValidation, ordonnanceController.getOrdonnanceById);
router.get('/consultation/:consultationId', verifyToken, isEmailConfirmed, getOrdonnancesByConsultationValidation, ordonnanceController.getOrdonnancesByConsultation);
router.put('/:id', verifyToken, isEmailConfirmed, updateOrdonnanceValidation, ordonnanceController.updateOrdonnance);
router.delete('/:id', verifyToken, isEmailConfirmed, ordonnanceIdValidation, ordonnanceController.deleteOrdonnance);

module.exports = router;
