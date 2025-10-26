const express = require('express');
const router = express.Router();
const dossierMedicalController = require('../controller/DossierMedicalController');

// Importations des validations
const createDossierMedicalValidation = require('../validationsRequests/dossierMedical/createDossierMedicalValidation');
const getDossierMedicalByIdValidation = require('../validationsRequests/dossierMedical/getDossierMedicalByIdValidation');
const updateDossierMedicalValidation = require('../validationsRequests/dossierMedical/updateDossierMedicalValidation');
const deleteDossierMedicalValidation = require('../validationsRequests/dossierMedical/deleteDossierMedicalValidation');
const getDossiersMedicalByPatientValidation = require('../validationsRequests/dossierMedical/getDossiersMedicalByPatientValidation');


const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');

router.post('/', verifyToken, isEmailConfirmed, createDossierMedicalValidation, dossierMedicalController.createDossierMedical);
router.get('/:id', verifyToken, isEmailConfirmed, getDossierMedicalByIdValidation, dossierMedicalController.getDossierMedicalById);
router.get('/patient/:patientId', verifyToken, isEmailConfirmed, getDossiersMedicalByPatientValidation, dossierMedicalController.getDossiersMedicalByPatient);
router.put('/:id', verifyToken, isEmailConfirmed, updateDossierMedicalValidation, dossierMedicalController.updateDossierMedical);
router.delete('/:id', verifyToken, isEmailConfirmed, deleteDossierMedicalValidation, dossierMedicalController.deleteDossierMedical);

module.exports = router;
