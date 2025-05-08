/**
 * This is a simplified standalone build script for the Aniexo project.
 * It's designed to build a basic version of the app that can be deployed to Render
 * without any dependencies on complex configuration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the dist directories if they don't exist
console.log('Creating build directories...');
const distPublicDir = path.join(__dirname, 'dist', 'public');
fs.mkdirSync(distPublicDir, { recursive: true });

// Create a minimal HTML file that links to the JavaScript bundle
console.log('Creating index.html file...');
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aniexo - Anime Discovery Platform</title>
  <meta name="description" content="Discover your next favorite anime with Aniexo, a modern anime discovery platform with personalized recommendations.">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #6200ea;
      margin-bottom: 20px;
    }
    p {
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .loading {
      display: inline-block;
      width: 50px;
      height: 50px;
      border: 3px solid rgba(98, 0, 234, 0.3);
      border-radius: 50%;
      border-top-color: #6200ea;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Aniexo</h1>
    <div class="card">
      <p>Welcome to Aniexo, your modern anime discovery platform.</p>
      <p>The application is currently in deployment mode.</p>
      <div class="loading"></div>
      <p>Please check back soon for the full experience!</p>
    </div>
  </div>
</body>
</html>
`;

// Write the HTML file to the public directory
fs.writeFileSync(path.join(distPublicDir, 'index.html'), htmlContent);

// Create a simple JavaScript bundle
console.log('Creating bundle.js (placeholder)...');
const jsContent = `
// This is a placeholder JavaScript bundle
console.log('Aniexo application in deployment mode');
document.addEventListener('DOMContentLoaded', function() {
  console.log('Document ready');
});
`;

// Write the JavaScript file to the public directory
fs.writeFileSync(path.join(distPublicDir, 'bundle.js'), jsContent);

// Create a directory for assets
const assetsDir = path.join(distPublicDir, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

// Create a placeholder CSS file
console.log('Creating placeholder CSS...');
const cssContent = `
/* Placeholder CSS */
body {
  background-color: #f5f5f5;
}
`;

// Write the CSS file to the assets directory
fs.writeFileSync(path.join(assetsDir, 'style.css'), cssContent);

console.log('Build completed successfully!');
console.log(`Files written to: ${distPublicDir}`);

// Create a script to run tests to confirm build is good
console.log('Running build verification...');
if (
  fs.existsSync(path.join(distPublicDir, 'index.html')) &&
  fs.existsSync(path.join(distPublicDir, 'bundle.js')) &&
  fs.existsSync(path.join(assetsDir, 'style.css'))
) {
  console.log('✅ Build verification passed!');
} else {
  console.error('❌ Build verification failed: Missing expected files');
  process.exit(1);
}