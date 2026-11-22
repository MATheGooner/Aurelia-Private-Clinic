import pg from 'pg';

const { Client } = pg;

function reportFailure(stage) {
  // Driver errors can contain credentials or connection details; never log them.
  console.error(`Aurelia database heartbeat failed during ${stage}. Check the database URL secret, network access, role permissions, and TLS certificate trust.`);
  process.exitCode = 1;
}

async function heartbeat() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    console.error('DATABASE_URL is required for the Aurelia database heartbeat.');
    process.exitCode = 1;
    return;
  }

  let client;
  let stage = 'configuration';

  try {
    const databaseUrl = new URL(connectionString);
    if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)
      || !databaseUrl.hostname || !databaseUrl.username || databaseUrl.pathname.length <= 1) {
      throw new Error('Invalid PostgreSQL connection URL.');
    }

    // URL options must not override TLS verification or the fixed timeouts.
    databaseUrl.search = '';
    databaseUrl.hash = '';

    client = new Client({
      connectionString: databaseUrl.toString(),
      application_name: 'aurelia-db-heartbeat',
      ssl: {
        rejectUnauthorized: true,
        ...(process.env.AURELIA_DATABASE_CA_CERT
          ? { ca: process.env.AURELIA_DATABASE_CA_CERT }
          : {}),
      },
      connectionTimeoutMillis: 10_000,
      query_timeout: 10_000,
      statement_timeout: 8_000,
      lock_timeout: 3_000,
      idle_in_transaction_session_timeout: 15_000,
    });
    client.on('error', () => reportFailure('connection'));

    stage = 'connection';
    await client.connect();
    stage = 'read-only transaction setup';
    await client.query('BEGIN READ ONLY');
    stage = 'read-only departments query';
    await client.query('SELECT id FROM public.departments LIMIT 1');
    stage = 'read-only transaction completion';
    await client.query('COMMIT');
  } catch {
    reportFailure(stage);
  } finally {
    if (client) {
      try {
        // Disconnecting also rolls back an unfinished read-only transaction.
        await client.end();
      } catch {
        reportFailure('connection cleanup');
      }
    }
  }

  if (process.exitCode !== 1) {
    console.log('Aurelia database heartbeat succeeded.');
  }
}

await heartbeat();
