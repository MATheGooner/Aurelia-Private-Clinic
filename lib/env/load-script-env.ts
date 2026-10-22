import path from 'node:path';
import dotenv from 'dotenv';

// Standalone Node/tsx entry points do not receive Next.js environment loading.
// Existing shell/deployment variables remain authoritative because override is false.
dotenv.config({
  path: path.resolve(process.cwd(), '.env.local'),
  override: false,
  quiet: true,
});
