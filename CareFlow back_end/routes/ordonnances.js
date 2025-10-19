const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controller/OrdonnanceController');

// Importations des validations
const createOrdonnanceValidation = require('../validationsRequests/ordonnance/createOrdonnanceValidation');
const ordonnanceIdValidation = require('../validationsRequests/ordonnance/ordonnanceIdValidation');
const getOrdonnancesByConsultationValidation = require('../validationsRequests/ordonnance/getOrdonnancesByConsultationValidation');
const updateOrdonnanceValidation = require('../validationsRequests/ordonnance/updateOrdonnanceValidation');

router.post('/', createOrdonnanceValidation, ordonnanceController.createOrdonnance);
router.get('/:id', ordonnanceIdValidation, ordonnanceController.getOrdonnanceById);
router.get('/consultation/:consultationId', getOrdonnancesByConsultationValidation, ordonnanceController.getOrdonnancesByConsultation);
router.put('/:id', updateOrdonnanceValidation, ordonnanceController.updateOrdonnance);
router.delete('/:id', ordonnanceIdValidation, ordonnanceController.deleteOrdonnance);

module.exports = router;
