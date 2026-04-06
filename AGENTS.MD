# Agent Guidelines

## Conventions
- All code, comments, variable names, database schemas, and documentation are written in **English**.
- Use **Indonesian (Bahasa Indonesia)** only for user-facing text (UI labels, messages, notifications, etc.).
- `snake_case` for MySQL table and column names. Plural for table names (e.g. `users`, `participant_groups`).
- `camelCase` for variables and functions in both frontend and backend.
- `PascalCase` for classes, React components, and TypeScript types/interfaces.
- `kebab-case` for file and directory names (e.g. `user-profile.tsx`, `auth-utils.ts`).

## Commands
Always run these checks before considering work complete (enforced by Husky pre-commit hooks):
- `npm run typecheck` — runs strict TypeScript compiler checks without emitting files.
- `npm run lint` — checks for ESLint errors across the Next.js app.
- `npx prettier --write .` — auto-fix formatting across all files.

## Database Workflow
- `npm run db:seed` — parse CSV files (`data_peserta.csv`, etc.), hash passwords using Bcrypt, and perform bulk upserts into the MySQL database using Drizzle ORM.

## Preferred Libraries
- **zod** — schema validation, environment variable strict parsing, and type inference.
- **drizzle-orm** — headless TypeScript ORM for MySQL.
- **next-auth** — authentication and session management (credentials provider).
- **daisyui** — Tailwind CSS component library for fast UI scaffolding.

## Code Standards
- Use the `@/` alias for imports from `src/` (e.g., `import { db } from "@/db"`).
- Use `import type` for type-only imports.
- Never access `process.env` directly. Always import the validated `env` object from `src/env.ts`.
- Never typecast. Never use `as`.
- Never use non-null assertions (`!`).
- Never use `any`. Use `unknown` and narrow the type instead.
- Let TypeScript infer types when possible. Only annotate when inference is insufficient.
- This application has no external installed user base; optimize for one canonical current-state implementation, not compatibility with historical local states.
- Do not introduce compatibility bridges, migration shims, fallback paths, or dual behavior unless the user explicitly asks.
- Prefer one canonical codepath, fail-fast diagnostics, and explicit recovery steps over automatic migration, compatibility glue, silent fallbacks, or "temporary" second paths.
- If temporary migration code is introduced, the same diff must document: why it exists, why the canonical path is insufficient, exact deletion criteria, and the task that tracks its removal.
- Default stance: delete old-state compatibility code rather than carrying it forward.

## Library Context
Before writing code that uses project libraries, fetch the relevant documentation first to avoid hallucinating APIs. This project uses libraries that may not be well-represented in your training data (e.g., Tailwind v4 or specific App Router Next.js patterns).

### Lookup priority
1. **Official docs** — use web fetch or crawl on the `llms.txt` URLs below or the doc sites.
2. **Web search** — search the official site or GitHub for the specific API/pattern.
3. **Code search tools** — use as a supplement, not a primary source.

Do not guess API signatures. When in doubt, fetch the docs.

### llms.txt endpoints
| Library | URL |
| :--- | :--- |
| Next.js | https://nextjs.org/llms.txt |
| Zod | https://zod.dev/llms.txt |
| Drizzle ORM | https://orm.drizzle.team/llms.txt |
| Auth.js (NextAuth) | https://authjs.dev/llms.txt |

**No llms.txt available:** Tailwind CSS v4, DaisyUI — use their official doc sites directly.
