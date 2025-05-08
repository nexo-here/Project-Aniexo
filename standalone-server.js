/**
 * Standalone server for Aniexo deployment on Render
 * This file is completely self-contained and doesn't require any build step
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { Pool } = require('pg');

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/public')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
});

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Setup database if DATABASE_URL exists
let pool;
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log('Database connection configured');
  } catch (error) {
    console.error('Error configuring database:', error.message);
  }
}

// Jikan API helper
async function fetchFromJikan(endpoint) {
  const cacheKey = `jikan:${endpoint}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  
  // Not in cache or expired, fetch fresh data
  try {
    console.log(`Fetching from Jikan API: ${endpoint}`);
    const url = `https://api.jikan.moe/v4/${endpoint}`;
    
    return await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            // Store in cache
            cache.set(cacheKey, {
              data: result,
              timestamp: Date.now()
            });
            resolve(result);
          } catch (error) {
            reject(new Error(`Error parsing Jikan API response: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Error fetching from Jikan API: ${error.message}`));
      });
    });
  } catch (error) {
    console.error(`Jikan API error: ${error.message}`);
    throw error;
  }
}

// API helper function
function apiResponse(res, data, error = null) {
  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    });
  }
  
  return res.json({
    success: true,
    data
  });
}

// Data transformation helpers
function transformAnimeData(animeData) {
  if (!animeData) return null;
  
  return {
    id: animeData.mal_id,
    title: animeData.title,
    image: animeData.images?.jpg?.image_url || '',
    score: animeData.score,
    genres: animeData.genres?.map(g => g.name) || [],
    season: animeData.season,
    year: animeData.year,
    type: animeData.type,
    studios: animeData.studios?.map(s => s.name) || [],
    episodes: animeData.episodes
  };
}

function transformNewsData(newsData) {
  if (!newsData) return null;
  
  return {
    id: newsData.mal_id,
    title: newsData.title,
    excerpt: newsData.excerpt,
    date: newsData.date,
    image: newsData.images?.jpg?.image_url || '',
    url: newsData.url
  };
}

// API Routes
app.get('/api/anime/trending', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime?status=airing&order_by=popularity&sort=asc&limit=20');
    const trendingAnime = result.data.map(transformAnimeData);
    apiResponse(res, trendingAnime);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/anime/upcoming', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime?status=upcoming&order_by=popularity&sort=asc&limit=10');
    const upcomingAnime = result.data.map(transformAnimeData);
    apiResponse(res, upcomingAnime);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/anime/underrated', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime?status=complete&min_score=7.5&order_by=score&sort=desc&limit=20');
    const underratedAnime = result.data.map(transformAnimeData);
    apiResponse(res, underratedAnime);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/anime/featured', async (req, res) => {
  try {
    // Get a random anime ID from a curated list
    const featuredIds = [1535, 5114, 38000, 1, 30276, 11061, 9253, 28851, 36456, 37991];
    const randomId = featuredIds[Math.floor(Math.random() * featuredIds.length)];
    
    const result = await fetchFromJikan(`anime/${randomId}/full`);
    const featuredAnime = transformAnimeData(result.data);
    apiResponse(res, featuredAnime);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/anime/search', async (req, res) => {
  try {
    const { q, genre } = req.query;
    let endpoint = 'anime?';
    if (q) endpoint += `q=${encodeURIComponent(q)}&`;
    if (genre) endpoint += `genres=${encodeURIComponent(genre)}&`;
    endpoint += 'limit=24';
    
    const result = await fetchFromJikan(endpoint);
    const animeResults = result.data.map(transformAnimeData);
    apiResponse(res, animeResults);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFromJikan(`anime/${id}/full`);
    const animeDetails = transformAnimeData(result.data);
    apiResponse(res, animeDetails);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/anime/news', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime/1/news');
    const news = result.data.map(transformNewsData);
    apiResponse(res, news);
  } catch (error) {
    apiResponse(res, null, error);
  }
});

app.get('/api/genres', async (req, res) => {
  try {
    const result = await fetchFromJikan('genres/anime');
    const genres = result.data.map(g => ({ id: g.mal_id, name: g.name }));
    apiResponse(res, genres);
  } catch (error) {
    // Fallback for the health check
    apiResponse(res, [
      {id: 1, name: "Action"},
      {id: 2, name: "Adventure"},
      {id: 3, name: "Comedy"},
      {id: 4, name: "Drama"},
      {id: 5, name: "Fantasy"}
    ]);
  }
});

// Authentication routes (simplified - no actual auth)
app.get('/api/auth/me', (req, res) => {
  res.status(401).json({
    success: false,
    error: "Authentication required"
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  // If it's an API route that doesn't exist
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  }
  
  // Otherwise serve the SPA's index.html
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Aniexo standalone server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});