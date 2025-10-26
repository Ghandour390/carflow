const express = require('express');
const router = express.Router();
const AntecedentController = require('../controller/AntecedentController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');
const medecin = require('../medlwers/medecin');
const updateQueue = require('../medlwers/updateQueue');

// Routes pour les antécédents
router.post('/', verifyToken, isEmailConfirmed, medecin, AntecedentController.createAntecedent);
router.get('/dossier/:dossierMedicalId', verifyToken, isEmailConfirmed, AntecedentController.getAntecedentsByDossier);
router.get('/:id', verifyToken, isEmailConfirmed, AntecedentController.getAntecedentById);
router.put('/:id', verifyToken, isEmailConfirmed, medecin, updateQueue, AntecedentController.updateAntecedent);
router.delete('/:id', verifyToken, isEmailConfirmed, medecin, AntecedentController.deleteAntecedent);

module.exports = router;