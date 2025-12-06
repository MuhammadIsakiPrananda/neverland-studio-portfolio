// routes/health.js - Health check endpoint for production monitoring
import express from 'express';
import sequelize from '../config/database.js';

const router = express.Router();

/**
 * @desc    Health check endpoint
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        // Check database connection
        await sequelize.authenticate();

        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now(),
            environment: process.env.NODE_ENV,
            database: 'connected'
        };

        res.status(200).json(healthcheck);
    } catch (error) {
        const healthcheck = {
            uptime: process.uptime(),
            message: 'ERROR',
            timestamp: Date.now(),
            environment: process.env.NODE_ENV,
            database: 'disconnected',
            error: error.message
        };

        res.status(503).json(healthcheck);
    }
});

export default router;
