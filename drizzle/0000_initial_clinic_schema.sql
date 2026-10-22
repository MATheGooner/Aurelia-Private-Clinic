CREATE TYPE "user_role" AS ENUM ('PATIENT','ADMIN','CLINICIAN','SUPER_ADMIN');
CREATE TYPE "user_status" AS ENUM ('INVITED','ACTIVE','SUSPENDED','DISABLED');
CREATE TYPE "patient_status" AS ENUM ('ACTIVE','INACTIVE','ARCHIVED','DECEASED');
CREATE TYPE "staff_type" AS ENUM ('ADMIN','CLINICIAN','SUPER_ADMIN');
CREATE TYPE "practitioner_type" AS ENUM ('DOCTOR','DENTIST','DENTAL_HYGIENIST','PHYSIOTHERAPIST');
CREATE TYPE "day_of_week" AS ENUM ('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY');
CREATE TYPE "schedule_exception_type" AS ENUM ('LEAVE','UNAVAILABLE','TRAINING','CLINIC_CLOSURE','MANUAL_BLOCK');
CREATE TYPE "appointment_status" AS ENUM ('REQUESTED','CONFIRMED','ARRIVED','IN_CONSULTATION','COMPLETED','CANCELLED','NO_SHOW');
CREATE TYPE "appointment_patient_type" AS ENUM ('NEW','EXISTING');
CREATE TYPE "encounter_status" AS ENUM ('PLANNED','IN_PROGRESS','COMPLETED','AMENDED','VOID');
CREATE TYPE "clinical_note_type" AS ENUM ('CONSULTATION','ASSESSMENT','PROCEDURE','FOLLOW_UP','ADDENDUM');
CREATE TYPE "patient_alert_type" AS ENUM ('ALLERGY','TREATMENT_WARNING','OTHER');
CREATE TYPE "test_result_status" AS ENUM ('REQUESTED','PENDING','FINAL','CORRECTED','CANCELLED');
CREATE TYPE "prescription_status" AS ENUM ('DRAFT','ISSUED','CANCELLED','EXPIRED');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "email" varchar(320) NOT NULL, "role" user_role NOT NULL, "status" user_status NOT NULL DEFAULT 'INVITED',
  "identity_provider" varchar(80), "identity_provider_subject" varchar(255), "permission_metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "last_login_at" timestamptz, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");
CREATE UNIQUE INDEX "users_identity_subject_unique" ON "users" ("identity_provider","identity_provider_subject");

CREATE TABLE "patient_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "patient_number" varchar(32) NOT NULL, "user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "first_name" varchar(100) NOT NULL, "last_name" varchar(100) NOT NULL, "date_of_birth" date NOT NULL, "email" varchar(320), "phone" varchar(40),
  "address_line_1" varchar(180), "address_line_2" varchar(180), "city" varchar(100), "postcode" varchar(20), "country" varchar(80) DEFAULT 'United Kingdom',
  "emergency_contact_name" varchar(200), "emergency_contact_phone" varchar(40), "status" patient_status NOT NULL DEFAULT 'ACTIVE',
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "patient_profiles_number_unique" ON "patient_profiles" ("patient_number");
CREATE UNIQUE INDEX "patient_profiles_user_unique" ON "patient_profiles" ("user_id");
CREATE INDEX "patient_profiles_email_idx" ON "patient_profiles" ("email");
CREATE INDEX "patient_profiles_phone_idx" ON "patient_profiles" ("phone");
CREATE INDEX "patient_profiles_name_dob_idx" ON "patient_profiles" ("last_name","first_name","date_of_birth");

CREATE TABLE "staff_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "first_name" varchar(100) NOT NULL, "last_name" varchar(100) NOT NULL, "type" staff_type NOT NULL, "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "staff_profiles_user_unique" ON "staff_profiles" ("user_id");
CREATE INDEX "staff_profiles_active_idx" ON "staff_profiles" ("active");

CREATE TABLE "departments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "slug" varchar(100) NOT NULL, "name" varchar(160) NOT NULL, "description" text,
  "active" boolean NOT NULL DEFAULT true, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "departments_slug_unique" ON "departments" ("slug");
CREATE INDEX "departments_active_idx" ON "departments" ("active");

CREATE TABLE "treatments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "slug" varchar(140) NOT NULL, "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT,
  "name" varchar(180) NOT NULL, "category" varchar(120) NOT NULL, "short_description" text, "default_duration_minutes" integer,
  "indicative_price_pence" integer, "price_metadata" jsonb NOT NULL DEFAULT '{}'::jsonb, "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "treatments_slug_unique" ON "treatments" ("slug");
CREATE INDEX "treatments_department_active_idx" ON "treatments" ("department_id","active");

CREATE TABLE "practitioners" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "staff_profile_id" uuid NOT NULL REFERENCES "staff_profiles"("id") ON DELETE RESTRICT,
  "public_slug" varchar(140) NOT NULL, "type" practitioner_type NOT NULL, "default_appointment_duration_minutes" integer NOT NULL DEFAULT 30,
  "active" boolean NOT NULL DEFAULT true, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "practitioners_staff_unique" ON "practitioners" ("staff_profile_id");
CREATE UNIQUE INDEX "practitioners_slug_unique" ON "practitioners" ("public_slug");
CREATE INDEX "practitioners_active_idx" ON "practitioners" ("active");

CREATE TABLE "practitioner_departments" (
  "practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE CASCADE, "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT,
  "primary" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("practitioner_id","department_id")
);
CREATE INDEX "practitioner_departments_department_idx" ON "practitioner_departments" ("department_id");
CREATE TABLE "practitioner_treatments" (
  "practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE CASCADE, "treatment_id" uuid NOT NULL REFERENCES "treatments"("id") ON DELETE RESTRICT,
  "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("practitioner_id","treatment_id")
);
CREATE INDEX "practitioner_treatments_treatment_idx" ON "practitioner_treatments" ("treatment_id");

CREATE TABLE "practitioner_schedule_rules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE CASCADE,
  "day" day_of_week NOT NULL, "start_time" time NOT NULL, "end_time" time NOT NULL, "appointment_duration_minutes" integer NOT NULL,
  "effective_from" date, "effective_to" date, "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "schedule_rules_unique" ON "practitioner_schedule_rules" ("practitioner_id","day","start_time","end_time");
CREATE INDEX "schedule_rules_practitioner_day_idx" ON "practitioner_schedule_rules" ("practitioner_id","day","active");
CREATE TABLE "practitioner_schedule_exceptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE CASCADE,
  "type" schedule_exception_type NOT NULL, "starts_at" timestamptz NOT NULL, "ends_at" timestamptz NOT NULL, "reason" varchar(300),
  "created_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL, "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "schedule_exceptions_practitioner_time_idx" ON "practitioner_schedule_exceptions" ("practitioner_id","starts_at","ends_at");
CREATE INDEX "schedule_exceptions_active_idx" ON "practitioner_schedule_exceptions" ("active");

CREATE TABLE "appointments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "reference_number" varchar(40) NOT NULL, "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT,
  "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT, "treatment_id" uuid REFERENCES "treatments"("id") ON DELETE RESTRICT,
  "practitioner_id" uuid REFERENCES "practitioners"("id") ON DELETE RESTRICT, "starts_at" timestamptz NOT NULL, "duration_minutes" integer NOT NULL,
  "reason" varchar(500), "patient_type" appointment_patient_type NOT NULL, "status" appointment_status NOT NULL DEFAULT 'REQUESTED',
  "created_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL, "cancellation_reason" varchar(500),
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "appointments_reference_unique" ON "appointments" ("reference_number");
CREATE INDEX "appointments_start_idx" ON "appointments" ("starts_at");
CREATE INDEX "appointments_patient_start_idx" ON "appointments" ("patient_id","starts_at");
CREATE INDEX "appointments_practitioner_start_idx" ON "appointments" ("practitioner_id","starts_at");
CREATE INDEX "appointments_status_start_idx" ON "appointments" ("status","starts_at");
CREATE TABLE "appointment_status_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "appointment_id" uuid NOT NULL REFERENCES "appointments"("id") ON DELETE RESTRICT,
  "previous_status" appointment_status, "new_status" appointment_status NOT NULL, "changed_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "reason" varchar(500), "changed_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "appointment_history_state_time_unique" ON "appointment_status_history" ("appointment_id","new_status","changed_at");
CREATE INDEX "appointment_history_appointment_time_idx" ON "appointment_status_history" ("appointment_id","changed_at");
CREATE TABLE "check_ins" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "appointment_id" uuid NOT NULL REFERENCES "appointments"("id") ON DELETE RESTRICT,
  "checked_in_at" timestamptz NOT NULL DEFAULT now(), "checked_in_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "reversed_at" timestamptz, "reversed_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL, "note" varchar(300)
);
CREATE INDEX "check_ins_appointment_time_idx" ON "check_ins" ("appointment_id","checked_in_at");

CREATE TABLE "clinical_encounters" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT,
  "practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE RESTRICT, "appointment_id" uuid REFERENCES "appointments"("id") ON DELETE RESTRICT,
  "department_id" uuid NOT NULL REFERENCES "departments"("id") ON DELETE RESTRICT, "encounter_type" varchar(100) NOT NULL,
  "status" encounter_status NOT NULL DEFAULT 'PLANNED', "started_at" timestamptz, "completed_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "encounters_appointment_unique" ON "clinical_encounters" ("appointment_id");
CREATE INDEX "encounters_patient_created_idx" ON "clinical_encounters" ("patient_id","created_at");
CREATE INDEX "encounters_practitioner_created_idx" ON "clinical_encounters" ("practitioner_id","created_at");
CREATE TABLE "clinical_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "encounter_id" uuid NOT NULL REFERENCES "clinical_encounters"("id") ON DELETE RESTRICT,
  "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT, "author_practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE RESTRICT,
  "type" clinical_note_type NOT NULL, "content" text NOT NULL, "patient_visible" boolean NOT NULL DEFAULT false,
  "current_revision" integer NOT NULL DEFAULT 1, "status" varchar(40) NOT NULL DEFAULT 'ACTIVE',
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "clinical_notes_encounter_idx" ON "clinical_notes" ("encounter_id");
CREATE INDEX "clinical_notes_patient_created_idx" ON "clinical_notes" ("patient_id","created_at");
CREATE TABLE "clinical_note_revisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "clinical_note_id" uuid NOT NULL REFERENCES "clinical_notes"("id") ON DELETE RESTRICT,
  "revision_number" integer NOT NULL, "content_snapshot" text NOT NULL, "amended_by_practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE RESTRICT,
  "amendment_reason" varchar(500) NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "clinical_note_revisions_number_unique" ON "clinical_note_revisions" ("clinical_note_id","revision_number");
CREATE INDEX "clinical_note_revisions_note_time_idx" ON "clinical_note_revisions" ("clinical_note_id","created_at");
CREATE TABLE "patient_alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT,
  "type" patient_alert_type NOT NULL, "description" text NOT NULL, "active" boolean NOT NULL DEFAULT true,
  "authored_by_practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE RESTRICT, "resolved_at" timestamptz,
  "resolved_by_practitioner_id" uuid REFERENCES "practitioners"("id") ON DELETE RESTRICT,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "patient_alerts_patient_active_idx" ON "patient_alerts" ("patient_id","active");

CREATE TABLE "test_results" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT,
  "encounter_id" uuid REFERENCES "clinical_encounters"("id") ON DELETE RESTRICT, "requested_by_practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE RESTRICT,
  "type" varchar(160) NOT NULL, "summary" text, "structured_value" jsonb, "status" test_result_status NOT NULL DEFAULT 'REQUESTED',
  "result_date" timestamptz, "patient_visible" boolean NOT NULL DEFAULT false, "released_at" timestamptz,
  "released_by_practitioner_id" uuid REFERENCES "practitioners"("id") ON DELETE RESTRICT,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "test_results_patient_date_idx" ON "test_results" ("patient_id","result_date");
CREATE INDEX "test_results_encounter_idx" ON "test_results" ("encounter_id");
CREATE INDEX "test_results_status_idx" ON "test_results" ("status");
CREATE TABLE "documents" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT,
  "encounter_id" uuid REFERENCES "clinical_encounters"("id") ON DELETE RESTRICT, "uploaded_by_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "document_type" varchar(100) NOT NULL, "display_name" varchar(255) NOT NULL, "storage_key" varchar(500) NOT NULL,
  "content_type" varchar(160) NOT NULL, "byte_size" integer, "patient_visible" boolean NOT NULL DEFAULT false,
  "status" varchar(40) NOT NULL DEFAULT 'ACTIVE', "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "documents_storage_key_unique" ON "documents" ("storage_key");
CREATE INDEX "documents_patient_created_idx" ON "documents" ("patient_id","created_at");
CREATE INDEX "documents_encounter_idx" ON "documents" ("encounter_id");

CREATE TABLE "prescriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "patient_id" uuid NOT NULL REFERENCES "patient_profiles"("id") ON DELETE RESTRICT,
  "encounter_id" uuid NOT NULL REFERENCES "clinical_encounters"("id") ON DELETE RESTRICT,
  "prescribing_practitioner_id" uuid NOT NULL REFERENCES "practitioners"("id") ON DELETE RESTRICT,
  "status" prescription_status NOT NULL DEFAULT 'DRAFT', "prescribed_at" timestamptz, "instructions" text,
  "patient_visible" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "prescriptions_patient_date_idx" ON "prescriptions" ("patient_id","prescribed_at");
CREATE INDEX "prescriptions_encounter_idx" ON "prescriptions" ("encounter_id");
CREATE INDEX "prescriptions_practitioner_idx" ON "prescriptions" ("prescribing_practitioner_id");
CREATE TABLE "prescription_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "prescription_id" uuid NOT NULL REFERENCES "prescriptions"("id") ON DELETE RESTRICT,
  "medication_name" varchar(255) NOT NULL, "dose_instructions" varchar(500) NOT NULL, "frequency" varchar(160), "duration" varchar(160),
  "quantity" numeric(10,2), "quantity_unit" varchar(60), "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "prescription_items_prescription_idx" ON "prescription_items" ("prescription_id");

CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "actor_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "actor_role_snapshot" user_role, "action" varchar(100) NOT NULL, "resource_type" varchar(100) NOT NULL, "resource_id" uuid,
  "patient_id" uuid REFERENCES "patient_profiles"("id") ON DELETE RESTRICT, "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "occurred_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "audit_logs_patient_time_idx" ON "audit_logs" ("patient_id","occurred_at");
CREATE INDEX "audit_logs_resource_time_idx" ON "audit_logs" ("resource_type","resource_id","occurred_at");
CREATE INDEX "audit_logs_actor_time_idx" ON "audit_logs" ("actor_user_id","occurred_at");
