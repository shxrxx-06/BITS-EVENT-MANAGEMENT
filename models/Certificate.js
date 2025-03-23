const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    issueDate: { type: Date, required: true },
    status: { type: String, enum: ['valid', 'expired'], default: 'valid' }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
