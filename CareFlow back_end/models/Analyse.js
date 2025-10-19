const mongoose = require("mongoose");

const analyseSchema = new mongoose.Schema({
    typeAnalyse: {
        type: String,
        required: true
    },
    dateAnalyse: {
        type: Date,
        default: Date.now
    },
    resultat: {
        type: String
    },
    dossierMedicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Analyse', analyseSchema);
