const express = require('express');
const router = express.Router();
const rendezVousController = require('../controller/RendezVousController');
const generateSlotsValidation = require('../validationsRequests/rendezVous/generateSlotsValidation');
const getDisponibilitesByMedecinValidation = require('../validationsRequests/rendezVous/getDisponibilitesByMedecinValidation');
const getDisponibilitesByMedecinAndDateValidation = require('../validationsRequests/rendezVous/getDisponibilitesByMedecinAndDateValidation');
const getDisponibilitesByDateValidation = require('../validationsRequests/rendezVous/getDisponibilitesByDateValidation');
const getRendezVousByPatientValidation = require('../validationsRequests/rendezVous/getRendezVousByPatientValidation');
const reserverRendezVousValidation = require('../validationsRequests/rendezVous/reserverRendezVousValidation');
const rendezVousIdValidation = require('../validationsRequests/rendezVous/rendezVousIdValidation');
const getRendezVousByMedecinValidation = require('../validationsRequests/rendezVous/getRendezVousByMedecinValidation');
const annulerRendezVousPatientValidation = require('../validationsRequests/rendezVous/annulerRendezVousPatientValidation');


router.post('/generate-slots', generateSlotsValidation, rendezVousController.generateSlots);
router.get('/disponibilites/medecin/:medecinId', getDisponibilitesByMedecinValidation, rendezVousController.getDisponibilitesByMedecin);
router.get('/disponibilites/medecin/:medecinId/date/:date', getDisponibilitesByMedecinAndDateValidation, rendezVousController.getDisponibilitesByMedecinAndDate);
router.get('/disponibilites/date/:date', getDisponibilitesByDateValidation, rendezVousController.getDisponibilitesByDate);
router.get('/medecin/:medecinId', getRendezVousByMedecinValidation, rendezVousController.getRendezVousByMedecin);
router.get('/patient/:patientId', getRendezVousByPatientValidation, rendezVousController.getRendezVousByPatient);
router.post('/reserver/:disponibiliteId', reserverRendezVousValidation, rendezVousController.reserverRendezVous);
router.put('/annuler/:id', rendezVousIdValidation, rendezVousController.anulluerRendezVous);
router.put('/patient/annuler/:id', annulerRendezVousPatientValidation, rendezVousController.annulerRendezVousPatient);
router.put('/confirmer/:id', rendezVousIdValidation, rendezVousController.ConfirmerRendezVous);

module.exports = router;