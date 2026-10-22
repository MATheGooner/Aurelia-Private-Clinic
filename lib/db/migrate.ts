import '../env/load-script-env';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { closeDatabaseConnection, getDatabase } from './client';

async function main() {
  await migrate(getDatabase(), { migrationsFolder: './drizzle' });
  await closeDatabaseConnection();
}

main().catch(async (error) => {
  console.error('Migration failed.', error);
  await closeDatabaseConnection();
  process.exitCode = 1;
});
