const mongoose = require("mongoose");

const specialiteSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['cardiologue', 'dermatologue', 'pediatre', 'generaliste', 'autre'],
        required: true
    }
});

module.exports = mongoose.model('Specialite', specialiteSchema);
