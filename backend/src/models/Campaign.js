const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    basePrompt: {
        type: String,
        required: true,
    },
    enhancedPrompt: {
        type: String,
    },
    tone: {
        type: String,
        required: true,
        enum: ['Witty', 'Professional', 'Urgent', 'Inspirational']
    },
    platform: {
        type: String,
        required: true,
        enum: ['Instagram', 'LinkedIn', 'Facebook', 'Twitter'],
    },
    caption: {
        type: String,
    },
    hashtags: {
        type: [String],
    },
    imageUrl: {
        type: String,
    },
    imagePath: {
        type: String,
    },
    imageSource: {
        type: String,
        enum: ['huggingface', 'nanabana', 'gemini', 'fallback'],
        default: 'fallback',
    },
    status: {
        type: String,
        enum: ['success', 'fallback'],
        default: 'success',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Campaign', campaignSchema);
