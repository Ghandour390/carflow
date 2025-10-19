const express = require('express');
const router = express.Router();
const dossierMedicalController = require('../controller/DossierMedicalController');

// Importations des validations
const createDossierMedicalValidation = require('../validationsRequests/dossierMedical/createDossierMedicalValidation');
const getDossierMedicalByIdValidation = require('../validationsRequests/dossierMedical/getDossierMedicalByIdValidation');
const updateDossierMedicalValidation = require('../validationsRequests/dossierMedical/updateDossierMedicalValidation');
const deleteDossierMedicalValidation = require('../validationsRequests/dossierMedical/deleteDossierMedicalValidation');
const getDossiersMedicalByPatientValidation = require('../validationsRequests/dossierMedical/getDossiersMedicalByPatientValidation');


router.post('/', createDossierMedicalValidation, dossierMedicalController.createDossierMedical);
router.get('/:id', getDossierMedicalByIdValidation, dossierMedicalController.getDossierMedicalById);
router.get('/patient/:patientId', getDossiersMedicalByPatientValidation, dossierMedicalController.getDossiersMedicalByPatient);
router.put('/:id', updateDossierMedicalValidation, dossierMedicalController.updateDossierMedical);
router.delete('/:id', deleteDossierMedicalValidation, dossierMedicalController.deleteDossierMedical);

module.exports = router;
