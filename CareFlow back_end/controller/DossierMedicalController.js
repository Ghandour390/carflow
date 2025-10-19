const DossierMedical = require('../models/DossierMedical');
const User = require('../models/User');
const { validationResult } = require('express-validator');

class DossierMedicalController {

    async createDossierMedical(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let { patientId, medecinId, etat } = req.body;

            const patient = await User.findById(patientId);
            if (!patient) {
                return res.status(404).json({ msg: "Patient not found" });
            }

            const medecin = await User.findById(medecinId);
            if (!medecin) {
                return res.status(404).json({ msg: "Medecin not found" });
            }

            const newDossier = await DossierMedical.create({
                patientId,
                medecinId,
                etat 
            });
            res.status(201).json({ msg: "Dossier médical créé avec succès", dossier: newDossier });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la création du dossier médical" });
        }
    }


    async getDossierMedicalById(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const dossier = await DossierMedical.findById(id)
                .populate('patientId', 'prenom nom')
                .populate('medecinId', 'prenom nom');
            if (!dossier) {
                return res.status(404).json({ msg: "Dossier médical non trouvé" });
            }
            res.status(200).json(dossier);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération du dossier médical" });
        }
    }

    async getDossiersMedicalByPatient(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { patientId } = req.params;
            const dossiers = await DossierMedical.find({ patientId })
                .populate('patientId', 'prenom nom')
                .populate('medecinId', 'prenom nom');
            res.status(200).json(dossiers);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des dossiers médicaux du patient" });
        }
    }

    async updateDossierMedical(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { etat } = req.body;
            const updatedDossier = await DossierMedical.findByIdAndUpdate(
                id,
                { etat },
                { new: true, runValidators: true }
            );
            if (!updatedDossier) {
                return res.status(404).json({ msg: "Dossier médical non trouvé" });
            }
            res.status(200).json({ msg: "Dossier médical mis à jour avec succès", dossier: updatedDossier });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la mise à jour du dossier médical" });
        }
    }

    async deleteDossierMedical(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const deletedDossier = await DossierMedical.findByIdAndDelete(id);
            if (!deletedDossier) {
                return res.status(404).json({ msg: "Dossier médical non trouvé" });
            }
            res.status(200).json({ msg: "Dossier médical supprimé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la suppression du dossier médical" });
        }
    }
}

module.exports = new DossierMedicalController();
