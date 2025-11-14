const Analyse = require('../models/Analyse');

class AnalyseService {
    async createAnalyse(analyseData) {
        const analyse = new Analyse(analyseData);
        return await analyse.save();
    }

    async getAnalysesByDossier(dossierMedicalId) {
        return await Analyse.find({ dossierMedicalId })
            .sort({ dateAnalyse: -1 });
    }

    async getAnalyseById(analyseId) {
        const analyse = await Analyse.findById(analyseId);
        if (!analyse) {
            const error = new Error("Analyse non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return analyse;
    }

    async updateAnalyse(analyseId, updateData) {
        const analyse = await Analyse.findByIdAndUpdate(
            analyseId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!analyse) {
            const error = new Error("Analyse non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return analyse;
    }

    async deleteAnalyse(analyseId) {
        const analyse = await Analyse.findByIdAndDelete(analyseId);
        if (!analyse) {
            const error = new Error("Analyse non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return { message: "Analyse supprimée avec succès" };
    }
}

module.exports = new AnalyseService();