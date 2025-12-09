# Cenra - AI Agent that actually understands your business
Cenra turns your content, docs, and product knowledge into a conversational support agent that remembers chats, understands context, and responds like your best teammate, without building AI infrastructure.

## What Cenra does
- Generates contextual answers from your business content.
- Remembers past conversations and threads with LangGraph checkpointing.
- Handles identity collection only when needed.
- Streams replies for a natural, human-like feel.
- Supports workspace-level greetings, suggestions, and knowledge.
- Ships as an embeddable widget for any product or website.

## Why Cenra
- Workspace-driven knowledge, not generic chat.
- Customer-aware threads with conversation memory.
- Smooth UI with identity capture and streaming output.
- Optimised retrieval with Qdrant vector search and Postgres persistence.

## Architecture overview
Workspace → Resources → Vector Store → AI Agent → Widget UI

- Backend: Express + LangGraph agent, Qdrant vector store, Postgres for business data and LangGraph PostgresSaver checkpoints.
- Frontend: Next.js dashboard for ops teams, configurable widget for end users.
- Data flow: resources (URLs, files) -> embeddings -> vector search -> agent -> streamed messages -> widget and dashboard.

## Tech stack
- Frontend: Next.js 16 (React 19), TanStack Query, Zod, Radix UI, Turbopack.
- Widget: Next.js client widget with Zustand state and shared UI kit.
- Backend: Node/Express, LangChain/LangGraph, Qdrant, Postgres.
- Auth: JWT, Google OAuth.
- Tooling: pnpm workspaces, Turborepo, TypeScript, Prisma.

## Core concepts
- Workspaces: each business has isolated knowledge, settings, and identity.
- Customers: created dynamically when identification is needed.
- Conversations: persisted threads with LangGraph checkpointing plus widget session state.
- Messages: streamed assistant and user turns rendered in the UI.

## Data flow
- Visitor opens widget → check session; if none, show greeting.
- First message → agent answers and collects identity when required → thread stored in Postgres.
- Follow-up → agent retrieves prior messages + vector search over workspace resources → generates contextual reply.

## Monorepo layout
- `apps/web` – Next.js dashboard for agents and workspace management (port 3000).
- `apps/widget` – Next.js embeddable chat widget (port 3001).
- `packages/backend` – Express + LangGraph API service (default port 8080).
- `packages/db` – Prisma schema and migrations for Postgres.
- `packages/ui` – Shared UI primitives.
- `packages/typescript-config`, `packages/eslint-config` – Shared tooling configs.

## Prerequisites
- Node.js >= 20
- pnpm (repo uses `pnpm@10.23.0`)
- Postgres instance (`DATABASE_URL`, `THREADS_DB_URL`)
- Qdrant instance + API key
- Google OAuth client (for login)

## Environment variables
Create a `.env` for the backend (export or load via your process manager). Required by `packages/backend` and `packages/db`:

```
# Server
PORT=8080
NODE_ENV=development
JWT_SECRET=replace-me

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
THREADS_DB_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME   # used by LangGraph PostgresSaver

# Qdrant
QDRANT_URL=https://your-qdrant-host
QDRANT_API_KEY=your-key

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8080/api/v1/auth/google/callback
```

Tip: dashboard and widget axios clients default to `http://localhost:8080/api/v1`. Update `apps/web/lib/axios.ts` and `apps/widget/lib/axios.ts` or wire env-driven config for other environments.

## Install and set up
```bash
pnpm install

# Generate Prisma client
pnpm --filter @workspace/db db:generate

# Apply migrations (dev loop)
pnpm --filter @workspace/db db:migrate

# Deploy migrations (CI/prod)
pnpm --filter @workspace/db db:deploy
```

## Run in development
Option A: Turbo all services
```bash
pnpm dev
```
- Dashboard: http://localhost:3000
- Widget: http://localhost:3001
- API: http://localhost:8080 (if `PORT` is 8080)

Option B: Per package
```bash
pnpm --filter @workspace/backend dev
pnpm --filter @workspace/web dev
pnpm --filter @workspace/widget dev
```

## Build, lint, typecheck
```bash
pnpm build      # turbo build all
pnpm lint       # turbo lint all
pnpm format     # prettier on ts/tsx/md

pnpm --filter @workspace/web typecheck
pnpm --filter @workspace/widget typecheck
pnpm --filter @workspace/backend build
```

## Production notes
- Provide production values for secrets, database URLs, and `NODE_ENV=production`.
- Allow CORS for your dashboard/widget origins (`packages/backend/src/index.ts`).
- Point frontend axios base URLs to your deployed API.
- Run `db:deploy` before starting the API in new environments.

## Troubleshooting
- API will not start: verify `DATABASE_URL`, `THREADS_DB_URL`, `QDRANT_URL`, `QDRANT_API_KEY`; ensure `PORT` is free.
- Google login fails: ensure redirect URI matches Google Cloud Console config.
- Widget cannot connect: check CORS and axios base URL in web/widget.
- Prisma issues: regenerate client after schema changes (`pnpm --filter @workspace/db db:generate`).

## Contributing
1. Branch from `main`.
2. Keep changes scoped and linted (`pnpm lint`).
3. Open a PR with description and, for UI changes, screenshots.

## License
MIT License. See `LICENSE` for full terms.
