# AGENTS.md
# Design‑Recipe Workbench – Contributor & Agent Guide
#
# This file gives OpenAI Codex (cloud agent) – and any human contributor –
# the exact context, rules and commands needed to work productively in
# this repository.  **Nothing here is optional.**  Changes that violate
# these rules should be rejected or revised.

---

## 1 Repository at a glance

```
.
├── package.json
├── index.html
├── vite.config.ts
├── src/
│   ├── components/                # UI building blocks
│   │   ├── layout/               # 3‑column shell (DRLayout & friends)
│   │   ├── navigation/           # TimelineNav, NavSidebar
│   │   ├── project/              # Project file‑picker, recent projects
│   │   ├── viewer/               # CodeViewer (tabbed editor)
│   │   └── ui/                   # Generic atoms (Card, Button, …)
│   ├── contexts/                 # React context wrappers (Analysis…)
│   ├── hooks/                    # Shared hooks (Yjs, project, toast)
│   ├── pages/                    # Route‑level screens (Overview, …)
│   ├── router/                   # <AppRoutes/> and helpers
│   ├── state/                    # XState finite‑state‑machine logic
│   ├── theme/                    # Tailwind theme helpers / design tokens
│   └── treesitter/               # Web‑worker + analysis logic
├── public/                       # Static assets
└── test/                         # Vitest unit & component tests
```

> **Agent note** – treat everything under `src/` as TypeScript (strict mode).  
> Do not introduce JavaScript files unless absolutely necessary.

---

## 2 Environment bootstrap

The **agent MUST run these exact commands** (they are fast and deterministic):

```bash
# 1) Use the recommended universal image defaults (Node 18‑LTS included).
# 2) Then:
pnpm install         # installs & links dependencies
pnpm run typecheck   # `tsc --noEmit` must pass
pnpm run lint        # ESLint + Prettier – must return 0
pnpm run test        # Vitest unit tests – must return 0
```

*If your workspace does not support **pnpm**, fall back to `npm ci` / `npm test` – behaviour is identical.*

### Required global tools

| Tool                  | Version      | Why                           |
| --------------------- | ------------ | ----------------------------- |
| `pnpm`                | ≥ 8          | deterministic, monorepo‑ready |
| `vitest`              | via dev‑deps | fast TS‑aware tests           |
| `eslint` & `prettier` | via dev‑deps | style & formatting            |

---

## 3 Lint, type & test gates

* **Type‑checking** (`pnpm run typecheck`) **must stay at 0 errors**.
* **ESLint** is the single source of style truth (extends `react`, `@typescript-eslint`, `tailwindcss` rules).
  The agent MUST run `pnpm run lint --fix` before proposing changes.
* **Vitest**: unit/component tests live in `src/**/*.test.(ts|tsx)`.
  New or refactored code **requires corresponding tests**.

---

## 4 Contribution & coding conventions

| Aspect               | Rule                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language / framework | **TypeScript 5**, React 19 (Function Components ‑ no classes)                                                                                                                    |
| State management     | **XState** for top‑level app state, React state for local UI state.                                                                                                              |
| Real‑time data       | **Yjs** – keep CRDT updates minimal & use shared maps (`useYMap`) utilities.                                                                                                     |
| Styling              | **Tailwind CSS**; use design tokens defined in `src/theme` (`radius`, `gray`, `brand‑*`). **Never** write ad‑hoc inline colors.                                                  |
| CSS scope            | Global styles reside in `src/index.css`; any new component-specific CSS **must** be Tailwind‑first; fallback to `@layer components` only if Tailwind utilities are insufficient. |
| File naming          | `PascalCase.tsx` for React components, `camelCase.ts` for utilities.                                                                                                             |
| Imports              | Absolute imports from `src/**` using TS path aliases configured in `tsconfig.json`.                                                                                              |
| Commits              | Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:` …).                                                                                                                  |
| PR title             | `[drwb] <concise task summary>` (e.g. `[drwb] fix code‑viewer background + toast duplication`).                                                                                  |
| PR body              | 1) Context / “why”, 2) Screenshot / gif if visual, 3) Checklist confirming **type / lint / tests** all pass.                                                                     |

---

## 5 Validation workflow for the agent

The agent should follow *exactly* this sequence when executing a **Code‑mode** task:

1. **Clone + install**

   ```bash
   pnpm install
   ```
2. **Quick sanity**

   ```bash
   pnpm run typecheck
   pnpm run lint
   pnpm run test
   ```

   Abort if any fail before making changes.
3. **Apply edits / generate code** in a local branch **without touching `package.json`** unless the task explicitly requires new deps.
4. **Re‑run the gates** (type, lint, test) until green.
5. **Run Vite preview** to ensure the web app launches (`pnpm run build && pnpm run preview --port 4173`).
   The agent can check for a **200** response on `http://localhost:4173`.
6. **Produce a single diff** with minimal, focused changes and a Conventional‑style commit.

---

## 6 Special project rules & context

1. **UI layout contract**

   * The 3‑column responsive shell (`<DRLayout/>`) is the only place that should allocate grid columns.
   * All select‑project / idle screens **must render inside the center column Card**, never a full‑width page.
2. **Finite‑state‑machine (FSM)**

   * The global XState machine lives in `src/state/appMachine.ts`.
   * Any new async side‑effects (e.g. parsing, persistence) **MUST** be modelled as services invoked by states – never `useEffect` outside the machine.
   * State transitions must remain serial → `idle → selecting → analysing → ready → viewingCode` (loop) with a final `error` branch.
3. **Toasts**

   * Toast hook `useToast()` must ensure **debounced IDs**; duplicate messages are a bug – fix in `src/hooks/useToast.ts`.
4. **Accessibility**

   * All interactive elements need semantic roles / `aria‑label`s.
   * Keyboard navigation through TimelineNav and CodeViewer tabs must remain functional.

---

## 7 What the agent **should NOT do**

* **Do NOT** rewrite the entire UI framework or introduce a new CSS solution.
* **Do NOT** add runtime dependencies > 100 kB without justification.
* **Do NOT** commit `.lock` files other than `pnpm-lock.yaml`.
* **Do NOT** push directly to `main` – always open a PR.

---

## 8 Setup scripts (container warm‑up)

Codex will run the following once at container start‑up:

```bash
#!/usr/bin/env bash
# .codex/setup.sh
set -euo pipefail

corepack enable         # enables pnpm
pnpm install --frozen-lockfile

# Pre‑warm Playwright (used in E2E tests)
npx playwright install --with-deps || true
```

> Add secrets (e.g. private NPM tokens) via the Codex dashboard; access them in this script with `$MY_SECRET`.

---

## 9 Useful one‑liners

```bash
# Run Vite dev server
pnpm dev

# Run headless component tests with Vitest + jsdom
pnpm test --watch

# Analyse TypeScript project graph
npx tsc --showConfig

# Reset Yjs doc cache (important for test isolation)
pnpm ts-node -e "import {clearDocCache} from './src/hooks/useYjs'; clearDocCache();"
```

---

## 10 Contact & escalation

* **Maintainer**: @designrecipe‑core<br>
  For architectural questions or large refactors, open a GitHub Discussion first.
* **CI**: GitHub Actions → `.github/workflows` must stay green.
* **Production**: Deploys are automated from `main` via Netlify; PRs must include a deploy preview URL.

---

Happy shipping! 🥳