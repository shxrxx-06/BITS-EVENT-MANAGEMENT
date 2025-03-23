const mongoose = require('mongoose');

const feventFormSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const FeventForm = mongoose.model('FeventForm', feventFormSchema);

module.exports = FeventForm;
