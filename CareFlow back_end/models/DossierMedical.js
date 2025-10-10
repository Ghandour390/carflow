const mongoose = require("mongoose");

const dossierMedicalSchema = new mongoose.Schema({
    dateCreation: {
        type: Date,
        default: Date.now
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medecinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    etat: {
        type: String,
        enum: ['actif', 'archive', 'en_cours'],
        default: 'actif'
    }
});

module.exports = mongoose.model('DossierMedical', dossierMedicalSchema);
