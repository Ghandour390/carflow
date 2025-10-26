const Antecedent = require('../models/Antecedent');

class AntecedentService {
    async createAntecedent(antecedentData) {
        const antecedent = new Antecedent(antecedentData);
        return await antecedent.save();
    }

    async getAntecedentsByDossier(dossierMedicalId) {
        return await Antecedent.find({ dossierMedicalId })
            .sort({ type: 1 });
    }

    async getAntecedentById(antecedentId) {
        const antecedent = await Antecedent.findById(antecedentId);
        if (!antecedent) {
            const error = new Error("Antécédent non trouvé");
            error.statusCode = 404;
            throw error;
        }
        return antecedent;
    }

    async updateAntecedent(antecedentId, updateData) {
        const antecedent = await Antecedent.findByIdAndUpdate(
            antecedentId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!antecedent) {
            const error = new Error("Antécédent non trouvé");
            error.statusCode = 404;
            throw error;
        }
        return antecedent;
    }

    async deleteAntecedent(antecedentId) {
        const antecedent = await Antecedent.findByIdAndDelete(antecedentId);
        if (!antecedent) {
            const error = new Error("Antécédent non trouvé");
            error.statusCode = 404;
            throw error;
        }
        return { message: "Antécédent supprimé avec succès" };
    }
}

module.exports = new AntecedentService();