const express = require('express');
const router = express.Router();
const VaccinationController = require('../controller/VaccinationController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');
const medecin = require('../medlwers/medecin');
const updateQueue = require('../medlwers/updateQueue');

// Routes pour les vaccinations
router.post('/', verifyToken, isEmailConfirmed, medecin, VaccinationController.createVaccination);
router.get('/dossier/:dossierMedicalId', verifyToken, isEmailConfirmed, VaccinationController.getVaccinationsByDossier);
router.get('/:id', verifyToken, isEmailConfirmed, VaccinationController.getVaccinationById);
router.put('/:id', verifyToken, isEmailConfirmed, medecin, updateQueue, VaccinationController.updateVaccination);
router.delete('/:id', verifyToken, isEmailConfirmed, medecin, VaccinationController.deleteVaccination);

module.exports = router;