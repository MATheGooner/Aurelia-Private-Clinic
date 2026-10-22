# Security boundaries for future application phases

The database schema records authorship, role snapshots, patient-release state and immutable history, but it does not enforce application permissions by itself. Authentication and authorisation must be added before any protected route or mutation is exposed.

- **PATIENT:** only their own operational data and clinical information explicitly marked patient-visible/released.
- **ADMIN:** operational demographics, appointment history, schedules, assignments and check-in state. No clinical notes, alerts, results, documents or prescriptions.
- **CLINICIAN:** clinical access appropriate to their care relationship and explicit permission. Clinical mutations must preserve author attribution and revision history.
- **SUPER_ADMIN:** broad visibility for oversight, but clinical notes, results and prescriptions are strictly read-only. A Super Admin must never be recorded as a clinical author or prescriber.

Critical clinical and audit records use restrictive foreign keys. Disabling an account or practitioner should use status/active fields; it must not delete medical history. Clinical-note changes create revisions rather than silently replacing historical content.

## Authentication and enforcement

Authentication uses a random opaque cookie backed by `auth_sessions`. Only a SHA-256 verifier is stored in PostgreSQL; the raw token exists only in an `HttpOnly`, `SameSite=Lax` cookie and expires server-side. Password credentials are separate from the user profile and use salted scrypt (`N=131072`, `r=8`, `p=1`). Five failed attempts temporarily lock password verification for 15 minutes. Login errors intentionally do not disclose whether an email, password, status or lock is responsible.

Every protected request resolves the current `users.role` and account/profile state from PostgreSQL. Roles are capability sets, never an ordinal hierarchy. In particular, `SUPER_ADMIN` has clinical read capability but not clinical or prescription write capability.

Repository boundaries are part of the security model:

- Operational patient and appointment repositories use explicit projections and never join clinical tables.
- ADMIN is rejected before a clinical repository opens a database query.
- Patient clinical methods require the authenticated patient profile ID to match and filter for release/visibility state.
- Clinical writes derive practitioner authorship from the authenticated session. Callers cannot supply or override an author practitioner ID.

Route guards improve navigation and user experience, but repository and server-action checks remain mandatory because Server Actions are directly invokable endpoints.

## Credential provisioning

There is no public registration flow. After migrations and user provisioning, set a credential out of band by placing the password temporarily in the process-only `AURELIA_PASSWORD` environment variable and running `npm run auth:set-password -- user@example.com`. Remove the environment variable immediately afterwards; it is intentionally absent from `.env.example` and must not be committed.
