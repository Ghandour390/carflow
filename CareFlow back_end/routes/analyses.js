const express = require('express');
const router = express.Router();
const AnalyseController = require('../controller/AnalyseController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');
const medecin = require('../medlwers/medecin');
const updateQueue = require('../medlwers/updateQueue');

// Routes pour les analyses
router.post('/', verifyToken, isEmailConfirmed, medecin, AnalyseController.createAnalyse);
router.get('/dossier/:dossierMedicalId', verifyToken, isEmailConfirmed, AnalyseController.getAnalysesByDossier);
router.get('/:id', verifyToken, isEmailConfirmed, AnalyseController.getAnalyseById);
router.put('/:id', verifyToken, isEmailConfirmed, medecin, updateQueue, AnalyseController.updateAnalyse);
router.delete('/:id', verifyToken, isEmailConfirmed, medecin, AnalyseController.deleteAnalyse);

module.exports = router;