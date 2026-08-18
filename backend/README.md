# Lingora backend setup

The frontend is hosted on GitHub Pages. Real authentication, bookings and payments require a server-side database/auth provider and secret environment variables.

## Recommended production architecture

- PostgreSQL database (Supabase-compatible schema is in `database/schema.sql`)
- Managed authentication for students and tutors
- Server-side booking transaction that locks a slot before confirming a booking
- Payment provider with server-side webhook verification
- Row-level access controls so students can only see their own bookings and tutors can only manage their own availability

## Required environment variables

Do not commit real secrets to GitHub.

- `DATABASE_URL`
- `AUTH_URL`
- `AUTH_SECRET`
- `PAYMENT_SECRET_KEY`
- `PAYMENT_WEBHOOK_SECRET`

## Production sequence

1. Create the managed database/auth project.
2. Run `database/schema.sql`.
3. Configure authentication redirect URLs for the Lingora domain.
4. Deploy the server/API with the environment variables above.
5. Point the frontend booking calls at the API.
6. Enable payment webhooks and verify signatures server-side.

Until those steps are completed, the GitHub Pages site must remain a demo and must not collect real payment details.