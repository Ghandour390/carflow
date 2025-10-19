const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
    nomVaccin: {
        type: String,
        required: true
    },
    dateVaccination: {
        type: Date,
        required: true
    },
    rappel: {
        type: Date
    },
    dossierMedicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);
