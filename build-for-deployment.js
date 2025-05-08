#!/usr/bin/env node

/**
 * Custom build script for deploying the Aniexo application
 * This script will build the frontend with the correct base path and prepare the server
 * for production deployment without modifying the existing configuration files.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDebug = process.argv.includes('--debug');

function log(message) {
  console.log(`[Build] ${message}`);
}

function executeCommand(command, options = {}) {
  log(`Executing: ${command}`);
  try {
    execSync(command, {
      stdio: isDebug ? 'inherit' : 'pipe',
      ...options
    });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

async function main() {
  log('Starting Aniexo deployment build...');

  // Ensure we're in production mode
  process.env.NODE_ENV = 'production';

  // Step 1: Build the frontend
  log('Building frontend...');
  if (!executeCommand('vite build --config vite.config.ts')) {
    process.exit(1);
  }

  // Step 2: Build the backend
  log('Building backend...');
  if (!executeCommand('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist')) {
    process.exit(1);
  }

  // Step 3: Verify the build output
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(path.join(distPath, 'index.js'))) {
    console.error('Error: Server build output is missing. Build failed.');
    process.exit(1);
  }

  if (!fs.existsSync(path.join(distPath, 'assets'))) {
    console.error('Error: Frontend build output is missing. Build failed.');
    process.exit(1);
  }

  log('Build completed successfully! The application is ready for deployment.');
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});