# Static public data to database mapping

The public site intentionally continues to use static TypeScript data until a controlled integration phase.

| Static source | Persisted source | Mapping key |
| --- | --- | --- |
| `department-data.ts` | `departments` | `slug` |
| `treatment-data.ts` | `treatments` | `slug` |
| `practitioner-data.ts` | `practitioners` + `staff_profiles` | practitioner `slug` / `public_slug` |
| Practitioner department arrays | `practitioner_departments` | department slug |
| Practitioner treatment arrays | `practitioner_treatments` | treatment slug |
| Practitioner working days | `practitioner_schedule_rules` | practitioner slug + day |

Editorial biographies, hero imagery and long-form marketing content remain static. PostgreSQL stores operational fields needed for scheduling and clinic management.
