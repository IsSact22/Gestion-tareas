const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', require('./src/routes/health'));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error' 
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route Not Found' 
  });
});

module.exports = app;