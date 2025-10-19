const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
    medcinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateConsultation: {
        type: Date,
        default: Date.now
    },
    motif: {
        type: String,
        required: true
    },
    observation: {
        type: String
    },
    diagnostic: {
        type: String
    },
    dossierMedicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Consultation', consultationSchema);
