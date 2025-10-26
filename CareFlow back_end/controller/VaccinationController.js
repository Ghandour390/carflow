const VaccinationService = require('../services/VaccinationService');
const createVaccinationValidation = require('../validationsRequests/vaccination/createVaccinationValidation');
const updateVaccinationValidation = require('../validationsRequests/vaccination/updateVaccinationValidation');
const vaccinationIdValidation = require('../validationsRequests/vaccination/vaccinationIdValidation');

class VaccinationController {
    async createVaccination(req, res) {
        try {
            // Validation de la requête
            const { error } = createVaccinationValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const vaccination = await VaccinationService.createVaccination(req.body);
            res.status(201).json({
                message: "Vaccination créée avec succès",
                vaccination
            });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la création de la vaccination"
            });
        }
    }

    async getVaccinationsByDossier(req, res) {
        try {
            const vaccinations = await VaccinationService.getVaccinationsByDossier(req.params.dossierMedicalId);
            res.status(200).json(vaccinations);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération des vaccinations"
            });
        }
    }

    async getVaccinationById(req, res) {
        try {
            // Validation de l'ID
            const { error } = vaccinationIdValidation({ id: req.params.id });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const vaccination = await VaccinationService.getVaccinationById(req.params.id);
            res.status(200).json(vaccination);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la récupération de la vaccination"
            });
        }
    }

    async updateVaccination(req, res) {
        try {
            // Validation de l'ID
            const idValidation = vaccinationIdValidation({ id: req.params.id });
            if (idValidation.error) {
                return res.status(400).json({ message: idValidation.error.details[0].message });
            }

            // Validation des données de mise à jour
            const { error } = updateVaccinationValidation(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const vaccination = await VaccinationService.updateVaccination(req.params.id, req.body);
            res.status(200).json({
                message: "Vaccination mise à jour avec succès",
                vaccination
            });
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la mise à jour de la vaccination"
            });
        }
    }

    async deleteVaccination(req, res) {
        try {
            // Validation de l'ID
            const { error } = vaccinationIdValidation({ id: req.params.id });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const result = await VaccinationService.deleteVaccination(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(error.statusCode || 500).json({
                message: error.message || "Une erreur est survenue lors de la suppression de la vaccination"
            });
        }
    }
}

module.exports = new VaccinationController();