const Consultation = require('../models/Consultation');
const DossierMedical = require('../models/DossierMedical');
const User = require('../models/User');

class ConsultationService {
    async createConsultation({ medcinId, dossierMedicalId, ...rest }) {
        const medecin = await User.findById(medcinId);
        if (!medecin) {
            const error = new Error("Médecin non trouvé");
            error.statusCode = 404;
            throw error;
        }

        const dossierMedical = await DossierMedical.findById(dossierMedicalId);
        if (!dossierMedical) {
            const error = new Error("Dossier médical non trouvé");
            error.statusCode = 404;
            throw error;
        }

        return Consultation.create({
            medcinId,
            dossierMedicalId,
            ...rest
        });
    }

    async getConsultationById(id) {
        const consultation = await Consultation.findById(id)
            .populate('medcinId', 'prenom nom')
            .populate('dossierMedicalId');
        if (!consultation) {
            const error = new Error("Consultation non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return consultation;
    }

    async getConsultationsByDossierMedical(dossierMedicalId) {
        return Consultation.find({ dossierMedicalId })
            .populate('medcinId', 'prenom nom');
    }

    async updateConsultation(id, updateData) {
        const updatedConsultation = await Consultation.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedConsultation) {
            const error = new Error("Consultation non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return updatedConsultation;
    }

    async deleteConsultation(id) {
        const deletedConsultation = await Consultation.findByIdAndDelete(id);
        if (!deletedConsultation) {
            const error = new Error("Consultation non trouvée");
            error.statusCode = 404;
            throw error;
        }
        return { msg: "Consultation supprimée avec succès" };
    }
}

module.exports = new ConsultationService();