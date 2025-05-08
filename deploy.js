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

console.log('\n🚀 Starting Aniexo Deployment Process 🚀\n');

// Step 1: Build the project
console.log('📦 Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}

// Step 2: Check if the build files exist
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(distDir, 'public');
const indexJsPath = path.join(distDir, 'index.js');

if (!fs.existsSync(publicDir) || !fs.existsSync(indexJsPath)) {
  console.error('❌ Expected build files not found. Make sure the build process completed correctly.');
  process.exit(1);
}

// Step 3: Provide deployment instructions
console.log('🎉 Build successful! Your project is now ready for deployment.\n');
console.log('📝 Deployment Instructions:');
console.log('1. To start the application in production mode, run:');
console.log('   npm start');
console.log('2. The application will be available at:');
console.log('   http://localhost:5000');
console.log('\n3. For deployment on platforms like Heroku, Vercel, or Repl.it:');
console.log('   - Ensure the start script is set to "npm start" in your platform config');
console.log('   - Make sure to set the NODE_ENV environment variable to "production"');
console.log('\n4. For database connections:');
console.log('   - Ensure your DATABASE_URL environment variable is properly set in production');
console.log('\n🛠 Happy coding! 🛠\n');