const express = require('express');
const router = express.Router();
const medicamentController = require('../controller/MedicamentController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');

// Je crée ces fichiers de validation pour vous, car ils manquaient.
const createMedicamentValidation = require('../validationsRequests/medicament/createMedicamentValidation');
const medicamentIdValidation = require('../validationsRequests/medicament/medicamentIdValidation');
const getMedicamentsByOrdonnanceValidation = require('../validationsRequests/medicament/getMedicamentsByOrdonnanceValidation');
const updateMedicamentValidation = require('../validationsRequests/medicament/updateMedicamentValidation');

router.post('/', verifyToken, isEmailConfirmed, createMedicamentValidation, medicamentController.createMedicament);
router.get('/:id', verifyToken, isEmailConfirmed, medicamentIdValidation, medicamentController.getMedicamentById);
router.get('/ordonnance/:ordonnanceId', verifyToken, isEmailConfirmed, getMedicamentsByOrdonnanceValidation, medicamentController.getMedicamentsByOrdonnance);
router.put('/:id', verifyToken, isEmailConfirmed, updateMedicamentValidation, medicamentController.updateMedicament);
router.delete('/:id', verifyToken, isEmailConfirmed, medicamentIdValidation, medicamentController.deleteMedicament);

module.exports = router;
