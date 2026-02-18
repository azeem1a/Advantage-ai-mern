const logger = require('../utils/logger');
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Tone-specific caption patterns (used as fallbacks or for prompt guidance)
 */
const tonePatterns = {
    Witty: {
        instructions: "Be playful, humorous, and use eye-catching wordplay. High emoji density.",
        ctaOptions: ['Grab Yours!', "Let's Go!", 'Get Started!', 'Join the Fun!']
    },
    Professional: {
        instructions: "Be clean, sophisticated, and authoritative. Low emoji density.",
        ctaOptions: ['Learn More', 'Explore Now', 'Get Started', 'Discover More']
    },
    Urgent: {
        instructions: "Create a sense of FOMO and immediate action. Medium emoji density.",
        ctaOptions: ['Shop Now', 'Act Now!', 'Claim Offer', 'Limited Time']
    },
    Inspirational: {
        instructions: "Be uplifting, aspirational, and motivational. Medium emoji density.",
        ctaOptions: ['Join Us', 'Start Your Journey', 'Begin Today', 'Take Action']
    }
};

/**
 * Extract key terms from enhanced prompt for hashtag generation (Fallback)
 */
const extractKeywords = (prompt) => {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'professional', 'high', 'quality']);
    const words = prompt.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.has(word));

    return [...new Set(words)]
        .slice(0, 3)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1));
};

/**
 * Generate marketing copy with AI-powered context awareness
 */
const generateCopy = async (enhancedPrompt, tone, platform) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not configured for copy generation');
        }

        const pattern = tonePatterns[tone] || tonePatterns.Professional;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert ${platform} marketing copywriter. 
            Generate a compelling ad caption for the following product description: "${enhancedPrompt}".
            Tone: ${tone}.
            Instructions: ${pattern.instructions}
            Platform: ${platform}.
            
            Return ONLY a JSON object with this structure:
            {
                "caption": "Your generated caption here",
                "hashtags": ["#tag1", "#tag2", ...],
                "cta": "Appropriate CTA"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up response text in case it includes markdown code blocks
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const copyData = JSON.parse(cleanedText);

        logger.info(`📝 AI-powered ${tone} copy generated for ${platform}`);

        return {
            caption: copyData.caption,
            hashtags: copyData.hashtags.slice(0, 8),
            cta: copyData.cta || pattern.ctaOptions[0],
            isFallback: false
        };

    } catch (error) {
        logger.warn(`AI Copy generation failed: ${error.message}. Using dynamic fallback.`);
        const pattern = tonePatterns[tone] || tonePatterns.Professional;
        const keywords = extractKeywords(enhancedPrompt);

        return {
            caption: `Experience the best ${keywords[0] || 'solution'} for your needs. Excellence guaranteed.`,
            hashtags: [`#${platform}Ads`, '#Marketing', ...keywords.map(kw => `#${kw}`)],
            cta: pattern.ctaOptions[0],
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
