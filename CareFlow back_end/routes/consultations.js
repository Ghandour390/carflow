const express = require('express');
const router = express.Router();
const consultationController = require('../controller/ConsultationController');

// Importations des validations
const createConsultationValidation = require('../validationsRequests/consultation/createConsultationValidation');
const consultationIdValidation = require('../validationsRequests/consultation/consultationIdValidation');
const getConsultationsByDossierValidation = require('../validationsRequests/consultation/getConsultationsByDossierValidation');
const updateConsultationValidation = require('../validationsRequests/consultation/updateConsultationValidation');

router.post('/', createConsultationValidation, consultationController.createConsultation);
router.get('/:id', consultationIdValidation, consultationController.getConsultationById);
router.get('/dossier/:dossierMedicalId', getConsultationsByDossierValidation, consultationController.getConsultationsByDossierMedical);
router.put('/:id', updateConsultationValidation, consultationController.updateConsultation);
router.delete('/:id', consultationIdValidation, consultationController.deleteConsultation);

module.exports = router;
