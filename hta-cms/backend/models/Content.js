const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        enum: ['home', 'about', 'departments', 'media', 'contact', 'events', 'give', 'shared']
    },
    section: {
        type: String,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Flexible for any content type
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Compound index for faster queries
contentSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Content', contentSchema);
