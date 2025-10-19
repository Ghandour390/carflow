const Consultation = require('../models/Consultation');
const DossierMedical = require('../models/DossierMedical');
const User = require('../models/User');
const { validationResult } = require('express-validator');

class ConsultationController {
    async createConsultation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { medcinId, motif, observation, diagnostic, dossierMedicalId } = req.body;

            const medecin = await User.findById(medcinId);
            if (!medecin) {
                return res.status(404).json({ msg: "Medecin not found" });
            }

            const dossierMedical = await DossierMedical.findById(dossierMedicalId);
            if (!dossierMedical) {
                return res.status(404).json({ msg: "Dossier médical non trouvé" });
            }

            const newConsultation = await Consultation.create({
                medcinId,
                motif,
                observation,
                diagnostic,
                dossierMedicalId
            });
            res.status(201).json({ msg: "Consultation créée avec succès", consultation: newConsultation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la création de la consultation" });
        }
    }

    async getConsultationById(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const consultation = await Consultation.findById(id)
                .populate('medcinId', 'prenom nom')
                .populate('dossierMedicalId');
            if (!consultation) {
                return res.status(404).json({ msg: "Consultation non trouvée" });
            }
            res.status(200).json(consultation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération de la consultation" });
        }
    }

    async getConsultationsByDossierMedical(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { dossierMedicalId } = req.params;
            const consultations = await Consultation.find({ dossierMedicalId })
                .populate('medcinId', 'prenom nom');
            res.status(200).json(consultations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des consultations du dossier médical" });
        }
    }

    async updateConsultation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { motif, observation, diagnostic } = req.body;
            const updatedConsultation = await Consultation.findByIdAndUpdate(
                id,
                { motif, observation, diagnostic },
                { new: true, runValidators: true }
            );
            if (!updatedConsultation) {
                return res.status(404).json({ msg: "Consultation non trouvée" });
            }
            res.status(200).json({ msg: "Consultation mise à jour avec succès", consultation: updatedConsultation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la mise à jour de la consultation" });
        }
    }

    async deleteConsultation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const deletedConsultation = await Consultation.findByIdAndDelete(id);
            if (!deletedConsultation) {
                return res.status(404).json({ msg: "Consultation non trouvée" });
            }
            res.status(200).json({ msg: "Consultation supprimée avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la suppression de la consultation" });
        }
    }
}

module.exports = new ConsultationController();
