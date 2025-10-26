const Analyse = require('../models/Analyse');

class AnalyseService {
    async createAnalyse(analyseData) {
        try {
            const analyse = new Analyse(analyseData);
            return await analyse.save();
        } catch (error) {
            throw error;
        }
    }

    async getAnalysesByDossier(dossierMedicalId) {
        try {
            return await Analyse.find({ dossierMedicalId })
                .sort({ dateAnalyse: -1 });
        } catch (error) {
            throw error;
        }
    }

    async getAnalyseById(analyseId) {
        try {
            const analyse = await Analyse.findById(analyseId);
            if (!analyse) {
                const error = new Error("Analyse non trouvée");
                error.statusCode = 404;
                throw error;
            }
            return analyse;
        } catch (error) {
            throw error;
        }
    }

    async updateAnalyse(analyseId, updateData) {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    async deleteAnalyse(analyseId) {
        try {
            const analyse = await Analyse.findByIdAndDelete(analyseId);
            if (!analyse) {
                const error = new Error("Analyse non trouvée");
                error.statusCode = 404;
                throw error;
            }
            return { message: "Analyse supprimée avec succès" };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AnalyseService();