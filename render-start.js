#!/usr/bin/env node

/**
 * This is a specialized entry point for the Render deployment
 * It ensures the application runs correctly in Render's environment
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.js');

// Check if build exists
if (!fs.existsSync(indexPath)) {
  console.error('Error: Build files not found. Make sure to run "npm run build" first.');
  process.exit(1);
}

// Set environment variables if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Import and run the server
try {
  console.log(`Starting server in ${process.env.NODE_ENV} mode...`);
  
  // Dynamic import of the compiled server
  import(indexPath)
    .catch(err => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Error starting server:', error);
  process.exit(1);
}