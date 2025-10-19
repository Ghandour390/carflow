const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    prenom: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['homme', 'femme'],
        required: true
    },
    CIN: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    motDePasse: {
        type: String,
        required: true
    },
    dateNaissance: {
        type: Date,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: false
    },
    specialiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialite',
        required: false
    },
    estActif: {
        type: Boolean,
        default: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);
