# Client Dashboard — Buyer Led Representation

A transaction dashboard for clients of Buyer Led Representation. Each active client
gets a private, unguessable link to a real-time view of their home purchase: the
timeline, next steps, costs, and a shared to-do list. An admin area lets the agent
update everything as the transaction progresses.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- SQLite via Prisma (zero setup locally; swaps to Postgres later with just an env change)

## Running it locally

```bash
npm install
npm run db:migrate   # creates the SQLite database and applies the schema
npm run db:seed      # loads one example transaction (Sarah & Jordan / 4127 Maple Street)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm install` also runs `prisma generate` automatically via a `postinstall` hook, so the
Prisma client is ready before you run migrate/seed.

## Logging into the admin area

Go to [http://localhost:3000/admin](http://localhost:3000/admin) — you'll be redirected
to the login page. Credentials are set in `.env` (already created with defaults for
local testing):

- Email: `conor@buyerled.com`
- Password: `changeme123`

Change `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in `.env` before this ever
goes near a real client — none of these are safe defaults for production.

## Viewing the seeded client dashboard

After running `npm run db:seed`, the terminal prints the dashboard link, e.g.:

```
/dashboard/cEbLV5Qtnmuhvo--3cpzezMRh0vGYmbd
```

Open that path on `localhost:3000` to see the client-facing view, or find it in the
admin transaction list (`/admin`) under "View as client" / "Copy link". The token is a
long random string — treat it like a password. You can also open the transaction's edit
screen (`/admin/[id]`) to copy the link at any time.

## What's editable from `/admin`

- Transaction list (`/admin`) — every client, with quick links to view or edit.
- New transaction (`/admin/new`) — creates a transaction and auto-generates its share
  token.
- Edit transaction (`/admin/[id]`) — update property/dates/status, add/reorder/edit/
  delete timeline steps, add/toggle/delete next steps, add/edit/delete cost line items,
  add/toggle/delete to-do items, and delete the whole transaction.

## Project structure

```
prisma/schema.prisma          Data model (Transaction, TimelineStep, NextStep, CostItem, TodoItem)
prisma/seed.ts                Seed script
src/lib/prisma.ts             Prisma client singleton
src/lib/session.ts            iron-session config (signed, httpOnly admin cookie)
src/lib/auth.ts               Admin credential check + requireAdmin() guard
src/components/dashboard/     Timeline, NextStepsCard, CostsCard, TodoCard, etc.
                               — shared between the client view and future admin previews
src/app/dashboard/[token]/    Public, read-only client dashboard
src/app/admin/login/          Admin login (no auth required)
src/app/admin/(protected)/    Everything else under /admin — guarded by requireAdmin()
                               in the route group's layout, and again inside every
                               mutating server action
```

## Out of scope for this pass (by design)

- No email/SMS notifications on updates.
- No client accounts/login — the private-link approach is intentional.
- No payments or e-signature integration.
- No production deployment — this is local-only for now. When that's next: deploy to
  Vercel, point `DATABASE_URL` at a hosted Postgres instance (Vercel Postgres or
  Supabase both work fine with Prisma), and set `ADMIN_EMAIL` / `ADMIN_PASSWORD` /
  `SESSION_SECRET` as real secrets in the hosting environment. No code changes needed
  beyond that.
