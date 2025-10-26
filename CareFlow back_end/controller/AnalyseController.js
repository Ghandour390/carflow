const AnalyseService = require('../services/AnalyseService');
const createAnalyseValidation = require('../validationsRequests/analyse/createAnalyseValidation');
const updateAnalyseValidation = require('../validationsRequests/analyse/updateAnalyseValidation');
const analyseIdValidation = require('../validationsRequests/analyse/analyseIdValidation');

class AnalyseController {
    async createAnalyse(req, res) {
        try {
            // Validation de la requête
            const { error } = createAnalyseValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const analyse = await AnalyseService.createAnalyse(req.body);
            res.status(201).json({
                message: "Analyse créée avec succès",
                analyse
            });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la création de l'analyse"
            });
        }
    }

    async getAnalysesByDossier(req, res) {
        try {
            const analyses = await AnalyseService.getAnalysesByDossier(req.params.dossierMedicalId);
            res.status(200).json(analyses);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération des analyses"
            });
        }
    }

    async getAnalyseById(req, res) {
        try {
            // Validation de l'ID
            const { error } = analyseIdValidation({ id: req.params.id });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const analyse = await AnalyseService.getAnalyseById(req.params.id);
            res.status(200).json(analyse);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération de l'analyse"
            });
        }
    }

    async updateAnalyse(req, res) {
        try {
            // Validation de l'ID
            const idValidation = analyseIdValidation({ id: req.params.id });
            if (idValidation.error) {
                return res.status(400).json({ message: idValidation.error.details[0].message });
            }

            // Validation des données de mise à jour
            const { error } = updateAnalyseValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const analyse = await AnalyseService.updateAnalyse(req.params.id, req.body);
            res.status(200).json({
                message: "Analyse mise à jour avec succès",
                analyse
            });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la mise à jour de l'analyse"
            });
        }
    }

    async deleteAnalyse(req, res) {
        try {
            // Validation de l'ID
            const { error } = analyseIdValidation({ id: req.params.id });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const result = await AnalyseService.deleteAnalyse(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la suppression de l'analyse"
            });
        }
    }
}

module.exports = new AnalyseController();