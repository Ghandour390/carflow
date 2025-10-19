const mongoose = require("mongoose");

const antecedentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['medical', 'chirurgical', 'familial', 'allergique'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dossierMedicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DossierMedical',
        required: true
    }
});

module.exports = mongoose.model('Antecedent', antecedentSchema);
