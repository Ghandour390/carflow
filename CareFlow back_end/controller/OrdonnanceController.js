const Ordonnance = require('../models/Ordonnance');
const Consultation = require('../models/Consultation');
const { validationResult } = require('express-validator');

class OrdonnanceController {
    async createOrdonnance(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { consultationId, instructions } = req.body;

            const consultation = await Consultation.findById(consultationId);
            if (!consultation) {
                return res.status(404).json({ msg: "Consultation non trouvée" });
            }

            const newOrdonnance = await Ordonnance.create({
                consultationId,
                instructions
            });
            res.status(201).json({ msg: "Ordonnance créée avec succès", ordonnance: newOrdonnance });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la création de l'ordonnance" });
        }
    }

    async getOrdonnanceById(req, res) {
        try {
            const { id } = req.params;
            const ordonnance = await Ordonnance.findById(id)
                .populate('consultationId');
            if (!ordonnance) {
                return res.status(404).json({ msg: "Ordonnance non trouvée" });
            }
            res.status(200).json(ordonnance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération de l'ordonnance" });
        }
    }

    async getOrdonnancesByConsultation(req, res) {
        try {
            const { consultationId } = req.params;
            const ordonnances = await Ordonnance.find({ consultationId });
            res.status(200).json(ordonnances);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des ordonnances de la consultation" });
        }
    }

    async updateOrdonnance(req, res) {
        try {
            const { id } = req.params;
            const { instructions } = req.body;
            const updatedOrdonnance = await Ordonnance.findByIdAndUpdate(
                id,
                { instructions },
                { new: true, runValidators: true }
            );
            if (!updatedOrdonnance) {
                return res.status(404).json({ msg: "Ordonnance non trouvée" });
            }
            res.status(200).json({ msg: "Ordonnance mise à jour avec succès", ordonnance: updatedOrdonnance });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la mise à jour de l'ordonnance" });
        }
    }

    async deleteOrdonnance(req, res) {
        try {
            const { id } = req.params;
            const deletedOrdonnance = await Ordonnance.findByIdAndDelete(id);
            if (!deletedOrdonnance) {
                return res.status(404).json({ msg: "Ordonnance non trouvée" });
            }
            res.status(200).json({ msg: "Ordonnance supprimée avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la suppression de l'ordonnance" });
        }
    }
}

module.exports = new OrdonnanceController();
