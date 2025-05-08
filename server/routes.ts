import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import * as jikanApi from "./api/jikan";
import NodeCache from "node-cache";

// Create a simple cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for Anime Data
  app.get("/api/anime/trending", async (req, res) => {
    try {
      const cacheKey = "trending";
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getTrendingAnime();
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error fetching trending anime:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch trending anime"
      });
    }
  });

  app.get("/api/anime/upcoming", async (req, res) => {
    try {
      const cacheKey = "upcoming";
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getUpcomingAnime();
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error fetching upcoming anime:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch upcoming anime"
      });
    }
  });

  app.get("/api/anime/underrated", async (req, res) => {
    try {
      const cacheKey = "underrated";
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getUnderratedAnime();
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error fetching underrated anime:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch underrated anime"
      });
    }
  });

  app.get("/api/anime/featured", async (req, res) => {
    try {
      const cacheKey = "featured";
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getFeaturedAnime();
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error fetching featured anime:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch featured anime"
      });
    }
  });

  app.get("/api/anime/news", async (req, res) => {
    try {
      const cacheKey = "news";
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getAnimeNews();
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error fetching anime news:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch anime news"
      });
    }
  });

  app.get("/api/anime/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "Invalid anime ID"
        });
      }

      const cacheKey = `anime_${id}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getAnimeById(id);
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error(`Error fetching anime with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        error: `Failed to fetch anime with ID ${req.params.id}`
      });
    }
  });

  app.get("/api/anime/search", async (req, res) => {
    try {
      const { q, genre } = req.query;
      
      if (!q && !genre) {
        return res.status(400).json({
          success: false,
          error: "Missing search query or genre"
        });
      }

      const cacheKey = `search_${q || ''}_${genre || ''}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.searchAnime(q as string | undefined, genre as string | undefined);
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error searching anime:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search anime"
      });
    }
  });

  app.get("/api/genres", async (req, res) => {
    try {
      const cacheKey = "genres";
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({
          success: true,
          data: cachedData
        });
      }
      
      const data = await jikanApi.getGenres();
      cache.set(cacheKey, data);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch genres"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
