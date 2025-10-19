const Medicament = require('../models/Medicament');
const Ordonnance = require('../models/Ordonnance');

class MedicamentController {
    async createMedicament(req, res) {
        try {
            const { nom, dosage, frequence, ordonnanceId } = req.body;

            const ordonnance = await Ordonnance.findById(ordonnanceId);
            if (!ordonnance) {
                return res.status(404).json({ msg: "Ordonnance non trouvée" });
            }

            const newMedicament = await Medicament.create({
                nom,
                dosage,
                frequence,
                ordonnanceId
            });
            res.status(201).json({ msg: "Médicament ajouté avec succès à l'ordonnance", medicament: newMedicament });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de l'ajout du médicament" });
        }
    }

    async getMedicamentById(req, res) {
        try {
            const { id } = req.params;
            const medicament = await Medicament.findById(id)
                .populate('ordonnanceId');
            if (!medicament) {
                return res.status(404).json({ msg: "Médicament non trouvé" });
            }
            res.status(200).json(medicament);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération du médicament" });
        }
    }

    async getMedicamentsByOrdonnance(req, res) {
        try {
            const { ordonnanceId } = req.params;
            const medicaments = await Medicament.find({ ordonnanceId });
            res.status(200).json(medicaments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la récupération des médicaments de l'ordonnance" });
        }
    }

    async updateMedicament(req, res) {
        try {
            const { id } = req.params;
            const { nom, dosage, frequence } = req.body;
            const updatedMedicament = await Medicament.findByIdAndUpdate(
                id,
                { nom, dosage, frequence },
                { new: true, runValidators: true }
            );
            if (!updatedMedicament) {
                return res.status(404).json({ msg: "Médicament non trouvé" });
            }
            res.status(200).json({ msg: "Médicament mis à jour avec succès", medicament: updatedMedicament });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la mise à jour du médicament" });
        }
    }

    async deleteMedicament(req, res) {
        try {
            const { id } = req.params;
            const deletedMedicament = await Medicament.findByIdAndDelete(id);
            if (!deletedMedicament) {
                return res.status(404).json({ msg: "Médicament non trouvé" });
            }
            res.status(200).json({ msg: "Médicament supprimé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erreur serveur lors de la suppression du médicament" });
        }
    }
}

module.exports = new MedicamentController();
