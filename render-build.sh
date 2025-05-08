#!/bin/bash

# Render build script for Aniexo
echo "Starting Render build process..."

# Install dev dependencies - needed for build tools
echo "Installing dependencies with dev packages included..."
npm ci --include=dev

# Build the frontend
echo "Building frontend with Vite..."
npx vite build 

# Build the backend
echo "Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Verify the build output
if [ -f ./dist/index.js ] && [ -d ./dist/assets ]; then
  echo "Build completed successfully!"
  exit 0
else
  echo "Build failed. Missing expected output files."
  exit 1
fi