const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const { getCTAForTone } = require('./copyGenerator.service');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const LOGO_PATH = path.join(__dirname, '../../assets/logo.png');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Platform-specific dimensions
 */
const platformDimensions = {
    Instagram: { width: 1080, height: 1080 }, // Square 1:1
    LinkedIn: { width: 1200, height: 627 },   // Horizontal 1.91:1
    Facebook: { width: 1200, height: 1200 },  // Square 1:1
    Twitter: { width: 1200, height: 675 }     // Landscape 16:9
};

/**
 * Memory-safe image processing limits
 */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB limit

/**
 * Compose final ad creative with branding
 * - Logo overlay (bottom-right, 15% width, 80% opacity)
 * - CTA button with tone-based text
 * - Platform-specific dimensions
 */
const composeImage = async (imageBuffer, tone, platform) => {
    try {
        // Check image buffer size
        if (imageBuffer && imageBuffer.length > MAX_IMAGE_SIZE) {
            logger.warn(`Image buffer exceeds size limit: ${imageBuffer.length} bytes. Processing with compression.`);
        }

        let baseImage;

        if (imageBuffer) {
            baseImage = sharp(imageBuffer);
        } else {
            // Create a gradient placeholder if no image
            const dims = platformDimensions[platform] || platformDimensions.Instagram;
            baseImage = sharp({
                create: {
                    width: dims.width,
                    height: dims.height,
                    channels: 4,
                    background: { r: 200, g: 200, b: 200, alpha: 1 }
                }
            });
        }

        // Get platform dimensions
        const dims = platformDimensions[platform] || platformDimensions.Instagram;
        const { width, height } = dims;

        // Get tone-based CTA text
        const ctaText = getCTAForTone(tone);

        // Prepare composite layers
        const compositeInputs = [];

        // Layer 1: CTA Button (bottom-left)
        const ctaButtonSVG = `
            <svg width="${width}" height="${height}">
                <defs>
                    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.95" />
                        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.95" />
                    </linearGradient>
                </defs>
                <rect x="40" y="${height - 120}" width="${Math.min(300, width * 0.3)}" height="70" 
                      rx="35" fill="url(#btnGrad)" />
                <text x="${Math.min(190, width * 0.15 + 40)}" y="${height - 75}" 
                      font-family="Arial, sans-serif" font-size="28" font-weight="bold"
                      fill="white" text-anchor="middle">
                    ${ctaText}
                </text>
            </svg>
        `;
        compositeInputs.push({ input: Buffer.from(ctaButtonSVG), top: 0, left: 0 });

        // Layer 2: Logo overlay (bottom-right, if exists)
        if (fs.existsSync(LOGO_PATH)) {
            try {
                const logoWidth = Math.floor(width * 0.15); // 15% of image width
                const logoBuffer = await sharp(LOGO_PATH)
                    .resize(logoWidth, null, { fit: 'inside' })
                    .composite([{
                        input: Buffer.from(`
                            <svg width="${logoWidth}" height="${logoWidth}">
                                <rect width="${logoWidth}" height="${logoWidth}" fill="white" opacity="0.2"/>
                            </svg>
                        `),
                        blend: 'dest-in'
                    }])
                    .png()
                    .toBuffer();

                const logoMetadata = await sharp(logoBuffer).metadata();
                const logoHeight = logoMetadata.height || logoWidth;

                compositeInputs.push({
                    input: logoBuffer,
                    top: height - logoHeight - 30,
                    left: width - logoWidth - 30,
                    blend: 'over'
                });

                logger.info('Logo overlay added');
            } catch (logoError) {
                logger.warn(`Logo overlay failed: ${logoError.message}. Continuing without logo.`);
            }
        } else {
            logger.info('Logo file not found. Composing without logo overlay.');
        }

        // Process image with all layers
        const processedBuffer = await baseImage
            .resize(width, height, { fit: 'cover', position: 'center' })
            .composite(compositeInputs)
            .png({ quality: 90, compressionLevel: 6 })
            .toBuffer();

        // Save to disk
        const filename = `ad_${Date.now()}_${platform.toLowerCase()}.png`;
        const filepath = path.join(UPLOADS_DIR, filename);

        await sharp(processedBuffer).toFile(filepath);

        logger.info(`Image composed successfully for ${platform} with ${tone} tone`);

        // Return relative URL
        return `/uploads/${filename}`;

    } catch (error) {
        logger.error(`Image composition failed: ${error.message}`);
        // If composition completely fails, return null
        return null;
    }
};

module.exports = { composeImage };
