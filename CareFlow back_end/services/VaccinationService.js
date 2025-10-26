const Vaccination = require('../models/Vaccination');

class VaccinationService {
    async createVaccination(vaccinationData) {
        const vaccination = new Vaccination(vaccinationData);
        return await vaccination.save();
    }

    async getVaccinationsByDossier(dossierMedicalId) {
        return await Vaccination.find({ dossierMedicalId })
            .sort({ dateVaccination: -1 });
    }

    async getVaccinationById(vaccinationId) {
        const vaccination = await Vaccination.findById(vaccinationId);
        if (!vaccination) {
            const error = new Error("Vaccination non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return vaccination;
    }

    async updateVaccination(vaccinationId, updateData) {
        const vaccination = await Vaccination.findByIdAndUpdate(
            vaccinationId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!vaccination) {
            const error = new Error("Vaccination non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return vaccination;
    }

    async deleteVaccination(vaccinationId) {
        const vaccination = await Vaccination.findByIdAndDelete(vaccinationId);
        if (!vaccination) {
            const error = new Error("Vaccination non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return { message: "Vaccination supprimée avec succès" };
    }
}

module.exports = new VaccinationService();