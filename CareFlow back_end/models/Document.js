const mongoose = require("mongoose");
// const { create } = require("./User");

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
    createurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dossierMedicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Document', documentSchema);