#!/usr/bin/env node

/**
 * This is a specialized entry point for the Render deployment
 * It ensures the application runs correctly in Render's environment
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set environment variables
process.env.NODE_ENV = 'production';

// Make sure we have a PORT set
if (!process.env.PORT) {
  process.env.PORT = '10000';
  console.log('PORT environment variable not set, defaulting to 10000');
} else {
  console.log(`Using PORT from environment: ${process.env.PORT}`);
}

// Check for build files
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.js');

if (!fs.existsSync(indexPath)) {
  console.error('Error: Server build output is missing at', indexPath);
  process.exit(1);
}

// Apply port patch to make the server listen on the correct port
console.log('Applying port patch before starting server...');
require('./port-patch.js');

// Start the server
console.log(`Starting Aniexo in production mode on port ${process.env.PORT}...`);
import(indexPath).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});