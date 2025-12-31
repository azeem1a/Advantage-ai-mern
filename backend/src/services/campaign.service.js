const fs = require('fs');
const path = require('path');
const Campaign = require('../models/Campaign');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const getHistory = async () => {
    const history = await Campaign.find().sort({ createdAt: -1 });
    return history;
};

const getCampaignById = async (id) => {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
        throw new ApiError(404, 'Campaign not found');
    }
    return campaign;
};

const deleteCampaign = async (id) => {
    const campaign = await getCampaignById(id);
    // Optional file cleanup
    if (campaign.imagePath) {
        const fsPath = campaign.imagePath.startsWith('/')
            ? path.join(__dirname, '../../', campaign.imagePath.replace(/^\//, ''))
            : path.join(__dirname, '../../', campaign.imagePath);
        try {
            if (fs.existsSync(fsPath)) {
                fs.unlinkSync(fsPath);
            }
        } catch (err) {
            logger.warn(`Failed to delete image file: ${err.message}`);
        }
    }
    await Campaign.deleteOne({ _id: campaign._id });
    logger.info(`Campaign deleted: ${id}`);
    return true;
};

/**
 * Create prompt variation for remix functionality
 */
const createPromptVariation = (originalPrompt) => {
    const variations = [
        `${originalPrompt} - alternative version`,
        `${originalPrompt} with different style`,
        `${originalPrompt} - creative remix`,
        `${originalPrompt} with unique perspective`,
        `reimagined ${originalPrompt}`
    ];

    const randomIndex = Math.floor(Math.random() * variations.length);
    return variations[randomIndex];
};

module.exports = {
    getHistory,
    getCampaignById,
    deleteCampaign,
    createPromptVariation
};

