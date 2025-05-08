import { 
  users, favorites, watchHistory, comments,
  type User, type InsertUser, 
  type Favorite, type InsertFavorite,
  type History, type InsertHistory,
  type Comment, type InsertComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { handleDbError } from "./db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Favorites methods
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavorite(userId: number, animeId: number): Promise<Favorite | undefined>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, animeId: number): Promise<boolean>;
  
  // Watch history methods
  getHistory(userId: number, limit?: number): Promise<History[]>;
  addToHistory(history: InsertHistory): Promise<History>;
  clearHistory(userId: number): Promise<boolean>;
  
  // Comments methods
  getComments(animeId: number): Promise<Comment[]>;
  getUserComments(userId: number): Promise<Comment[]>;
  addComment(comment: InsertComment): Promise<Comment>;
  updateComment(id: number, userId: number, content: string): Promise<Comment | undefined>;
  deleteComment(id: number, userId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Let the calling function handle the error for proper response
    }
  }
  
  // Favorites methods
  async getFavorites(userId: number): Promise<Favorite[]> {
    try {
      return await db.select()
        .from(favorites)
        .where(eq(favorites.user_id, userId))
        .orderBy(desc(favorites.created_at));
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }
  
  async getFavorite(userId: number, animeId: number): Promise<Favorite | undefined> {
    try {
      const [favorite] = await db.select()
        .from(favorites)
        .where(
          and(
            eq(favorites.user_id, userId),
            eq(favorites.anime_id, animeId)
          )
        );
      return favorite;
    } catch (error) {
      console.error('Error getting favorite:', error);
      return undefined;
    }
  }
  
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    try {
      const [newFavorite] = await db.insert(favorites)
        .values(favorite)
        .returning();
      return newFavorite;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }
  
  async removeFavorite(userId: number, animeId: number): Promise<boolean> {
    try {
      await db.delete(favorites)
        .where(
          and(
            eq(favorites.user_id, userId),
            eq(favorites.anime_id, animeId)
          )
        );
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  }
  
  // Watch history methods
  async getHistory(userId: number, limit = 50): Promise<History[]> {
    try {
      return await db.select()
        .from(watchHistory)
        .where(eq(watchHistory.user_id, userId))
        .orderBy(desc(watchHistory.viewed_at))
        .limit(limit);
    } catch (error) {
      console.error('Error getting watch history:', error);
      return [];
    }
  }
  
  async addToHistory(history: InsertHistory): Promise<History> {
    try {
      // First check if this anime is already in history
      const [existing] = await db.select()
        .from(watchHistory)
        .where(
          and(
            eq(watchHistory.user_id, history.user_id),
            eq(watchHistory.anime_id, history.anime_id)
          )
        );
      
      // If it exists, update the viewed_at timestamp
      if (existing) {
        const [updated] = await db.update(watchHistory)
          .set({ viewed_at: new Date() })
          .where(eq(watchHistory.id, existing.id))
          .returning();
        return updated;
      }
      
      // Otherwise insert a new record
      const [newHistory] = await db.insert(watchHistory)
        .values(history)
        .returning();
      
      return newHistory;
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  }
  
  async clearHistory(userId: number): Promise<boolean> {
    try {
      await db.delete(watchHistory)
        .where(eq(watchHistory.user_id, userId));
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
  
  // Comments methods
  async getComments(animeId: number): Promise<Comment[]> {
    try {
      return await db.select()
        .from(comments)
        .where(eq(comments.anime_id, animeId))
        .orderBy(desc(comments.created_at));
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }
  
  async getUserComments(userId: number): Promise<Comment[]> {
    try {
      return await db.select()
        .from(comments)
        .where(eq(comments.user_id, userId))
        .orderBy(desc(comments.created_at));
    } catch (error) {
      console.error('Error getting user comments:', error);
      return [];
    }
  }
  
  async addComment(comment: InsertComment): Promise<Comment> {
    try {
      const [newComment] = await db.insert(comments)
        .values(comment)
        .returning();
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
  
  async updateComment(id: number, userId: number, content: string): Promise<Comment | undefined> {
    try {
      const [updated] = await db.update(comments)
        .set({ 
          content,
          updated_at: new Date()
        })
        .where(
          and(
            eq(comments.id, id),
            eq(comments.user_id, userId) // Ensure the user owns this comment
          )
        )
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating comment:', error);
      return undefined;
    }
  }
  
  async deleteComment(id: number, userId: number): Promise<boolean> {
    try {
      await db.delete(comments)
        .where(
          and(
            eq(comments.id, id),
            eq(comments.user_id, userId) // Ensure the user owns this comment
          )
        );
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
