const express = require('express');
const router = express.Router();
const rendezVousController = require('../controller/RendezVousController');

router.post('/generate-slots', rendezVousController.generateSlots);
router.get('/disponibilites/medecin/:medecinId', rendezVousController.getDesponibilitesByMedecin);
router.get('/disponibilites/medecin/:medecinId/date/:date', rendezVousController.getDisponibilitesByMedecinAndDate);
router.get('/disponibilites/date/:date', rendezVousController.getDisponibilitesByDate);
router.get('/patient/:patientId', rendezVousController.getRendezVousByPatient);
router.post('/reserver/:disponibiliteId', rendezVousController.reserverRendezVous);
router.put('/annuler/:id', rendezVousController.anulluerRendezVous);
router.put('/confirmer/:id', rendezVousController.ConfirmerRendezVous);

module.exports = router;