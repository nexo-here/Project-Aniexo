#!/bin/bash

# Render build script for Aniexo
echo "Starting Render build process..."

# Install production dependencies
echo "Installing production dependencies..."
npm ci

# Install express for our production server
echo "Installing express for production server..."
npm install --save express

# Install dev dependencies needed for building the frontend
echo "Installing development dependencies for frontend build..."
npm install --no-save vite @vitejs/plugin-react typescript

# Create a simplified vite config for production
echo "Creating simplified production Vite config..."
cat > vite.production.config.js << EOL
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
});
EOL

# Build the frontend with Vite using the simplified config
echo "Building frontend with Vite..."
npx vite build --config vite.production.config.js

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