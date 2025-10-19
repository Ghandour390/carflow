const express = require('express');
const router = express.Router();
const consultationController = require('../controller/ConsultationController');

router.post('/', consultationController.createConsultation);
router.get('/:id', consultationController.getConsultationById);
router.get('/dossier/:dossierMedicalId', consultationController.getConsultationsByDossierMedical);
router.put('/:id', consultationController.updateConsultation);
router.delete('/:id', consultationController.deleteConsultation);

module.exports = router;
