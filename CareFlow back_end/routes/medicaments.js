const express = require('express');
const router = express.Router();
const medicamentController = require('../controller/MedicamentController');

router.post('/', medicamentController.createMedicament);
router.get('/:id', medicamentController.getMedicamentById);
router.get('/ordonnance/:ordonnanceId', medicamentController.getMedicamentsByOrdonnance);
router.put('/:id', medicamentController.updateMedicament);
router.delete('/:id', medicamentController.deleteMedicament);

module.exports = router;
