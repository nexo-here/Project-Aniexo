import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication and profile data
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  created_at: timestamp("created_at").defaultNow(),
});

// Favorites table to save anime that users like
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  anime_id: integer("anime_id").notNull(),
  anime_title: text("anime_title").notNull(),
  anime_image: text("anime_image").notNull(),
  created_at: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    // Ensure a user can't favorite the same anime twice
    user_anime_unique: uniqueIndex().on(table.user_id, table.anime_id)
  };
});

// Watch history to track anime the user has viewed details for
export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  anime_id: integer("anime_id").notNull(),
  anime_title: text("anime_title").notNull(),
  viewed_at: timestamp("viewed_at").defaultNow(),
});

// Comments for anime
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  anime_id: integer("anime_id").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  user_id: true,
  anime_id: true,
  anime_title: true,
  anime_image: true,
});

export const insertHistorySchema = createInsertSchema(watchHistory).pick({
  user_id: true,
  anime_id: true,
  anime_title: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  user_id: true,
  anime_id: true,
  content: true,
});

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type History = typeof watchHistory.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
