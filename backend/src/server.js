const app = require('./app');
const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// 1. Validate Env
validateEnv();

// 2. Connect DB
connectDB();

const BASE_PORT = parseInt(process.env.PORT, 10) || 5000;
let server;

// Attempt to start server with graceful fallback on port conflicts
const startServer = (port, attempts = 0) => {
    const maxAttempts = 3;
    const chosenPort = port;

    server = app
        .listen(chosenPort, () => {
            logger.info(`Server started on port ${chosenPort}`);
        })
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
                const nextPort = chosenPort + 1;
                logger.warn(`Port ${chosenPort} in use. Retrying on port ${nextPort}...`);
                startServer(nextPort, attempts + 1);
            } else {
                logger.error(`Server start failed: ${err.message}`);
            }
        });
};

startServer(BASE_PORT);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    // Do not close server, keep running
});

// Handle uncaught exceptions to avoid crash
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    // Keep process alive; consider alerting/monitoring in production.
});
