# Memory Map Action Planner - Setup Complete

## Phase 1: Setup (Shared Infrastructure) ✅

The project is now fully configured with offline-first Vite + TypeScript tooling.

### What's Configured

#### Core Dependencies
- **Runtime**: `mind-elixir@^5.3.7`, `react@^18.2.0`, `react-dom@^18.2.0`
- **Build Tools**: Vite 5, TypeScript 5, Terser for minification
- **Testing**: Vitest for units, Playwright for E2E smoke tests
- **Development**: ESLint for linting

#### Configuration Files
- **`tsconfig.json`**: ES2020 target, TypeScript strict mode, path aliases (`@/*`, `@core/*`, `@ui/*`, etc.)
- **`tsconfig.node.json`**: Config for build tools
- **`vite.config.ts`**: Offline SPA config with vendor chunk splitting
- **`.eslintrc.cjs`**: ESLint rules (no telemetry, minimal deps, code clarity)
- **`vitest.config.ts`**: Vitest with jsdom environment and coverage support
- **`playwright.config.ts`**: Playwright for smoke tests across Chrome, Firefox, Safari
- **`.gitignore`**, **`.dockerignore`**, **`.eslintignore`**: Ignore patterns

#### Ignore Files
- **`.gitignore`**: Standard Node/development patterns
- **`.dockerignore`**: Minimal Docker image context
- **`.eslintignore`**: ESLint exclusions (dist, build, node_modules, coverage)

#### Scripts
```bash
npm run dev              # Start dev server on http://localhost:5173
npm run build            # TypeScript check + Vite production build
npm run preview          # Preview built app locally
npm run test             # Vitest run (unit tests)
npm run test:watch      # Vitest watch mode
npm run test:coverage   # Vitest with coverage report
npm run test:e2e        # Playwright E2E smoke tests
npm run test:e2e:debug  # Playwright debug mode
npm run lint            # ESLint fix mode
```

### Directory Structure

```
src/
├── core/              # mind-elixir fork glue, node schema extensions
├── ui/                # attribute panel, modals, badges
├── services/          # persistence, export, autosave utilities
├── state/             # lightweight state container/hooks
├── utils/             # helpers (id, validation, formatting)
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles

tests/
├── unit/              # Vitest unit tests
├── integration/       # Vitest integration tests
├── contract/          # Contract regression tests
└── e2e/               # Playwright smoke tests

public/                # Static assets
dist/                  # Built output (after npm run build)
```

### Next Steps: Phase 2 - Foundational (Blocking Prerequisites)

The Phase 2 tasks will implement:
- **T006**: Extended node types with `extended.plan` fields
- **T007**: Plan field validation helpers
- **T008**: Lightweight state store with selection, history hooks
- **T009**: Shared constants for schema version and ID handling
- **T010**: Browser file IO helpers (Blob download, file picker, drag-drop)
- **T011**: Reusable alert/toast component

These foundational pieces will unblock all user story implementations (Phase 3–8).

### Validation Checklist

- ✅ Dependencies installed without errors
- ✅ TypeScript compilation succeeds (`npx tsc --noEmit`)
- ✅ ESLint runs without errors (`npm run lint`)
- ✅ Vitest configured (recognizes test files when present)
- ✅ Vite build succeeds to `dist/` folder
- ✅ Dev server configured on port 5173
- ✅ Playwright ready for E2E tests
- ✅ Git ignore patterns configured

### Local Development

```bash
# Start dev server
npm run dev

# In another terminal, run linting continuously
npm run test:watch

# Before committing
npm run lint
npm run build
```

All configurations follow the offline-first, zero-telemetry, minimal-dependency constitution.
