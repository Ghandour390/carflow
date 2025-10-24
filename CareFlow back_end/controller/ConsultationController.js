const { validationResult } = require('express-validator');
const ConsultationService = require('../services/ConsultationService');

class ConsultationController {
    async createConsultation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
            
            const newConsultation = await ConsultationService.createConsultation(req.body);
            res.status(201).json({ msg: "Consultation créée avec succès", consultation: newConsultation });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la création de la consultation" });
        }
    }

    async getConsultationById(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { id } = req.params;
            const consultation = await ConsultationService.getConsultationById(id);
            res.status(200).json(consultation);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération de la consultation" });
        }
    }

    async getConsultationsByDossierMedical(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { dossierMedicalId } = req.params;
            const consultations = await ConsultationService.getConsultationsByDossierMedical(dossierMedicalId);
            res.status(200).json(consultations);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la récupération des consultations" });
        }
    }

    async updateConsultation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { id } = req.params;
            const { motif, observation, diagnostic } = req.body;
            const updatedConsultation = await ConsultationService.updateConsultation(id, { motif, observation, diagnostic });
            res.status(200).json({ msg: "Consultation mise à jour avec succès", consultation: updatedConsultation });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la mise à jour de la consultation" });
        }
    }

    async deleteConsultation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { id } = req.params;
            const result = await ConsultationService.deleteConsultation(id);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({ msg: error.message || "Erreur serveur lors de la suppression de la consultation" });
        }
    }
}

module.exports = new ConsultationController();
