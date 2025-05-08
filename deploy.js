#!/usr/bin/env node

/**
 * This is a simple deployment script to help prepare the Aniexo project for production.
 * It provides instructions and guidance for building and deploying the application.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function log(message) {
  console.log(`[Deploy] ${message}`);
}

function checkPrerequisites() {
  log('Checking prerequisites...');
  
  // Check if the build script exists
  const buildScriptPath = path.join(__dirname, 'build-for-deployment.js');
  if (!fs.existsSync(buildScriptPath)) {
    log('ERROR: build-for-deployment.js script is missing');
    return false;
  }

  // Check if render.yaml exists
  const renderYamlPath = path.join(__dirname, 'render.yaml');
  if (!fs.existsSync(renderYamlPath)) {
    log('ERROR: render.yaml configuration file is missing');
    return false;
  }

  log('All prerequisites are met!');
  return true;
}

function printDeploymentInstructions() {
  log('\n=====================================================');
  log('DEPLOYMENT INSTRUCTIONS FOR ANIEXO');
  log('=====================================================');
  log('\n1. Build the application for production:');
  log('   $ node build-for-deployment.js');
  log('\n2. Deploy to Render:');
  log('   - Push your code to a Git repository (GitHub, GitLab, etc.)');
  log('   - Log in to your Render account: https://dashboard.render.com/');
  log('   - Click "New+" and select "Blueprint"');
  log('   - Connect your Git repository');
  log('   - Render will detect the render.yaml file and set up your services');
  log('\n3. Environment Variables to Set in Render:');
  log('   - NODE_ENV: production');
  log('   - DATABASE_URL: (Will be automatically set if using Render\'s database)');
  log('\n4. Important Notes:');
  log('   - The application will be built using the scripts in package.json');
  log('   - The database will be automatically provisioned if using Render\'s database');
  log('   - The application will be served on port 8080 or the PORT environment variable');
  log('\n=====================================================');
  log('For more information, visit: https://render.com/docs/deploy-node-express-app');
  log('=====================================================\n');
}

async function main() {
  log('Starting Aniexo deployment guide...');

  // Check prerequisites
  if (!checkPrerequisites()) {
    process.exit(1);
  }

  // Print deployment instructions
  printDeploymentInstructions();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});