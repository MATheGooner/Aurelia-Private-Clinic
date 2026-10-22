# Booking and availability boundaries

Availability is derived server-side from active departments, treatments, practitioner-department and practitioner-treatment relationships, recurring schedule rules, schedule exceptions and active appointments. The pure slot engine uses `Europe/London`, 15-minute start boundaries, a 60-minute minimum lead time and a maximum 31-day query range. Treatment duration takes precedence; general appointments use the practitioner's default duration.

The public availability endpoint returns appointment slots only. It does not expose patients, appointment reasons or clinical information. A no-preference query evaluates every eligible practitioner and returns chronologically sorted concrete slots; the chosen slot always carries a practitioner ID and slug.

Booking requests are validated and availability is regenerated server-side. Authenticated patients always use the patient profile ID resolved from their session. Public requests create a separate reviewable patient profile rather than attempting unsafe identity matching. The client cannot submit a patient identity.

Persistence runs in one transaction and creates both the appointment and its initial `REQUESTED` history entry. A transaction-scoped PostgreSQL advisory lock serialises booking operations per practitioner, followed by an overlap query. The `appointments_practitioner_no_overlap` GiST exclusion constraint is the final database-level concurrency boundary for active appointment states.

The deterministic suite tests the service and concurrency response without a database. A true multi-connection integration test requires a disposable PostgreSQL database with all migrations applied. Never point that test at an unknown or production database. The migration requires permission to install the standard `btree_gist` extension; confirm this capability with the chosen managed PostgreSQL provider before deployment.
