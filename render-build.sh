#!/bin/bash

# Render build script for Aniexo
echo "Starting Render build process..."

# Show current directory
echo "Current directory: $(pwd)"
ls -la

# Create dist directory structure
mkdir -p dist/public

# Install production dependencies
echo "Installing production dependencies..."
npm ci

# Install express and fs-extra for our production server
echo "Installing express for production server..."
npm install --save express fs-extra

# Install dev dependencies needed for building the frontend
echo "Installing development dependencies for frontend build..."
npm install --no-save vite @vitejs/plugin-react typescript @tailwindcss/vite postcss-import

# Create a simplified build script that doesn't depend on vite config
echo "Creating simplified build script..."
cat > build-frontend.js << EOL
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Ensure dist directory exists
fs.ensureDirSync('dist/public');

// Create a simplified index.html to be used as template
const indexContent = \`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aniexo - Anime Discovery Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
\`;

// Write the index.html to client directory
fs.writeFileSync('client/index.html', indexContent);

try {
  // Build using plain vanilla Vite command
  console.log('Building frontend...');
  execSync('npx vite build client --outDir ../dist/public', { stdio: 'inherit' });
  console.log('Frontend built successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Verify build
if (fs.existsSync('dist/public/index.html')) {
  console.log('Build verified successfully!');
} else {
  console.error('Build verification failed - index.html not found');
  process.exit(1);
}
EOL

# Execute the build script
echo "Executing build script..."
node build-frontend.js || {
  echo "Advanced build failed, falling back to simple build..."
  node simple-build.js
}

# Create appropriate directory structure for the server
echo "Setting up correct directory structure..."
mkdir -p ./dist/public

# If the frontend build is in dist/client, move the assets to dist/public
if [ -d ./dist/client ] && [ -f ./dist/client/index.html ]; then
  echo "Moving frontend build to proper location..."
  cp -r ./dist/client/* ./dist/public/
fi

# Copy port patch file to root directory
echo "Copying port patch file..."
cp port-patch.js ./port-patch.js

# Verify the build output
if [ -d ./dist/public ] && [ -f ./dist/public/index.html ]; then
  echo "Build completed successfully!"
  echo "Static files are in the correct location."
  exit 0
else
  echo "Warning: Frontend files may not be in the expected location."
  
  # Check alternate locations
  if [ -d ./dist/client ] && [ -f ./dist/client/index.html ]; then
    echo "Found frontend files in alternate location. Copying..."
    mkdir -p ./dist/public
    cp -r ./dist/client/* ./dist/public/
    echo "Files copied. Build successful."
    exit 0
  else
    echo "Build failed. Could not find built frontend files."
    exit 1
  fi
fi