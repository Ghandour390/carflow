const { validationResult } = require('express-validator');
const RendezVousService = require('../services/RendezVousService');

class RendezVousController{
    
async generateSlots(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const slots = await RendezVousService.generateSlots(req.body);
    res.status(201).json({ msg: "Slots générés avec succès", slots });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la génération des créneaux" });
  }
}

    async getDisponibilitesByMedecin(req,res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { medecinId } = req.params;
            const disponibilites = await RendezVousService.getDisponibilitesByMedecin(medecinId);
            res.status(200).json(disponibilites);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération des disponibilités" });
        }
    }
    async getDisponibilitesByMedecinAndDate(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { medecinId, date } = req.params;
            const disponibilites = await RendezVousService.getDisponibilitesByMedecinAndDate(medecinId, date);
            res.status(200).json(disponibilites);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération des disponibilités" });
        }
    }
    async getDisponibilitesByDate(req , res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { date } = req.params;
            const disponibilites = await RendezVousService.getDisponibilitesByDate(date);
            res.status(200).json(disponibilites);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération des disponibilités" });
        }
    }

    async getRendezVousByPatient(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { patientId } = req.params;
            const rendezVous = await RendezVousService.getRendezVousByPatient(patientId);
            res.status(200).json(rendezVous);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération des rendez-vous" });
        }
    }
    async reserverRendezVous(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { disponibiliteId } = req.params;
            const { patientId } = req.body;
            const rendezVous = await RendezVousService.reserverRendezVous(disponibiliteId, patientId);
            res.status(200).json({ msg: "Rendez-vous réservé avec succès", rendezVous });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la réservation du rendez-vous" });
        }
    }
    async anulluerRendezVous(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const rendezVous = await RendezVousService.anulluerRendezVous(id);
            res.status(200).json({ msg: "Rendez-vous annulé avec succès",rendezVous });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de l'annulation du rendez-vous" });
        }
    }
    async ConfirmerRendezVous(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const rendezVous = await RendezVousService.confirmerRendezVous(id);
            res.status(200).json({ msg: "Rendez-vous confirmé avec succès",rendezVous });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la confirmation du rendez-vous" });
        }
    }
    
    async annulerRendezVousPatient(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { patientId } = req.body;
            const rendezVous = await RendezVousService.annulerRendezVousPatient(id, patientId);
            res.status(200).json({ msg: "Rendez-vous annulé avec succès", rendezVous });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de l'annulation du rendez-vous" });
        }
    }

    async getRendezVousByMedecin(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { medecinId } = req.params;
            const rendezVous = await RendezVousService.getRendezVousByMedecin(medecinId);
            res.status(200).json(rendezVous);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération des rendez-vous du médecin" });
        }
    }
}
module.exports = new RendezVousController();
