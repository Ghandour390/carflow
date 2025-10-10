const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
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
    dossierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Consultation', consultationSchema);
