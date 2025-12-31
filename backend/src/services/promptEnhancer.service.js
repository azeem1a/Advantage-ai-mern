const logger = require('../utils/logger');

/**
 * Tone-specific enhancement rules
 */
const toneEnhancements = {
    Witty: {
        style: 'playful, humorous, eye-catching',
        mood: 'fun, engaging, lighthearted',
        adjectives: ['vibrant', 'dynamic', 'colorful', 'energetic']
    },
    Professional: {
        style: 'clean, sophisticated, modern',
        mood: 'trustworthy, premium, corporate',
        adjectives: ['sleek', 'polished', 'professional', 'elegant']
    },
    Urgent: {
        style: 'bold, attention-grabbing, impactful',
        mood: 'exciting, time-sensitive, dynamic',
        adjectives: ['striking', 'dramatic', 'intense', 'powerful']
    },
    Inspirational: {
        style: 'uplifting, aspirational, beautiful',
        mood: 'motivational, positive, empowering',
        adjectives: ['stunning', 'inspiring', 'magnificent', 'breathtaking']
    }
};

/**
 * Platform-specific enhancement rules
 */
const platformEnhancements = {
    Instagram: {
        format: 'square format 1:1 aspect ratio',
        style: 'Instagram-optimized, mobile-first, visually striking'
    },
    LinkedIn: {
        format: 'horizontal format 1.91:1 aspect ratio',
        style: 'LinkedIn-optimized, professional, business-appropriate'
    },
    Facebook: {
        format: 'square format 1:1 aspect ratio',
        style: 'Facebook-optimized, social media friendly, engaging'
    },
    Twitter: {
        format: 'landscape format 16:9 aspect ratio',
        style: 'Twitter-optimized, concise, attention-grabbing'
    }
};

/**
 * Enhance user prompt with marketing and AI generation optimizations
 */
const enhancePrompt = async (basePrompt, tone, platform) => {
    try {
        const toneRules = toneEnhancements[tone] || toneEnhancements.Professional;
        const platformRules = platformEnhancements[platform] || platformEnhancements.Instagram;

        // Build enhanced prompt with marketing optimization
        const enhancedPrompt = `
Professional advertising photography: ${basePrompt}.
Style: ${toneRules.style}, ${toneRules.mood}.
Visual qualities: ${toneRules.adjectives.join(', ')}.
Platform: ${platformRules.style}, ${platformRules.format}.
Technical specs: high resolution, studio lighting, marketing-grade quality, 4K, professional product photography.
        `.trim().replace(/\s+/g, ' ');

        logger.info(`✨ Prompt enhanced for ${tone} tone and ${platform} platform`);

        return {
            enhancedPrompt,
            isFallback: false
        };

    } catch (error) {
        logger.warn(`Prompt enhancement failed: ${error.message}. Using basic enhancement.`);
        return {
            enhancedPrompt: `Professional ${platform} ad for ${basePrompt}. ${tone} style, high quality.`,
            isFallback: true
        };
    }
};

module.exports = { enhancePrompt };
