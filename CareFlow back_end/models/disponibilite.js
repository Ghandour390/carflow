const mongoose = require('mongoose');

const disponibiliteSchema = new mongoose.Schema({
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
        enum: ['en_attente', 'reserve'],
        default: 'en_attente'
    }
});


  module.exports = mongoose.model('Disponibilite',disponibiliteSchema);