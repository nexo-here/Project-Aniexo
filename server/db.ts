import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL || "dummy";
if (dbUrl === "dummy") {
  console.warn("DATABASE_URL not set. Using dummy data for now. Some features requiring database will not work.");
}

let pool: Pool;
let db: ReturnType<typeof drizzle>;

try {
  pool = new Pool({ connectionString: dbUrl });
  db = drizzle(pool, { schema });
} catch (error) {
  console.error("Failed to initialize database connection:", error);
  // Create dummy implementations for database
  const dummyPool = {} as Pool;
  db = {
    query: async () => [],
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    delete: () => ({ where: () => ({ returning: () => [] }) })
  } as any;
  pool = dummyPool;
}

export { pool, db };

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