CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "appointments" ADD COLUMN "ends_at" timestamptz;
UPDATE "appointments"
SET "ends_at" = "starts_at" + ("duration_minutes" * interval '1 minute');
ALTER TABLE "appointments" ALTER COLUMN "ends_at" SET NOT NULL;

ALTER TABLE "appointments" ADD CONSTRAINT "appointments_practitioner_no_overlap"
EXCLUDE USING gist (
  "practitioner_id" WITH =,
  tstzrange("starts_at", "ends_at", '[)') WITH &&
)
WHERE ("status" IN ('REQUESTED', 'CONFIRMED', 'ARRIVED', 'IN_CONSULTATION'));
