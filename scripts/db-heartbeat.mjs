import pg from 'pg';

const { Client } = pg;

function redactErrorMessage(message, sensitiveValues) {
  const secrets = new Set();
  for (const value of sensitiveValues ?? []) {
    if (typeof value !== 'string' || !value) continue;
    const variants = new Set([value]);
    try {
      variants.add(decodeURIComponent(value));
      variants.add(decodeURI(value));
    } catch {
      // Malformed percent escapes must not prevent redacting the raw value.
    }
    for (const variant of variants) {
      if (!variant) continue;
      secrets.add(variant);
      secrets.add(JSON.stringify(variant).slice(1, -1));
      secrets.add(variant.replace(/\\/g, '\\\\').replace(/'/g, "\\'"));
      try {
        secrets.add(encodeURIComponent(variant));
      } catch {
        // Invalid Unicode must not prevent redacting raw or escaped values.
      }
    }
  }
  const ignoreCase = (letter) => `[${letter.toLowerCase()}${letter.toUpperCase()}]`;
  const escapeSecret = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/^postgres(?:ql)?:/i, (scheme) => scheme.replace(/[a-z]/gi, ignoreCase))
    .replace(/%[0-9a-f]{2}/gi, (escape) =>
      escape.replace(/[a-f]/gi, ignoreCase));
  const sortedSecrets = [...secrets].sort((a, b) => b.length - a.length);
  const fullUrls = sortedSecrets.filter((value) => /^postgres(?:ql)?(?::\/\/|%3a%2f%2f)/i.test(value));
  const literalPattern = sortedSecrets.map(escapeSecret).join('|');
  // Known decoded or escaped values can contain spaces inside a URL token.
  const urlTail = `(?:${[literalPattern, /[^\s]/.source].filter(Boolean).join('|')})*`;

  // Match full known values first so URL redaction cannot leave credential fragments.
  const redactions = [
    fullUrls.map((value) => `${escapeSecret(value)}${urlTail}`).join('|'),
    `${/[pP][oO][sS][tT][gG][rR][eE][sS](?:[qQ][lL])?(?::\/\/|%3[aA]%2[fF]%2[fF])/.source}${urlTail}`,
    /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/.source,
    literalPattern,
  ].filter(Boolean).join('|');
  const diagnostic = typeof message === 'string' && message.trim()
    ? message : 'No error message available.';
  return diagnostic.replace(new RegExp(redactions, 'g'), '[REDACTED]');
}

function reportFailure(stage, error, sensitiveValues, credentialValues = sensitiveValues) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,64}$/.test(error.code)
    ? error.code : 'unknown';
  const message = typeof error?.message === 'string' ? error.message : 'No error message available.';
  const redactions = new Set(sensitiveValues);
  for (const value of [error?.address, error?.hostname, error?.host, error?.port]) {
    if (typeof value === 'string' || typeof value === 'number') {
      redactions.add(String(value));
    }
  }
  // Only log the code and redacted message, never the full driver error.
  console.error(`Aurelia database heartbeat failed during ${stage} (code: ${redactErrorMessage(code, credentialValues)}): ${redactErrorMessage(message, redactions)}`);
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
  const credentialValues = new Set([
    connectionString,
    connectionString.trim(),
    process.env.PGPASSWORD,
    process.env.AURELIA_DATABASE_CA_CERT,
  ]);
  const sensitiveValues = new Set(credentialValues);
  const reportedErrors = new WeakSet();
  const report = (failureStage, error) => {
    if (error !== null && (typeof error === 'object' || typeof error === 'function')) {
      if (reportedErrors.has(error)) return;
      reportedErrors.add(error);
    }
    reportFailure(failureStage, error, sensitiveValues, credentialValues);
  };

  try {
    const databaseUrl = new URL(connectionString);
    sensitiveValues.add(databaseUrl.toString());
    for (const value of [databaseUrl.username, databaseUrl.password]) {
      credentialValues.add(value);
    }
    for (const value of [
      databaseUrl.username,
      databaseUrl.password,
      databaseUrl.host,
      databaseUrl.hostname,
      databaseUrl.hostname.replace(/^\[|\]$/g, ''),
      databaseUrl.port,
      databaseUrl.pathname,
      databaseUrl.pathname.slice(1),
    ]) {
      sensitiveValues.add(value);
    }
    if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)
      || !databaseUrl.hostname || !databaseUrl.username || databaseUrl.pathname.length <= 1) {
      throw new Error('Invalid PostgreSQL connection URL.');
    }

    // URL options must not override TLS verification or the fixed timeouts.
    databaseUrl.search = '';
    databaseUrl.hash = '';
    sensitiveValues.add(databaseUrl.toString());

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
    const port = client.connectionParameters?.port;
    if (typeof port === 'string' || typeof port === 'number') {
      sensitiveValues.add(String(port));
    }
    client.on('error', (error) => report('connection', error));

    stage = 'connection';
    await client.connect();
    stage = 'read-only transaction setup';
    await client.query('BEGIN READ ONLY');
    stage = 'read-only departments query';
    await client.query('SELECT id FROM public.departments LIMIT 1');
    stage = 'read-only transaction completion';
    await client.query('COMMIT');
  } catch (error) {
    report(stage, error);
  } finally {
    if (client) {
      try {
        // Disconnecting also rolls back an unfinished read-only transaction.
        await client.end();
      } catch (error) {
        report('connection cleanup', error);
      }
    }
  }

  if (process.exitCode !== 1) {
    console.log('Aurelia database heartbeat succeeded.');
  }
}

await heartbeat();
