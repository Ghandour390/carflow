const mongoose = require("mongoose");

 
// medecinId date heureDebut heureFin  statut patientId
const rendezVousSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    medecinId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    heureDebut: {
        type: String,
        required: true
    },
    heureFin: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        enum: ['en_attente', 'confirme', 'annule', 'termine','disponible'],
        default: 'en_attente'
    }
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);
