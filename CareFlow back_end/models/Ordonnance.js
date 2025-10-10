const mongoose = require("mongoose");

const ordonnanceSchema = new mongoose.Schema({
    dateOrdonnance: {
        type: Date,
        default: Date.now
    },
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true
    },
    instructions: {
        type: String
    }
});

module.exports = mongoose.model('Ordonnance', ordonnanceSchema);
