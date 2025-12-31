const logger = require('../utils/logger');

/**
 * Tone-specific caption templates and patterns
 */
const tonePatterns = {
    Witty: {
        captionStarters: [
            "Don't just scroll, take action! 🚀",
            "Plot twist: This could be yours! 🎉",
            "Your feed called... it wants this! ✨",
            "Warning: May cause serious FOMO! ⚡"
        ],
        emojiDensity: 'high',
        ctaOptions: ['Grab Yours!', "Let's Go!", 'Get Started!', 'Join the Fun!']
    },
    Professional: {
        captionStarters: [
            "Elevate your business with premium solutions.",
            "Experience excellence in every detail.",
            "Transform your vision into reality.",
            "Where quality meets innovation."
        ],
        emojiDensity: 'low',
        ctaOptions: ['Learn More', 'Explore Now', 'Get Started', 'Discover More']
    },
    Urgent: {
        captionStarters: [
            "⏰ Limited time offer! Act now before it's gone.",
            "🔥 Flash Sale: Don't miss out!",
            "⚡ Hurry! Offer expires soon.",
            "🚨 Last chance to save big!"
        ],
        emojiDensity: 'medium',
        ctaOptions: ['Shop Now', 'Act Now!', 'Claim Offer', 'Limited Time']
    },
    Inspirational: {
        captionStarters: [
            "Dream big, achieve more. Your journey starts here. 🌟",
            "Believe in yourself and make it happen. ✨",
            "Every great achievement begins with a single step. 🚀",
            "Your potential is limitless. Start today. 💫"
        ],
        emojiDensity: 'medium',
        ctaOptions: ['Join Us', 'Start Your Journey', 'Begin Today', 'Take Action']
    }
};

/**
 * Extract key terms from enhanced prompt for hashtag generation
 */
const extractKeywords = (prompt) => {
    // Remove common words and extract meaningful terms
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'professional', 'high', 'quality']);
    const words = prompt.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word));

    // Return unique words, capitalize first letter
    return [...new Set(words)]
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1));
};

/**
 * Generate marketing copy with tone-based variations
 */
const generateCopy = async (enhancedPrompt, tone, platform) => {
    try {
        const pattern = tonePatterns[tone] || tonePatterns.Professional;

        // Select caption
        const captionIndex = Math.floor(Math.random() * pattern.captionStarters.length);
        const caption = pattern.captionStarters[captionIndex];

        // Generate hashtags
        const keywords = extractKeywords(enhancedPrompt);
        const platformTag = `${platform}Ads`;
        const toneTag = `${tone}Vibes`;

        const hashtags = [
            `#${platformTag}`,
            '#Marketing',
            '#AdVantageGen',
            `#${toneTag}`,
            ...keywords.map(kw => `#${kw}`)
        ].slice(0, 8); // Limit to 8 hashtags

        logger.info(`📝 Generated ${tone} copy for ${platform}`);

        return {
            caption,
            hashtags,
            cta: pattern.ctaOptions[0], // First CTA option for this tone
            isFallback: false
        };

    } catch (error) {
        logger.warn(`Copy generation failed: ${error.message}. Using fallback.`);
        return {
            caption: 'Discover something amazing today!',
            hashtags: ['#Ad', '#Marketing', '#New'],
            cta: 'Learn More',
            isFallback: true
        };
    }
};

/**
 * Get CTA text based on tone
 */
const getCTAForTone = (tone) => {
    const pattern = tonePatterns[tone] || tonePatterns.Professional;
    return pattern.ctaOptions[Math.floor(Math.random() * pattern.ctaOptions.length)];
};

module.exports = { generateCopy, getCTAForTone };
