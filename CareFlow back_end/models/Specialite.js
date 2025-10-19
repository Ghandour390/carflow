const mongoose = require("mongoose");

const specialiteSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['cardiologie', 'dermatologie', 'pediatrie', 'neurologie', 'orthopédie', 'gynécologie', 'psychiatrie', 'ophtalmologie'],
        required: true
    }
});

module.exports = mongoose.model('Specialite', specialiteSchema);
