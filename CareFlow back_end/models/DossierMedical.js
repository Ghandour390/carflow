const mongoose = require("mongoose");

const dossierMedicalSchema = new mongoose.Schema({
    dateCreation: {
        type: Date,
        default: Date.now
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le champ patientId est requis']
    },
    medecinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le champ medecinId est requis']
    },
    etat: {
        type: String,
        enum: ['actif', 'archive', 'en_cours'],
        default: 'actif'
    }
});

module.exports = mongoose.model('DossierMedical', dossierMedicalSchema);
