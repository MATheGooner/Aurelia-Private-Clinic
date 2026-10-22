import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let pool: Pool | undefined;
let database: NodePgDatabase<typeof schema> | undefined;

export function getDatabase(): NodePgDatabase<typeof schema> {
  if (database) return database;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required.');
  pool = new Pool({ connectionString });
  database = drizzle(pool, { schema });
  return database;
}

export async function closeDatabaseConnection(): Promise<void> {
  const current = pool;
  pool = undefined;
  database = undefined;
  if (current) await current.end();
}
