const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema ({
    email: { type: String, required: true },
    message: { type: String, required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
});

module.exports = mongoose.model('Offer', offerSchema);