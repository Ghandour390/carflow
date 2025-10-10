const mongoose = require("mongoose");

const medicamentSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequence: {
        type: String,
        required: true
    },
    ordonnanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ordonnance',
        required: true
    }
});

module.exports = mongoose.model('Medicament', medicamentSchema);
