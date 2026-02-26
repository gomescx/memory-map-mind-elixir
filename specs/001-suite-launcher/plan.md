# Implementation Plan: Suite Launcher and Deployment Restructure

**Branch**: `001-suite-launcher` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-suite-launcher/spec.md`

## Summary

Create a minimal static HTML launcher page at the repository root URL (`/`) and restructure the Vite build so the Memory Map app is served at `/tools/memory-map/` instead of `/`. The COER form (already at `public/tools/coer/`) becomes accessible at `/tools/coer/`. The approach uses Vite's multi-page entry point configuration (`rollupOptions.input`) to relocate the Memory Map output, while the launcher and COER form are static HTML files copied via Vite's `publicDir` mechanism. Zero changes to the GitHub Actions deploy workflow.

## Technical Context

**Language/Version**: TypeScript 5.3, HTML5 (static launcher + COER)  
**Primary Dependencies**: Vite 7.3.1, React 18.2, mind-elixir ^5.3.7  
**Storage**: N/A (launcher is navigation-only; no data persistence)  
**Testing**: Vitest + Playwright (Memory Map), manual verification (launcher, COER)  
**Target Platform**: Web / GitHub Pages (`/memory-map-mind-elixir/` sub-path)  
**Project Type**: Web (multi-page deployment from monorepo)  
**Performance Goals**: N/A (static page, instant load)  
**Constraints**: Offline-capable (browser cache), no external dependencies, zero deploy workflow changes  
**Scale/Scope**: 1 launcher page, 2 deployed tools, 3 future-tool placeholders

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | Offline-First | ✅ PASS | Launcher is static HTML, no network requests post-load (FR-US1.5) |
| II | Single-Session, Single-User | ✅ PASS | No collaboration, accounts, or shared state |
| III | Privacy by Default | ✅ PASS | No cookies, telemetry, or third-party scripts (FR-US1.6) |
| IV | Respect Upstream | ✅ PASS | No mind-elixir modifications; only deployment path changes |
| V | Simplicity Over Completeness | ✅ PASS | Static HTML + Vite config change; no new frameworks or abstractions |
| VI | Shared Data Format | ✅ PASS | Launcher is navigation-only; does not read/write project files |
| VII | Testing Standards | ✅ PASS | Standalone HTML → manual testing per constitution exception; Memory Map retains automated tests |
| VIII | Commit Standards | ✅ PASS | Will follow `type(scope): description` format |
| IX | Environment Config | ✅ PASS | No new env vars; base path is build config, not runtime env |
| X | Console Output | ✅ PASS | No new console output; standard Vite build messages |
| — | Suite Infrastructure | ✅ PASS | Matches constitution §Suite Infrastructure exactly: static HTML in `public/`, Vite-built tools, URL structure preserved |
| — | Tool Independence | ✅ PASS | Each tool independently accessible by direct URL (FR-000.2, FR-000.3) |

**Gate result**: ALL PASS — no violations, no justifications needed.

**Post-Phase 1 re-check**: Design introduces no new dependencies, no backend, no shared runtime. All gates remain PASS.

## Architecture Decisions

### AD-001: Relocate Memory Map Entry Point (not copy)

**Decision**: Move `index.html` → `tools/memory-map/index.html` via `git mv`.

**Rationale**: Vite mirrors the input path structure in the output (`tools/memory-map/index.html` → `dist/tools/memory-map/index.html`). This is the standard multi-page pattern. The HTML's absolute script path (`/src/main.tsx`) continues to resolve from project root. See [research.md#R-001](research.md#r-001-vite-multi-page-build-with-relocated-entry-point).

### AD-002: Conditional Vite `base` Path

**Decision**: Use functional `defineConfig` to set `base` by build command.

| Context | `base` value |
|---------|-------------|
| Dev (`vite serve`) | `/tools/memory-map/` |
| Prod (`vite build`) | `/memory-map-mind-elixir/tools/memory-map/` |

**Rationale**: Dev server needs short paths; production needs the GitHub Pages repo sub-path prefix. See [research.md#R-002](research.md#r-002-vite-base-path--dev-vs-production).

### AD-003: Launcher as Static HTML in `publicDir`

**Decision**: Place launcher at `public/index.html` — Vite copies it to `dist/index.html` without processing.

**Rationale**: The launcher requires no build tooling, no React, no TypeScript. Inline CSS keeps it self-contained. Matches FR-US1.7 and constitution §Form-Based Tools ("no build tools required"). See [research.md#R-003](research.md#r-003-publicdir-interaction-with-multi-page-entry).

### AD-004: No Custom 404 or Redirect Handling

**Decision**: Rely on GitHub Pages' built-in trailing-slash redirect and default 404 page.

**Rationale**: GitHub Pages redirects `/tools/memory-map` → `/tools/memory-map/` automatically. Unknown paths get the default 404. Acceptable for MVP per spec edge cases. See [research.md#R-004](research.md#r-004-github-pages-trailing-slash-behaviour).

## Project Structure

### Documentation (this feature)

```text
specs/001-suite-launcher/
├── plan.md              # This file
├── research.md          # Phase 0: Vite config research
├── data-model.md        # Phase 1: Launcher content model, dist structure
├── quickstart.md        # Phase 1: Dev + verify instructions
├── contracts/
│   └── url-structure.md # Phase 1: URL routing contract
└── tasks.md             # Phase 2 (created by /speckit.tasks)
```

### Source Code (repository root)

```text
# Files CREATED by this feature
public/
└── index.html                    # Launcher page (static HTML, copied to dist/)

# Files MOVED by this feature
tools/
└── memory-map/
    └── index.html                # Memory Map Vite entry (moved from root index.html)

# Files MODIFIED by this feature
vite.config.ts                    # base path + rollupOptions.input

# Files UNCHANGED (confirmed in-place)
public/
└── tools/
    └── coer/
        └── index.html            # COER form (already exists, copied to dist/ as-is)
src/                              # All source code unchanged
.github/workflows/deploy.yml     # Deploy workflow unchanged (FR-000.1)
```

### Build Output (`dist/`) — Expected Structure

```text
dist/
├── index.html                    # Launcher (from public/)
├── tools/
│   ├── coer/
│   │   └── index.html            # COER form (from public/, as-is)
│   └── memory-map/
│       ├── index.html            # Memory Map app (Vite-built)
│       └── assets/
│           ├── memory-map-[hash].js
│           └── memory-map-[hash].css
```

Matches SC-004: three top-level entry points.

**Structure Decision**: Single monorepo with Vite multi-page entry. No new packages, no new build pipelines. The only structural change is relocating the Vite HTML entry point from root to `tools/memory-map/`.

## Cross-References

| Artifact | Purpose | Key sections |
|----------|---------|-------------|
| [spec.md](spec.md) | Requirements & acceptance criteria | FR-US1.1–US1.7, FR-US2.1–US2.3, FR-US3.1–US3.3, FR-000.1–000.3 |
| [research.md](research.md) | Technical decisions with rationale | R-001 through R-005 |
| [data-model.md](data-model.md) | Launcher content model, dist layout | Tool entry schema, file structure |
| [quickstart.md](quickstart.md) | Dev setup and verification steps | Build, preview, verify commands |
| [contracts/url-structure.md](contracts/url-structure.md) | URL routing contract | Routes, redirects, asset paths |

## Complexity Tracking

No constitution violations detected. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *(none)* | — | — |
