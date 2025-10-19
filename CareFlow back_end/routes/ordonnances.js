const express = require('express');
const router = express.Router();
const ordonnanceController = require('../controller/OrdonnanceController');

// Importer les validations
const createOrdonnanceValidation = require('../validationsRequests/ordonnance/createOrdonnanceValidation');

router.post('/', createOrdonnanceValidation, ordonnanceController.createOrdonnance);
router.get('/:id', ordonnanceController.getOrdonnanceById);
router.get('/consultation/:consultationId', ordonnanceController.getOrdonnancesByConsultation);
router.put('/:id', ordonnanceController.updateOrdonnance);
router.delete('/:id', ordonnanceController.deleteOrdonnance);

module.exports = router;
