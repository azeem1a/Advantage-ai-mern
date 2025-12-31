const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

/**
 * Soft validation for environment variables
 * - Required keys: MONGO_URI (critical for DB connection)
 * - Optional keys: All AI provider keys (graceful fallback if missing)
 * - No crashes on missing optional keys
 */
const validateEnv = () => {
    const required = ['MONGO_URI'];
    const optional = [
        'PORT',
        'HUGGING_FACE_TOKEN',
        'OPENAI_API_KEY',

        'GEMINI_API_KEY'
    ];

    const missing = [];
    const missingOptional = [];

    // Check required variables
    required.forEach((key) => {
        if (!process.env[key]) {
            missing.push(key);
        }
    });

    // Check optional variables
    optional.forEach((key) => {
        if (!process.env[key]) {
            missingOptional.push(key);
        }
    });

    // Log results
    if (missing.length > 0) {
        logger.warn(`Missing REQUIRED environment variables: ${missing.join(', ')}`);
        logger.warn('The application may not function correctly.');
    }

    if (missingOptional.length > 0) {
        logger.info(`Missing optional AI provider keys: ${missingOptional.join(', ')}`);
        logger.info('The system will use fallback mode for missing providers.');
    }

    if (missing.length === 0 && missingOptional.length === 0) {
        logger.info('✅ All environment variables validated successfully.');
    } else if (missing.length === 0) {
        logger.info('✅ Required environment variables validated. Using fallback for missing providers.');
    }
};

module.exports = { validateEnv };
