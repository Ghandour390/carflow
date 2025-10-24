const express = require('express');
const router = express.Router();
const medicamentController = require('../controller/MedicamentController');

// Je crée ces fichiers de validation pour vous, car ils manquaient.
const createMedicamentValidation = require('../validationsRequests/medicament/createMedicamentValidation');
const medicamentIdValidation = require('../validationsRequests/medicament/medicamentIdValidation');
const getMedicamentsByOrdonnanceValidation = require('../validationsRequests/medicament/getMedicamentsByOrdonnanceValidation');
const updateMedicamentValidation = require('../validationsRequests/medicament/updateMedicamentValidation');

router.post('/', createMedicamentValidation, medicamentController.createMedicament);
router.get('/:id', medicamentIdValidation, medicamentController.getMedicamentById);
router.get('/ordonnance/:ordonnanceId', getMedicamentsByOrdonnanceValidation, medicamentController.getMedicamentsByOrdonnance);
router.put('/:id', updateMedicamentValidation, medicamentController.updateMedicament);
router.delete('/:id', medicamentIdValidation, medicamentController.deleteMedicament);

module.exports = router;
