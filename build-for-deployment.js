#!/usr/bin/env node

/**
 * Custom build script for deploying the Aniexo application
 * This script will build the frontend with the correct base path and prepare the server
 * for production deployment without modifying the existing configuration files.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('\n🚀 Starting Aniexo Production Build Process 🚀\n');

// Step 1: Build the frontend with the custom config
console.log('📦 Building the frontend with relative paths...');
try {
  // First, make sure our deployment config uses the correct base path
  const viteDeployConfig = path.join(__dirname, 'vite.deployment.config.js');
  
  // Now build using the deployment config
  execSync(`npx vite build --config ${viteDeployConfig}`, { stdio: 'inherit' });
  console.log('✅ Frontend build completed successfully!\n');
} catch (err) {
  console.error('❌ Frontend build failed:', err);
  process.exit(1);
}

// Step 2: Build the server
console.log('📦 Building the server...');
try {
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });
  console.log('✅ Server build completed successfully!\n');
} catch (err) {
  console.error('❌ Server build failed:', err);
  process.exit(1);
}

// Step 3: Check if the build files exist
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(distDir, 'public');
const indexJsPath = path.join(distDir, 'index.js');

if (!fs.existsSync(publicDir) || !fs.existsSync(indexJsPath)) {
  console.error('❌ Expected build files not found. Make sure the build process completed correctly.');
  process.exit(1);
}

// Step 4: Provide deployment instructions
console.log('🎉 Build successful! Your project is now ready for deployment.\n');
console.log('📝 Deployment Instructions:');
console.log('1. To start the application in production mode, run:');
console.log('   NODE_ENV=production node dist/index.js');
console.log('2. The application will be available at:');
console.log('   http://localhost:5000');
console.log('\n3. For deployment on platforms like Heroku, Vercel, or Repl.it:');
console.log('   - Ensure the start command is set to "NODE_ENV=production node dist/index.js"');
console.log('   - Make sure to set the NODE_ENV environment variable to "production"');
console.log('\n4. For database connections:');
console.log('   - Ensure your DATABASE_URL environment variable is properly set in production');
console.log('\n🛠 Happy coding! 🛠\n');