const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth.js'); // Assuming your routes are in a file called auth.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment variables (for debugging)
console.log('Environment Variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', PORT);

// Middleware
console.log('Setting up middleware...');
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes
console.log('Setting up routes...');
app.use('/api', authRoutes); // Use your routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Log when the server is about to start
console.log('Starting the server...');