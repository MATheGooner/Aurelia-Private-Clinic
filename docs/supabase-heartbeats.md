# Supabase database heartbeats

Aurelia's `scripts/db-heartbeat.mjs` reads at most one `id` from
`public.departments` in an explicit read-only transaction. It reuses the existing
production `pg` dependency and does not load `.env.local`. Empty results count as
success. Connection, query, statement, lock, and idle transaction timeouts are
configured; the connection is closed in `finally`. Logs contain no rows,
connection strings, certificates, or raw driver errors.

Each project's independent workflow runs at **06:17, 13:17, and 20:17 UTC** daily
(`17 6,13,20 * * *`) and supports manual runs. These correspond to **07:17, 14:17,
and 21:17 Africa/Lagos**. GitHub schedules run from the default branch and may be
delayed or dropped under load. Heartbeats are not a contractual guarantee against
Supabase pausing. Public repositories' scheduled workflows may be disabled after
60 days without repository activity; monitor Actions and re-enable them if needed.

## Dedicated database roles

Run each block only in its own project's Supabase SQL editor as a database
administrator. This is one-time manual setup, outside the application migrations.
Replace each password placeholder with a different securely generated password in
the SQL editor; never put the resulting commands or passwords in source control.
Do not reset the application's database password or change its credentials.

Aurelia:

```sql
CREATE ROLE aurelia_heartbeat
  LOGIN PASSWORD '<unique-random-Aurelia-heartbeat-password>'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS
  CONNECTION LIMIT 1;
GRANT CONNECT ON DATABASE postgres TO aurelia_heartbeat;
GRANT USAGE ON SCHEMA public TO aurelia_heartbeat;
GRANT SELECT (id) ON TABLE public.departments TO aurelia_heartbeat;
ALTER ROLE aurelia_heartbeat SET default_transaction_read_only = on;
```

Northfield, in its separate Supabase project:

```sql
CREATE ROLE northfield_heartbeat
  LOGIN PASSWORD '<unique-random-Northfield-heartbeat-password>'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS
  CONNECTION LIMIT 1;
GRANT CONNECT ON DATABASE postgres TO northfield_heartbeat;
GRANT USAGE ON SCHEMA public TO northfield_heartbeat;
GRANT SELECT (id) ON TABLE public.quote_requests TO northfield_heartbeat;
ALTER ROLE northfield_heartbeat SET default_transaction_read_only = on;
```

These are column-level SELECT grants, with no application-role membership or
write grants. Existing `PUBLIC` privileges still apply to any PostgreSQL login;
review those privileges when assessing the role's effective access. Leave existing
application privileges and RLS policies intact. A query filtered to zero rows by
RLS is successful; no bypass role or broader policy is needed for the heartbeat.

## Repository secrets and TLS

Add secrets in each GitHub repository under **Settings → Secrets and variables →
Actions → New repository secret**:

| Repository | Required secret | Optional certificate secret |
| --- | --- | --- |
| `MATheGooner/Aurelia-Private-Clinic` | `DATABASE_URL` | `AURELIA_DATABASE_CA_CERT` |
| Northfield's own repository | `DATABASE_URL` | `NORTHFIELD_DATABASE_CA_CERT` |

The same `DATABASE_URL` name is intentional: each repository has its own secret
value and each project has its own environment. Leave the existing application
variable in `.env.local` intact; the workflow receives its heartbeat role's URL
directly from its repository secret.

Each URL is a PostgreSQL connection URI for that project's dedicated role,
database, and password. Use the connection host and port from that project's
Supabase **Connect** panel. For standard GitHub-hosted runners, prefer the IPv4
compatible **Supavisor session pooler** on port `5432` if the direct endpoint is
IPv6-only. With that pooler, the username is typically
`aurelia_heartbeat.<PROJECT_REF>` or `northfield_heartbeat.<PROJECT_REF>`;
with a direct connection, use the role name without the project suffix.
Percent-encode the URI password's reserved characters. Use database `postgres`
unless the project's actual database name differs (adjust `GRANT CONNECT` too).
Use database role passwords, never Supabase anon or service-role API keys.

TLS verifies the certificate chain and server hostname. If the chosen endpoint's
certificate is not trusted by Node's default CA store, download the appropriate
CA certificate from that project's Supabase dashboard and put its actual PEM
contents, including line breaks, in the optional certificate secret. An endpoint
with a trusted public chain needs only the URL secret. Certificate trust failures
must be fixed with the correct CA, not by disabling verification.

The scripts intentionally discard all URI query parameters and fragments so URL
options cannot override TLS or timeouts. Host, port, database, username, and
password must be in the URI's standard components; supply a custom CA via the
certificate secret rather than `sslrootcert`. No secret is echoed, written to a
file, or supplied to dependency installation. `.env.local` is not needed.

## Manual testing and activation

1. Complete the role and secret setup in each project's own database/repository.
2. Review and commit/push each project's files when ready. No commit or push is
   performed by this implementation. Put the workflow on the default branch for
   scheduled runs and make sure GitHub Actions is enabled.
3. In each repository, open **Actions → Supabase database heartbeat → Run
   workflow**, select the default branch, and run it.
4. Confirm the database step logs `Aurelia database heartbeat succeeded.` or
   `Northfield database heartbeat succeeded.` and the job is green. A missing URL
   reports its exact secret name. Other failures identify the failing stage
   without revealing driver details; check the secret, endpoint reachability,
   role grants, and certificate trust privately.
5. Confirm later scheduled runs appear in Actions. Re-enable an inactive schedule
   if GitHub disables it, and update secrets when role passwords or CA certificates
   change. A paused database must be restored in Supabase before a heartbeat can
   connect; these scripts do not restore projects.

## Exact Northfield implementation for its own workspace

No Northfield repository or database is changed from the Aurelia workspace.
When Codex is opened in Northfield, inspect its instructions, project structure,
`package.json`, lockfile, `.gitignore`, and workflows first. Reuse its production
`pg` dependency if present; if absent, add it there with `npm install pg` and
include its updated package/lock files. The workflow below assumes an npm
`package-lock.json`, as Aurelia uses. If Northfield uses another package manager,
keep that manager's frozen-lockfile installation and cache configuration rather
than introducing npm alongside it. Do not run migrations or seeds, change
application credentials, load `.env.local`, or commit/push automatically.

Create **`scripts/db-heartbeat.mjs`** in Northfield:

```js
import pg from 'pg';

const { Client } = pg;

function reportFailure(stage) {
  // Driver errors can contain credentials or connection details; never log them.
  console.error(`Northfield database heartbeat failed during ${stage}. Check the database URL secret, network access, role permissions, and TLS certificate trust.`);
  process.exitCode = 1;
}

async function heartbeat() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    console.error('DATABASE_URL is required for the Northfield database heartbeat.');
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
      application_name: 'northfield-db-heartbeat',
      ssl: {
        rejectUnauthorized: true,
        ...(process.env.NORTHFIELD_DATABASE_CA_CERT
          ? { ca: process.env.NORTHFIELD_DATABASE_CA_CERT }
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
    stage = 'read-only quote_requests query';
    await client.query('SELECT id FROM public.quote_requests LIMIT 1');
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
    console.log('Northfield database heartbeat succeeded.');
  }
}

await heartbeat();
```

Create **`.github/workflows/supabase-heartbeat.yml`** in Northfield:

```yaml
name: Supabase database heartbeat

on:
  schedule:
    # 06:17, 13:17, and 20:17 UTC every day.
    - cron: '17 6,13,20 * * *'
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: northfield-supabase-heartbeat
  cancel-in-progress: false

jobs:
  heartbeat:
    name: Northfield read-only heartbeat
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm

      - name: Install locked production dependencies
        run: npm ci --omit=dev --ignore-scripts --no-audit --no-fund

      - name: Query Northfield database
        run: node scripts/db-heartbeat.mjs
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NORTHFIELD_DATABASE_CA_CERT: ${{ secrets.NORTHFIELD_DATABASE_CA_CERT }}
```

In Northfield, run `node --check scripts/db-heartbeat.mjs`, review the YAML and
matching Northfield secret names, and run `git diff --check` before committing.
Use the manual workflow procedure above to test the actual database connection.
