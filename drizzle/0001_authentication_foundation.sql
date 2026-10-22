CREATE UNIQUE INDEX "users_email_lower_unique" ON "users" (lower("email"));

CREATE TABLE "auth_credentials" (
  "user_id" uuid PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
  "password_hash" text NOT NULL,
  "failed_attempts" integer NOT NULL DEFAULT 0,
  "locked_until" timestamptz,
  "password_changed_at" timestamptz NOT NULL DEFAULT now(),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "auth_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" varchar(64) NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "last_seen_at" timestamptz NOT NULL DEFAULT now(),
  "revoked_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "auth_sessions_token_hash_unique" ON "auth_sessions" ("token_hash");
CREATE INDEX "auth_sessions_user_active_idx" ON "auth_sessions" ("user_id", "expires_at", "revoked_at");
