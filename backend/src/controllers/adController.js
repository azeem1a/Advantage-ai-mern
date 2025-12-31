const asyncHandler = require('../utils/asyncHandler');
const Campaign = require('../models/Campaign');
const { enhancePrompt } = require('../services/promptEnhancer.service');
const { generateCopy } = require('../services/copyGenerator.service');
const { generateImage } = require('../services/aiProvider.service');
const { composeImage } = require('../services/imageComposer.service');
const { getHistory: fetchHistory, getCampaignById, deleteCampaign, createPromptVariation } = require('../services/campaign.service');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');

/**
 * MULTI-MODAL GENERATION ENDPOINT (CRITICAL)
 * Implements explicit parallel execution of:
 * - Text generation (caption + hashtags)
 * - Image generation
 * Using Promise.all() with error isolation
 */
exports.generateAd = asyncHandler(async (req, res) => {
    const { prompt, tone, platform } = req.body;

    if (!prompt || !tone || !platform) {
        throw new ApiError(400, 'All fields are required (prompt, tone, platform).');
    }

    const basePrompt = prompt;
    logger.info(`🚀 Starting Multi-Modal Ad Generation for: "${basePrompt}" [${tone}, ${platform}]`);

    // Step 1: Enhance prompt (used for both text and image generation)
    const enhancementResult = await enhancePrompt(basePrompt, tone, platform);
    const { enhancedPrompt } = enhancementResult;

    logger.info(`✨ Prompt enhanced. Beginning parallel generation...`);

    // Step 2: CRITICAL - Multi-Modal Parallel Generation with Promise.all()
    // Execute text and image generation simultaneously
    // Error isolation: one failure doesn't block the other
    const [imageResult, copyResult] = await Promise.all([
        // Image generation with full error handling
        generateImage(enhancedPrompt).catch(error => {
            logger.error(`Image generation failed in parallel execution: ${error.message}`);
            // Return fallback result instead of throwing
            return {
                imageBuffer: null,
                imageSource: 'fallback',
                isFallback: true,
                error: error.message
            };
        }),
        // Copy generation with full error handling
        generateCopy(enhancedPrompt, tone, platform).catch(error => {
            logger.error(`Copy generation failed in parallel execution: ${error.message}`);
            // Return fallback result instead of throwing
            return {
                caption: 'Discover our latest offering!',
                hashtags: ['#Ad', '#Marketing'],
                cta: 'Learn More',
                isFallback: true,
                error: error.message
            };
        })
    ]);

    logger.info(`✅ Parallel generation complete. Image source: ${imageResult.imageSource}, Copy: ${copyResult.isFallback ? 'fallback' : 'generated'}`);

    // Step 3: Compose image with branding (logo + CTA)
    const { imageBuffer, imageSource, isFallback } = imageResult;
    const { caption, hashtags } = copyResult;

    logger.info('🎨 Composing final ad creative with branding...');
    const imageUrl = await composeImage(imageBuffer, tone, platform);

    if (!imageUrl) {
        throw new ApiError(500, 'Image composition failed completely.');
    }

    // Step 4: Determine final status
    const status = isFallback ? 'fallback' : 'success';

    // Step 5: Save campaign to database
    const campaign = await Campaign.create({
        basePrompt,
        enhancedPrompt,
        tone,
        platform,
        caption,
        hashtags,
        imageUrl,
        imagePath: imageUrl,
        imageSource: imageSource || 'fallback',
        status
    });

    logger.info(`✅ Campaign created successfully: ${campaign._id}`);

    res.status(201).json({
        success: true,
        data: campaign,
        message: status === 'fallback'
            ? 'Campaign created with fallback image (AI providers unavailable)'
            : 'Campaign created successfully'
    });
});

/**
 * Get campaign history
 */
exports.getHistory = asyncHandler(async (req, res) => {
    const history = await fetchHistory();
    res.status(200).json({
        success: true,
        data: history,
        count: history.length
    });
});

/**
 * Download campaign image
 */
exports.downloadCampaignImage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await getCampaignById(id);

    if (!campaign.imageUrl && !campaign.imagePath) {
        throw new ApiError(404, 'Image not available for this campaign');
    }

    // Build file path from stored imagePath or imageUrl
    const relPath = (campaign.imagePath || campaign.imageUrl || '').replace(/^\//, '');
    const filePath = path.join(__dirname, '../../', relPath);

    if (!fs.existsSync(filePath)) {
        throw new ApiError(404, 'Image file not found on server');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', 'image/png');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
});

/**
 * Delete campaign
 */
exports.deleteCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteCampaign(id);
    res.status(200).json({
        success: true,
        message: 'Campaign deleted successfully',
    });
});

/**
 * Remix campaign - creates variation of existing campaign
 */
exports.remixCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Fetch original campaign
    const originalCampaign = await getCampaignById(id);

    // Create prompt variation
    const variedPrompt = createPromptVariation(originalCampaign.basePrompt);

    logger.info(`🔄 Remixing campaign ${id}: "${originalCampaign.basePrompt}" → "${variedPrompt}"`);

    // Re-run full generation pipeline with varied prompt
    const enhancementResult = await enhancePrompt(variedPrompt, originalCampaign.tone, originalCampaign.platform);
    const { enhancedPrompt } = enhancementResult;

    // Multi-modal parallel generation
    const [imageResult, copyResult] = await Promise.all([
        generateImage(enhancedPrompt).catch(error => {
            logger.error(`Remix image generation failed: ${error.message}`);
            return {
                imageBuffer: null,
                imageSource: 'fallback',
                isFallback: true
            };
        }),
        generateCopy(enhancedPrompt, originalCampaign.tone, originalCampaign.platform).catch(error => {
            logger.error(`Remix copy generation failed: ${error.message}`);
            return {
                caption: 'Discover our remixed offering!',
                hashtags: ['#Remix', '#Ad'],
                cta: 'Learn More',
                isFallback: true
            };
        })
    ]);

    // Compose image
    const { imageBuffer, imageSource, isFallback } = imageResult;
    const { caption, hashtags } = copyResult;

    const imageUrl = await composeImage(imageBuffer, originalCampaign.tone, originalCampaign.platform);

    if (!imageUrl) {
        throw new ApiError(500, 'Remix image composition failed');
    }

    // Create new campaign
    const remixedCampaign = await Campaign.create({
        basePrompt: variedPrompt,
        enhancedPrompt,
        tone: originalCampaign.tone,
        platform: originalCampaign.platform,
        caption,
        hashtags,
        imageUrl,
        imagePath: imageUrl,
        imageSource: imageSource || 'fallback',
        status: isFallback ? 'fallback' : 'success'
    });

    logger.info(`✅ Remix campaign created: ${remixedCampaign._id}`);

    res.status(201).json({
        success: true,
        data: remixedCampaign,
        message: 'Campaign remixed successfully'
    });
});
