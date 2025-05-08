/**
 * This is a dedicated production server for deploying Aniexo on Render.
 * It's designed to be as simple and reliable as possible.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

// Read package.json to get the version number
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Get the port from the environment variable
const PORT = process.env.PORT || 10000;

// Set up logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// Serve static files
const staticPath = path.join(__dirname, 'dist/public');
app.use(express.static(staticPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: packageJson.version,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// Route to genres for render health check
app.get('/api/genres', (req, res) => {
  const genres = [
    {"id":1,"name":"Action"},
    {"id":2,"name":"Adventure"},
    {"id":3,"name":"Comedy"},
    {"id":4,"name":"Drama"},
    {"id":5,"name":"Fantasy"},
    {"id":6,"name":"Romance"},
    {"id":7,"name":"Sci-Fi"},
    {"id":8,"name":"Slice of Life"},
    {"id":9,"name":"Sports"},
    {"id":10,"name":"Supernatural"}
  ];
  
  res.json({ success: true, data: genres });
});

// Wildcard route to serve React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ 
      success: false, 
      error: "API endpoint not found",
      note: "This is a simplified production server. Some API endpoints may not be available." 
    });
  } else {
    res.sendFile(path.join(staticPath, 'index.html'));
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aniexo production server running on port ${PORT}`);
  console.log(`Static files served from: ${staticPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});