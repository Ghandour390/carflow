const express = require('express');
const router = express.Router();
const rendezVousController = require('../controller/RendezVousController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');
const updateQueue = require('../medlwers/updateQueue');
const generateSlotsValidation = require('../validationsRequests/rendezVous/generateSlotsValidation');
const getDisponibilitesByMedecinValidation = require('../validationsRequests/rendezVous/getDisponibilitesByMedecinValidation');
const getDisponibilitesByMedecinAndDateValidation = require('../validationsRequests/rendezVous/getDisponibilitesByMedecinAndDateValidation');
const getDisponibilitesByDateValidation = require('../validationsRequests/rendezVous/getDisponibilitesByDateValidation');
const getRendezVousByPatientValidation = require('../validationsRequests/rendezVous/getRendezVousByPatientValidation');
const reserverRendezVousValidation = require('../validationsRequests/rendezVous/reserverRendezVousValidation');
const rendezVousIdValidation = require('../validationsRequests/rendezVous/rendezVousIdValidation');
const getRendezVousByMedecinValidation = require('../validationsRequests/rendezVous/getRendezVousByMedecinValidation');
const annulerRendezVousPatientValidation = require('../validationsRequests/rendezVous/annulerRendezVousPatientValidation');


router.post('/generate-slots', verifyToken, isEmailConfirmed, generateSlotsValidation, rendezVousController.generateSlots);
router.get('/disponibilites/medecin/:medecinId', verifyToken, isEmailConfirmed, getDisponibilitesByMedecinValidation, rendezVousController.getDisponibilitesByMedecin);
router.get('/disponibilites/medecin/:medecinId/date/:date', verifyToken, isEmailConfirmed, getDisponibilitesByMedecinAndDateValidation, rendezVousController.getDisponibilitesByMedecinAndDate);
router.get('/disponibilites/date/:date', verifyToken, isEmailConfirmed, getDisponibilitesByDateValidation, rendezVousController.getDisponibilitesByDate);
router.get('/medecin/:medecinId', verifyToken, isEmailConfirmed, getRendezVousByMedecinValidation, rendezVousController.getRendezVousByMedecin);
router.get('/patient/:patientId', verifyToken, isEmailConfirmed, getRendezVousByPatientValidation, rendezVousController.getRendezVousByPatient);
router.post('/reserver/:disponibiliteId', verifyToken, isEmailConfirmed, updateQueue, reserverRendezVousValidation, rendezVousController.reserverRendezVous);
router.put('/annuler/:id', verifyToken, isEmailConfirmed, rendezVousIdValidation, rendezVousController.anulluerRendezVous);
router.put('/patient/annuler/:id', verifyToken, isEmailConfirmed, annulerRendezVousPatientValidation, rendezVousController.annulerRendezVousPatient);
router.put('/confirmer/:id', verifyToken, isEmailConfirmed, rendezVousIdValidation, rendezVousController.ConfirmerRendezVous);

module.exports = router;