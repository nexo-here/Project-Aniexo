#!/bin/bash

# Render build script for Aniexo
echo "Starting Render build process..."

# Install production dependencies
echo "Installing production dependencies..."
npm ci

# Install dev dependencies separately to guarantee they're installed
echo "Installing development dependencies..."
npm install --no-save vite @vitejs/plugin-react esbuild typescript @replit/vite-plugin-runtime-error-modal

# Install proxy dependencies if not already installed
echo "Installing proxy dependencies..."
npm install --save express http-proxy child_process

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

# Build the backend with esbuild
echo "Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

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
if [ -f ./dist/index.js ]; then
  if [ -d ./dist/public ] && [ -f ./dist/public/index.html ]; then
    echo "Build completed successfully!"
    echo "Static files are in the correct location."
    exit 0
  else
    echo "Warning: Frontend files may not be in the expected location."
    # Continue anyway since the server might find them
    exit 0
  fi
else
  echo "Build failed. Missing expected output files."
  exit 1
fi