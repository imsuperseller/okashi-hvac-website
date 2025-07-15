const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import MCP server modules
const weatherMCP = require('./mcp-servers/weather-mcp');
const reviewsMCP = require('./mcp-servers/reviews-mcp');
const validationMCP = require('./mcp-servers/validation-mcp');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Logging middleware with branded messages
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - DFW HVAC request`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});



// API Routes

// Weather endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const city = req.query.city || 'Dallas';
        const weatherData = await weatherMCP.getWeather(city);
        
        res.json({
            success: true,
            data: weatherData,
            message: 'Weather data retrieved successfully for DFW area'
        });
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weather data. Please try again.',
            error: error.message
        });
    }
});

// Reviews endpoint
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await reviewsMCP.getReviews();
        
        res.json({
            success: true,
            data: reviews,
            message: 'DFW customer reviews loaded successfully'
        });
    } catch (error) {
        console.error('Reviews API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load reviews. Using fallback testimonials.',
            error: error.message
        });
    }
});

// Validation endpoint
app.post('/api/validate', async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number is required for validation'
            });
        }
        
        const validationResult = await validationMCP.validateContact(email, phone);
        
        res.json({
            success: true,
            data: validationResult,
            message: 'Contact validation completed'
        });
    } catch (error) {
        console.error('Validation API error:', error);
        res.status(500).json({
            success: false,
            message: 'Validation service temporarily unavailable. Proceeding with submission.',
            error: error.message
        });
    }
});

// Workiz lead submission endpoint
app.post('/api/submit-lead', async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            service,
            location,
            message,
            emergency
        } = req.body;
        
        // Validate required fields
        if (!name || !phone || !email || !service || !location) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, phone, email, service, and location are required'
            });
        }
        
        // Submit to Workiz API
        const workizResult = await submitToWorkiz({
            name,
            phone,
            email,
            service,
            location,
            message,
            emergency
        });
        
        if (workizResult.success) {
            res.json({
                success: true,
                message: 'Lead submitted successfully to Workiz. Raanan will contact you soon!',
                data: workizResult.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: workizResult.message || 'Failed to submit lead to Workiz'
            });
        }
    } catch (error) {
        console.error('Workiz submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit lead. Please try again or call us directly.',
            error: error.message
        });
    }
});

// Analytics endpoint (for future use)
app.get('/api/analytics', async (req, res) => {
    try {
        // Placeholder for Google Analytics integration
        res.json({
            success: true,
            message: 'Analytics endpoint ready for DFW HVAC tracking',
            data: {
                pageViews: 0,
                leads: 0,
                conversions: 0
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Analytics service unavailable',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Okashi HVAC Services API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found. Please check the URL and try again.'
    });
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.error('Error stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Workiz integration function
async function submitToWorkiz(leadData) {
    try {
        const workizToken = process.env.WORKIZ_API_TOKEN || 'YOUR_WORKIZ_API_TOKEN'; // REPLACE_WITH_ACTUAL
        
        if (workizToken === 'YOUR_WORKIZ_API_TOKEN') {
            // Simulate successful submission for development
            console.log('Workiz submission (simulated):', leadData);
            return {
                success: true,
                data: {
                    leadId: 'sim_' + Date.now(),
                    status: 'created'
                }
            };
        }
        
        // Real Workiz API call
        const response = await fetch('https://api.workiz.com/v1/leads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${workizToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: leadData.name,
                phone: leadData.phone,
                email: leadData.email,
                service_type: leadData.service,
                location: leadData.location,
                description: leadData.message,
                priority: leadData.emergency ? 'high' : 'normal',
                source: 'website'
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            return {
                success: true,
                data: result
            };
        } else {
            return {
                success: false,
                message: result.message || 'Failed to create lead in Workiz'
            };
        }
    } catch (error) {
        console.error('Workiz API error:', error);
        return {
            success: false,
            message: 'Workiz service temporarily unavailable'
        };
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Okashi HVAC Services server running on port ${PORT}`);
    console.log(`🌡️  MCP server ready for DFW HVAC data`);
    console.log(`📍 Serving: Dallas, Fort Worth, Plano, Arlington, Irving`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 