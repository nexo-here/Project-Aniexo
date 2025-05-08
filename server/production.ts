/**
 * This is a specialized production server for Render deployment
 * It combines the API endpoints with serving the static frontend files
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { registerRoutes } from './routes';
import { serveStatic } from './vite';
import { storage } from './storage';
import { Pool } from '@neondatabase/serverless';
import { db } from './db';

// Create Express server
const app = express();
const PORT = process.env.PORT || 10000;

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});

// Serve static files
const staticDir = path.join(process.cwd(), 'public');
if (fs.existsSync(staticDir)) {
  console.log(`Serving static files from: ${staticDir}`);
  app.use(express.static(staticDir));
}

// Register API routes
registerRoutes(app)
  .then(server => {
    // Fallback route for SPA
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
          success: false, 
          error: 'API endpoint not found' 
        });
      }
      // Send the index.html for all non-API routes (SPA routing)
      const indexPath = path.join(staticDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Not found. The application may still be deploying.');
      }
    });

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', err);
      res.status(err.status || 500).json({
        success: false,
        error: err.message || 'An unexpected error occurred',
      });
    });

    // Start server
    const listenPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
    server.listen(listenPort, () => {
      console.log(`Aniexo production server running on port ${listenPort}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });