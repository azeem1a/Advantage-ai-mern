
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { GoogleGenerativeAI } = require("@google/generative-ai");



const FALLBACK_IMAGE_PATH = path.join(__dirname, '../../assets/fallback.png');

/**
 * Create or retrieve fallback image
 */
const getFallbackImage = async () => {
    try {
        if (fs.existsSync(FALLBACK_IMAGE_PATH)) {
            return fs.readFileSync(FALLBACK_IMAGE_PATH);
        }

        // Generate fallback image with branding
        const buffer = await sharp({
            create: {
                width: 1080,
                height: 1080,
                channels: 4,
                background: { r: 99, g: 102, b: 241, alpha: 0.1 } // Light purple
            }
        })
            .composite([{
                input: Buffer.from(`
                <svg width="1080" height="1080">
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.3" />
                            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:0.3" />
                        </linearGradient>
                    </defs>
                    <rect width="1080" height="1080" fill="url(#grad)"/>
                    <text x="540" y="500" font-family="Arial, sans-serif" font-size="48" 
                          fill="#6366f1" text-anchor="middle" font-weight="bold">
                        AdVantage Gen
                    </text>
                    <text x="540" y="560" font-family="Arial, sans-serif" font-size="24" 
                          fill="#64748b" text-anchor="middle">
                        Demo Mode - AI Provider Unavailable
                    </text>
                </svg>
            `),
                top: 0,
                left: 0
            }])
            .png()
            .toBuffer();

        // Save for future use
        fs.mkdirSync(path.dirname(FALLBACK_IMAGE_PATH), { recursive: true });
        fs.writeFileSync(FALLBACK_IMAGE_PATH, buffer);

        return buffer;
    } catch (error) {
        logger.error(`Fallback image creation failed: ${error.message}`);
        // Last resort: simple gray image
        return sharp({
            create: {
                width: 1080,
                height: 1080,
                channels: 4,
                background: { r: 220, g: 220, b: 220, alpha: 1 }
            }
        }).png().toBuffer();
    }
};

/**
 * Provider 1: Hugging Face Inference API
 */
const tryHuggingFace = async (prompt) => {
    if (!process.env.HUGGING_FACE_TOKEN) {
        logger.info('Hugging Face: Token not configured, skipping');
        return null;
    }

    const model = process.env.HUGGING_FACE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0';

    try {
        logger.info(`Attempting Hugging Face generation with model: ${model}`);

        // Dynamic import for ESM package
        const { HfInference } = await import('@huggingface/inference');
        const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

        const blob = await hf.textToImage({
            model: model,
            inputs: prompt
        });

        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        logger.info('Hugging Face generation successful');
        return {
            imageBuffer: buffer,
            imageSource: 'huggingface',
            isFallback: false
        };

    } catch (error) {
        logger.warn(`Hugging Face failed: ${error.message}`);
        return null;
    }
};

/**
 * Provider 2: Nano Banana Pro (Gemini 3 Pro Image Preview)
 */
const tryNanaBanana = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) {
        logger.info('Nano Banana (Gemini): API key not configured, skipping');
        return null;
    }

    try {
        logger.info('Attempting Nano Banana (Gemini 3 Pro) generation');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

        logger.info(`Generating image with prompt: "${prompt.substring(0, 50)}..."`);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // The image data comes back as a base64 string in 'inlineData' inside parts
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error('No candidates returned from Gemini');
        }

        const parts = candidates[0].content.parts;
        let imageBuffer = null;

        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                const base64Data = part.inlineData.data;
                imageBuffer = Buffer.from(base64Data, "base64");
                break; // Found the image
            }
        }

        if (!imageBuffer) {
            throw new Error('No inline image data found in Gemini response');
        }

        logger.info('Nano Banana (Gemini) generation successful');
        return {
            imageBuffer,
            imageSource: 'nanabana', // Keeping identifier for compatibility with frontend/logic
            isFallback: false
        };

    } catch (error) {
        logger.warn(`Nano Banana (Gemini) failed: ${error.message}`);
        // Log full error details for debugging if needed
        if (error.response) {
            logger.warn(`GEMINI Error details: ${JSON.stringify(error.response)}`);
        }
        return null;
    }
};

/**
 * Provider 3: Google Gemini Image Model (Backup)
 */
const tryGemini = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) {
        logger.info('Gemini: API key not configured, skipping');
        return null;
    }

    try {
        logger.info('Attempting Gemini Image generation (Backup Provider)');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the same model as Nano Banana for consistency and reliability
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

        logger.info(`Gemini Backup: Generating image for prompt: "${prompt.substring(0, 50)}..."`);

        const result = await model.generateContent(prompt);
        const response = await result.response;

        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error('No candidates returned from Gemini Backup');
        }

        const parts = candidates[0].content.parts;
        let imageBuffer = null;

        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                const base64Data = part.inlineData.data;
                imageBuffer = Buffer.from(base64Data, "base64");
                break;
            }
        }

        if (!imageBuffer) {
            throw new Error('No inline image data found in Gemini Backup response');
        }

        logger.info('Gemini Backup generation successful');
        return {
            imageBuffer,
            imageSource: 'gemini',
            isFallback: false
        };

    } catch (error) {
        logger.warn(`Gemini Backup failed: ${error.message}`);
        if (error.response) {
            logger.warn(`GEMINI Backup Error details: ${JSON.stringify(error.response)}`);
        }
        return null;
    }
};

/**
 * Main function: Cascading fallback image generation
 * Tries providers in order, returns first successful result
 */
const generateImage = async (enhancedPrompt) => {
    logger.info(`🎨 Starting image generation cascade for prompt: "${enhancedPrompt.substring(0, 50)}..."`);

    // Try each provider in order
    const providers = [
        { name: 'Hugging Face', fn: tryHuggingFace },
        { name: 'Nano Banana', fn: tryNanaBanana },
        { name: 'Gemini', fn: tryGemini }
    ];

    for (const provider of providers) {
        const result = await provider.fn(enhancedPrompt);
        if (result) {
            return result;
        }
    }

    // All providers failed, use fallback
    logger.warn('All AI providers unavailable. Using fallback image.');
    const fallbackBuffer = await getFallbackImage();

    return {
        imageBuffer: fallbackBuffer,
        imageSource: 'fallback',
        isFallback: true
    };
};

module.exports = {
    generateImage,
    getFallbackImage
};
