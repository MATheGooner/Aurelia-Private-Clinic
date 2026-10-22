CREATE UNIQUE INDEX "check_ins_one_active_per_appointment"
ON "check_ins" ("appointment_id")
WHERE "reversed_at" IS NULL;
