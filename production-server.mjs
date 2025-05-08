/**
 * This is a dedicated production server for deploying Aniexo on Render.
 * It's designed to be as simple and reliable as possible.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Read package.json to get the version number
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonData);

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

// Determine static files path
let staticPath = path.join(__dirname, 'dist/public');

// Check if the directory exists, if not, try alternate locations
if (!fs.existsSync(staticPath) || !fs.existsSync(path.join(staticPath, 'index.html'))) {
  console.log('Primary static path not found, checking alternatives...');
  
  const alternativePaths = [
    path.join(__dirname, 'client', 'dist'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'public'),
    path.join(__dirname, 'build')
  ];
  
  for (const altPath of alternativePaths) {
    if (fs.existsSync(altPath) && fs.existsSync(path.join(altPath, 'index.html'))) {
      staticPath = altPath;
      console.log(`Found static files at: ${staticPath}`);
      break;
    }
  }
}

// Log the static path being used
console.log(`Serving static files from: ${staticPath}`);

// Create the directory if it doesn't exist
if (!fs.existsSync(staticPath)) {
  console.log('Static directory not found, creating it...');
  fs.mkdirSync(staticPath, { recursive: true });
  
  // Create a simple index.html as fallback
  fs.writeFileSync(path.join(staticPath, 'index.html'), `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Aniexo</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Aniexo - Anime Discovery Platform</h1>
        <p>The application is currently being deployed. Please check back soon.</p>
      </body>
    </html>
  `);
}

// Serve static files
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