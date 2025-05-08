import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import * as jikanApi from "./api/jikan";
import NodeCache from "node-cache";
import { insertFavoriteSchema, insertHistorySchema, insertCommentSchema } from "@shared/schema";
import { handleDbError } from "./db";

// Create a simple cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Authentication middleware - To be expanded with actual auth logic
const requireAuth = (req: Request, res: Response, next: Function) => {
  // Temporary mock user for development - in a real app this would check session/JWT
  // For now we'll mock this by adding a user_id query param
  const userId = parseInt(req.query.user_id as string);
  
  if (!userId || isNaN(userId)) {
    return res.status(401).json({
      success: false,
      error: "Authentication required"
    });
  }
  
  // Add user ID to request for use in route handlers
  (req as any).userId = userId;
  next();
};

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
      
      // If a user ID is provided, add this to their watch history
      const userId = parseInt(req.query.user_id as string);
      if (userId && !isNaN(userId)) {
        try {
          await storage.addToHistory({
            user_id: userId,
            anime_id: id,
            anime_title: data.title,
          });
        } catch (err) {
          // Just log the error, don't fail the request
          console.error("Error adding to watch history:", err);
        }
      }
      
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

  // ===== User Favorites Routes =====
  app.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      
      const favorites = await storage.getFavorites(userId);
      
      return res.json({
        success: true,
        data: favorites
      });
    } catch (error) {
      console.error("Error getting favorites:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get favorites"
      });
    }
  });
  
  app.post("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      
      // Validate request
      const validationResult = insertFavoriteSchema.safeParse({
        ...req.body,
        user_id: userId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid favorite data",
          details: validationResult.error.format()
        });
      }
      
      // Check if this anime is already in favorites
      const existingFavorite = await storage.getFavorite(userId, validationResult.data.anime_id);
      if (existingFavorite) {
        return res.status(409).json({
          success: false,
          error: "Anime is already in favorites"
        });
      }
      
      // Add to favorites
      const favorite = await storage.addFavorite(validationResult.data);
      
      return res.status(201).json({
        success: true,
        data: favorite
      });
    } catch (error) {
      const response = handleDbError(error, "add to favorites");
      return res.status(500).json(response);
    }
  });
  
  app.delete("/api/favorites/:animeId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const animeId = parseInt(req.params.animeId);
      
      if (isNaN(animeId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid anime ID"
        });
      }
      
      const success = await storage.removeFavorite(userId, animeId);
      
      return res.json({
        success: true,
        data: { removed: success }
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to remove favorite"
      });
    }
  });
  
  // ===== Watch History Routes =====
  app.get("/api/history", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const history = await storage.getHistory(userId, limit);
      
      return res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error("Error getting watch history:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get watch history"
      });
    }
  });
  
  app.post("/api/history", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      
      // Validate request
      const validationResult = insertHistorySchema.safeParse({
        ...req.body,
        user_id: userId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid history data",
          details: validationResult.error.format()
        });
      }
      
      // Add to history
      const historyItem = await storage.addToHistory(validationResult.data);
      
      return res.status(201).json({
        success: true,
        data: historyItem
      });
    } catch (error) {
      const response = handleDbError(error, "add to history");
      return res.status(500).json(response);
    }
  });
  
  app.delete("/api/history", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      
      const success = await storage.clearHistory(userId);
      
      return res.json({
        success: true,
        data: { cleared: success }
      });
    } catch (error) {
      console.error("Error clearing history:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to clear history"
      });
    }
  });
  
  // ===== Comments Routes =====
  app.get("/api/anime/:animeId/comments", async (req, res) => {
    try {
      const animeId = parseInt(req.params.animeId);
      
      if (isNaN(animeId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid anime ID"
        });
      }
      
      const comments = await storage.getComments(animeId);
      
      return res.json({
        success: true,
        data: comments
      });
    } catch (error) {
      console.error("Error getting comments:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to get comments"
      });
    }
  });
  
  app.post("/api/anime/:animeId/comments", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const animeId = parseInt(req.params.animeId);
      
      if (isNaN(animeId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid anime ID"
        });
      }
      
      // Validate request
      const validationResult = insertCommentSchema.safeParse({
        ...req.body,
        user_id: userId,
        anime_id: animeId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid comment data",
          details: validationResult.error.format()
        });
      }
      
      // Add comment
      const comment = await storage.addComment(validationResult.data);
      
      return res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      const response = handleDbError(error, "add comment");
      return res.status(500).json(response);
    }
  });
  
  app.put("/api/comments/:commentId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const commentId = parseInt(req.params.commentId);
      
      if (isNaN(commentId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid comment ID"
        });
      }
      
      if (!req.body.content || typeof req.body.content !== 'string') {
        return res.status(400).json({
          success: false,
          error: "Comment content is required"
        });
      }
      
      // Update comment
      const comment = await storage.updateComment(commentId, userId, req.body.content);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: "Comment not found or you don't have permission to edit it"
        });
      }
      
      return res.json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to update comment"
      });
    }
  });
  
  app.delete("/api/comments/:commentId", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).userId;
      const commentId = parseInt(req.params.commentId);
      
      if (isNaN(commentId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid comment ID"
        });
      }
      
      // Delete comment
      const success = await storage.deleteComment(commentId, userId);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          error: "Comment not found or you don't have permission to delete it"
        });
      }
      
      return res.json({
        success: true,
        data: { deleted: true }
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to delete comment"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
