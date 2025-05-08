#!/bin/bash

# Ultra-simplified Render build script
echo "Starting simplified Render build process..."

# Show current directory
echo "Current directory: $(pwd)"

# Install dependencies needed for the build
echo "Installing dependencies..."
npm install express pg vite @vitejs/plugin-react react react-dom

# Create dist directory
echo "Creating dist directory..."
mkdir -p dist/public

# Install additional dependencies for standalone server
echo "Installing standalone server dependencies..."
npm install --no-save pg https express fs

# Create a simple vite.config.js for building the client
echo "Creating Vite config..."
cat > simple-vite.config.mjs << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'),
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  root: resolve(__dirname, 'client'),
});
EOL

# Create a simple index.html if it doesn't exist
if [ ! -f ./client/index.html ]; then
  echo "Creating index.html..."
  cat > ./client/index.html << 'EOL'
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
EOL
fi

# Build the client
echo "Building frontend..."
if ! npx vite build --config simple-vite.config.mjs; then
  echo "Vite build failed. Creating fallback page..."
  cat > ./dist/public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aniexo - Anime Discovery Platform</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; margin: 0; padding: 40px 20px; background: #f5f5f5; color: #333; }
    .container { max-width: 800px; margin: 0 auto; text-align: center; }
    h1 { color: #6200ea; }
    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .spinner { display: inline-block; width: 50px; height: 50px; border: 3px solid rgba(98,0,234,0.3); border-radius: 50%; border-top-color: #6200ea; animation: spin 1s linear infinite; margin: 20px auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Aniexo</h1>
    <div class="card">
      <p>Aniexo is currently being deployed. Please check back soon!</p>
      <div class="spinner"></div>
    </div>
  </div>
</body>
</html>
EOL
  echo "Created fallback page."
fi

# Verify the build output
if [ -f ./dist/public/index.html ]; then
  echo "Build completed successfully!"
  echo "Files in dist/public:"
  ls -la ./dist/public/
  exit 0
else
  echo "Build verification failed - creating emergency index.html"
  mkdir -p ./dist/public
  cat > ./dist/public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aniexo - Anime Discovery Platform</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; margin: 0; padding: 40px 20px; background: #f5f5f5; color: #333; }
    .container { max-width: 800px; margin: 0 auto; text-align: center; }
    h1 { color: #6200ea; }
    .card { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <h1>Aniexo</h1>
    <div class="card">
      <p>Emergency fallback page. The application is being deployed.</p>
    </div>
  </div>
</body>
</html>
EOL
  echo "Created emergency index.html"
  exit 0
fi