# Aurelia deployment

1. Copy `.env.example` into the deployment environment and configure `DATABASE_URL` and session settings.
2. Apply migrations with `npm run db:migrate`.
3. Optionally load fictional demonstration data with `npm run db:seed` in a demo environment only.
4. Provision account passwords with `npm run auth:set-password -- <email>` while supplying `AURELIA_PASSWORD` through the environment.
5. Run `npm run build`.
6. Start with `npm run start` or deploy the equivalent production build.

Never commit `.env.local` or credentials. Use TLS, restricted database credentials, encrypted backups, monitoring, and an appropriate secrets manager in deployment.

> This is a portfolio implementation. It requires professional privacy, clinical-safety, security, legal, and regulatory review before any use with real patients or health information.
