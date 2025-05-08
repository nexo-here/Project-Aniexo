/**
 * Build script for the React app using the Vite API instead of the CLI
 * This helps avoid ESM issues during the build process
 */

const { build } = require('vite');
const { resolve } = require('path');
const react = require('@vitejs/plugin-react');
const fs = require('fs');

async function buildReactApp() {
  console.log('Starting React app build...');
  
  try {
    // Make sure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public');
    }
    
    // Build with Vite API
    await build({
      root: './client',
      plugins: [react()],
      build: {
        outDir: resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
        minify: true,
        sourcemap: false,
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom']
            }
          }
        }
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, 'client/src'),
          '@shared': resolve(__dirname, 'shared')
        }
      }
    });
    
    console.log('React app build completed successfully!');
    return true;
  } catch (error) {
    console.error('React app build failed:', error);
    return false;
  }
}

// Execute the build
buildReactApp().then(success => {
  if (!success) {
    console.log('Creating fallback landing page...');
    // Create a simple fallback page if build fails
    // (This part is handled by the render-build.sh script)
  }
});