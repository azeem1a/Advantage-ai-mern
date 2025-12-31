const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const adRoutes = require('./routes/adRoutes');
app.use('/api/ads', adRoutes);

app.get('/', (req, res) => {
    res.send('AdVantage Gen API is running...');
});

app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Centralized error handling - must be last
app.use(errorHandler);

module.exports = app;
