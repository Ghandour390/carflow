const AntecedentService = require('../services/AntecedentService');
const createAntecedentValidation = require('../validationsRequests/antecedent/createAntecedentValidation');
const updateAntecedentValidation = require('../validationsRequests/antecedent/updateAntecedentValidation');
const antecedentIdValidation = require('../validationsRequests/antecedent/antecedentIdValidation');

class AntecedentController {
    async createAntecedent(req, res) {
        try {
            // Validation de la requête
            const { error } = createAntecedentValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const antecedent = await AntecedentService.createAntecedent(req.body);
            res.status(201).json({
                message: "Antécédent créé avec succès",
                antecedent
            });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la création de l'antécédent"
            });
        }
    }

    async getAntecedentsByDossier(req, res) {
        try {
            const antecedents = await AntecedentService.getAntecedentsByDossier(req.params.dossierMedicalId);
            res.status(200).json(antecedents);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération des antécédents"
            });
        }
    }

    async getAntecedentById(req, res) {
        try {
            // Validation de l'ID
            const { error } = antecedentIdValidation({ id: req.params.id });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const antecedent = await AntecedentService.getAntecedentById(req.params.id);
            res.status(200).json(antecedent);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération de l'antécédent"
            });
        }
    }

    async updateAntecedent(req, res) {
        try {
            // Validation de l'ID
            const idValidation = antecedentIdValidation({ id: req.params.id });
            if (idValidation.error) {
                return res.status(400).json({ message: idValidation.error.details[0].message });
            }

            // Validation des données de mise à jour
            const { error } = updateAntecedentValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const antecedent = await AntecedentService.updateAntecedent(req.params.id, req.body);
            res.status(200).json({
                message: "Antécédent mis à jour avec succès",
                antecedent
            });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la mise à jour de l'antécédent"
            });
        }
    }

    async deleteAntecedent(req, res) {
        try {
            // Validation de l'ID
            const { error } = antecedentIdValidation({ id: req.params.id });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const result = await AntecedentService.deleteAntecedent(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la suppression de l'antécédent"
            });
        }
    }
}

module.exports = new AntecedentController();