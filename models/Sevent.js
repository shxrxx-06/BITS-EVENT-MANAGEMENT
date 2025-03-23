const mongoose = require('mongoose');

const seventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'completed'], default: 'pending' }
}, { timestamps: true });

const Sevent = mongoose.model('Sevent', seventSchema);

module.exports = Sevent;
