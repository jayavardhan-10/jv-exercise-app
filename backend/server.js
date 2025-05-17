const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Add immediate logging to check if the file is being executed
console.log('Starting server...');

// Load environment variables
require('dotenv').config();
console.log('Environment variables loaded');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/exerciseApp';
console.log('Attempting to connect to MongoDB...');

// Import routes
const exerciseRoutes = require('./routes/exercises');
const workoutRoutes = require('./routes/workouts');
const workoutHistoryRoutes = require('./routes/workoutHistory');

async function connectDB() {
    try {
        console.log('Initializing MongoDB connection...');
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        console.log("Database connection test successful!");
        return true;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.log('Failed to connect to MongoDB. Please make sure MongoDB is installed and running locally on port 27017.');
        console.log('The server will continue to run, but database functionality will not work.');
        return false;
    }
}

// Middleware to check DB connection before handling requests
const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            error: 'Database connection unavailable', 
            message: 'The database is currently unavailable. Please try again later.' 
        });
    }
    next();
};

// Mount routes
app.use('/api/exercises', checkDbConnection, exerciseRoutes);
app.use('/api/workouts', checkDbConnection, workoutRoutes);
app.use('/api/workout-history', checkDbConnection, workoutHistoryRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend is working!',
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Start server
app.listen(port, async () => {
    console.log(`Server is running on port: ${port}`);
    await connectDB();
}); 