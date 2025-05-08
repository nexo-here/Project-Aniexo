/**
 * API Proxy Server for Aniexo on Render
 * This server serves the static frontend and proxies API requests to Jikan
 */

const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 10000;

// In-memory cache
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// Helper function for API responses
function sendApiResponse(res, data, error = null) {
  if (error) {
    return res.status(500).json({
      success: false,
      error: typeof error === 'string' ? error : error.message
    });
  }
  return res.json({
    success: true,
    data
  });
}

// Helper function to fetch from Jikan API
async function fetchFromJikan(endpoint) {
  const cacheKey = `jikan:${endpoint}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  
  return new Promise((resolve, reject) => {
    const url = `https://api.jikan.moe/v4/${endpoint}`;
    console.log(`Fetching from Jikan: ${url}`);
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 429) {
          // Rate limit hit
          console.log('Rate limit hit, retrying in 1 second...');
          setTimeout(() => {
            fetchFromJikan(endpoint).then(resolve).catch(reject);
          }, 1000);
          return;
        }
        
        try {
          const parsedData = JSON.parse(data);
          
          // Cache the response
          cache.set(cacheKey, {
            data: parsedData,
            timestamp: Date.now()
          });
          
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Error parsing response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });
  });
}

// Transform Jikan anime data to our format
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
    episodes: animeData.episodes,
    aired: animeData.aired,
    synopsis: animeData.synopsis,
    status: animeData.status,
    rating: animeData.rating,
    source: animeData.source,
    trailer: animeData.trailer,
    title_english: animeData.title_english,
    title_japanese: animeData.title_japanese,
    airing: animeData.airing,
    duration: animeData.duration,
    relations: animeData.relations
  };
}

// Transform Jikan news data to our format
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
    sendApiResponse(res, trendingAnime);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/anime/upcoming', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime?status=upcoming&order_by=popularity&sort=asc&limit=10');
    const upcomingAnime = result.data.map(transformAnimeData);
    sendApiResponse(res, upcomingAnime);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/anime/underrated', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime?status=complete&min_score=7.5&order_by=score&sort=desc&limit=20');
    const underratedAnime = result.data.map(transformAnimeData);
    sendApiResponse(res, underratedAnime);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/anime/featured', async (req, res) => {
  try {
    // Get a random anime ID from a curated list
    const featuredIds = [1535, 5114, 38000, 1, 30276, 11061, 9253, 28851, 36456, 37991];
    const randomId = featuredIds[Math.floor(Math.random() * featuredIds.length)];
    
    const result = await fetchFromJikan(`anime/${randomId}/full`);
    const featuredAnime = transformAnimeData(result.data);
    sendApiResponse(res, featuredAnime);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fetchFromJikan(`anime/${id}/full`);
    const animeDetails = transformAnimeData(result.data);
    sendApiResponse(res, animeDetails);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/anime/news', async (req, res) => {
  try {
    const result = await fetchFromJikan('anime/1/news');
    const news = result.data.map(transformNewsData);
    sendApiResponse(res, news);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/anime/search', async (req, res) => {
  try {
    const { q, genre } = req.query;
    
    if (!q && !genre) {
      return res.status(400).json({
        success: false,
        error: 'Missing search query or genre'
      });
    }
    
    let endpoint = 'anime?';
    if (q) endpoint += `q=${encodeURIComponent(q)}&`;
    if (genre) endpoint += `genres=${encodeURIComponent(genre)}&`;
    endpoint += 'limit=24';
    
    const result = await fetchFromJikan(endpoint);
    const animeResults = result.data.map(transformAnimeData);
    sendApiResponse(res, animeResults);
  } catch (error) {
    sendApiResponse(res, null, error);
  }
});

app.get('/api/genres', async (req, res) => {
  try {
    const result = await fetchFromJikan('genres/anime');
    const genres = result.data.map(g => ({ id: g.mal_id, name: g.name }));
    sendApiResponse(res, genres);
  } catch (error) {
    // Fallback for health check
    sendApiResponse(res, [
      {id: 1, name: "Action"},
      {id: 2, name: "Adventure"},
      {id: 3, name: "Comedy"},
      {id: 4, name: "Drama"},
      {id: 5, name: "Fantasy"}
    ]);
  }
});

// Authentication route (simplified)
app.get('/api/auth/me', (req, res) => {
  res.status(401).json({
    success: false,
    error: "Authentication required"
  });
});

// Matchmaker endpoint
app.post('/api/matchmaker', (req, res) => {
  sendApiResponse(res, [
    { id: 5114, title: "Fullmetal Alchemist: Brotherhood", image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg", score: 9.11 },
    { id: 38000, title: "Kimetsu no Yaiba", image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg", score: 8.53 },
    { id: 1535, title: "Death Note", image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg", score: 8.62 },
    { id: 30276, title: "One Punch Man", image: "https://cdn.myanimelist.net/images/anime/12/76049.jpg", score: 8.51 }
  ]);
});

// Fallback route for SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found'
    });
  }
  
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`API Proxy Server for Aniexo running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});