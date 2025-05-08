import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Helper to handle common database errors
export const handleDbError = (error: unknown, operation: string) => {
  console.error(`Database error during ${operation}:`, error);
  
  if (error instanceof Error) {
    // Handle specific errors based on their message or type
    if (error.message.includes('duplicate key')) {
      return {
        success: false,
        error: 'This record already exists'
      };
    }
    
    if (error.message.includes('violates foreign key constraint')) {
      return {
        success: false,
        error: 'Referenced record does not exist'
      };
    }
  }
  
  // Default error response
  return {
    success: false,
    error: `Failed to ${operation}`
  };
};