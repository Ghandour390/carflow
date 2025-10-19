const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    typeDocument: {
        type: String,
        required: true
    },
    cheminFichier: {
        type: String,
        required: true
    },
    dateAjout: {
        type: Date,
        default: Date.now
    },
    dossierMedicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Document', documentSchema);