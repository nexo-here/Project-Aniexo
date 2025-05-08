/**
 * Super simple CommonJS server for Aniexo on Render
 * Using .cjs extension to guarantee CommonJS mode
 */

const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// API response helper
function sendApiResponse(res, data, error = null) {
  if (error) {
    return res.status(500).json({
      success: false,
      error: typeof error === 'string' ? error : error.message
    });
  }
  return res.json({
    success: true,
    data
  });
}

// Genres endpoint for health check
app.get('/api/genres', (req, res) => {
  sendApiResponse(res, [
    {"id":1,"name":"Action"},
    {"id":2,"name":"Adventure"},
    {"id":3,"name":"Comedy"},
    {"id":4,"name":"Drama"},
    {"id":5,"name":"Fantasy"},
    {"id":6,"name":"Romance"},
    {"id":7,"name":"Sci-Fi"}
  ]);
});

// Serve index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Aniexo server running on port ${PORT}`);
});