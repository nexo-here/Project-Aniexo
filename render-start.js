#!/usr/bin/env node

/**
 * This is a specialized entry point for the Render deployment
 * It ensures the application runs correctly in Render's environment
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set production environment
process.env.NODE_ENV = 'production';

// Ensure we have PORT set
if (!process.env.PORT) {
  process.env.PORT = '10000';
  console.log('PORT environment variable not set, defaulting to 10000');
}

// Check for build files
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.js');

if (!fs.existsSync(indexPath)) {
  console.error('Error: Server build output is missing. Build failed.');
  process.exit(1);
}

// Start the server
console.log(`Starting Aniexo in production mode on port ${process.env.PORT}...`);
import(indexPath).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});