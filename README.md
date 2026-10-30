# Zimbabwe Maids Centre

Domestic worker placement platform for Zimbabwe. Verified workers, structured placement requests, payments and an operations back office.

Live: https://zimbabwe-maids-centre.vercel.app

## Status

Deployed and in use as the product surface for the placement agency. Payment integration is configured through Paynow; credentials are supplied through environment variables and are not stored in this repository. Unit tests exist for the core flows listed below and are run with Vitest. Test coverage is partial, not comprehensive.

## What is implemented

| Domain | Code | Notes |
| --- | --- | --- |
| Accounts and sessions | `src/features/auth` | Firebase Authentication, protected routes, role-aware navigation |
| Worker profiles | `src/features/workers`, `src/features/profile` | Profile creation, images, availability, placement history |
| Verification | `src/features/verification` | Document submission and review states for worker vetting |
| Jobs and placement | `src/features/jobs` | Employer job posts, applications, placement lifecycle |
| Matching | `src/features/matching` | Worker to job matching with location and role filters |
| Messaging | `src/features/messaging` | Employer and worker conversation threads |
| Payments | `src/features/payments` | Paynow and EcoCash integration points via Cloud Functions |
| Dashboard | `src/features/dashboard` | Employer and worker summaries |
| Operations | `src/features/operations` | Agency-side placement and worker management |
| Admin | `src/features/admin` | Account and content administration |

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Vite, React 19, TypeScript, Tailwind CSS |
| Client state | Zustand |
| Server state | TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Components | Radix UI primitives |
| Backend services | Firebase Auth, Firestore, Storage, Cloud Functions |
| Payments | Paynow, EcoCash |
| Offline | PWA via `vite-plugin-pwa` (Workbox) |
| Data | Postgres schema in `db/schema.sql`, migrated by `npm run db:migrate` |
| Hosting | Vercel, with serverless entry at `api/[...path].ts` |

## Run locally

Requires Node.js 20 or newer and npm 9 or newer.

```bash
cp .env.example .env.local   # Firebase, Neon and Paynow settings
npm install
npm run dev                  # Vite dev server
```

Useful commands:

```bash
npm run typecheck            # tsc, no emit
npm run lint                 # oxlint
npm run test                 # Vitest
npm run test:coverage
npm run build                # production bundle
npm run db:migrate
npm run db:seed:review
```

## Repository layout

```
api/          serverless API entry
db/           Postgres schema and migrations
firebase/     Firebase configuration, rules and functions
public/       static assets and images
scripts/      database and seeding utilities
src/features/ domain modules, one directory per capability
src/pages/    route-level screens
src/stores/   Zustand stores
src/lib/      shared clients and helpers
src/types/    shared types
```

## Documentation

- `Zimbabwe_Maids_Centre_PRD_v1.md` product requirements
- `Zimbabwe_Maids_Centre_Tech_Spec_v1.md` technical specification

## Author

Tinotenda Brandon Duma, Radbit Studios. Contact: brandontinoz@gmail.com
