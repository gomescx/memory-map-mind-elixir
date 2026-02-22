# Implementation Plan: Clarity of End Result (COER) Form

**Branch**: `001-coer-form` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-coer-form/spec.md`

## Summary

Deliver a standalone HTML tool implementing the 9-question COER form with save/load to the shared JSON project file and export (print-to-PDF + markdown text). The tool is a single HTML file with embedded CSS and JavaScript — no build system, no framework, no dependencies — per Constitution Principle V (Simplicity) and the Form-Based Tools guardrail. Browser File System Access API handles save/load; `window.print()` handles PDF export; Blob download handles text export.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020), HTML5, CSS3 — no TypeScript, no build step
**Primary Dependencies**: None — standard browser APIs only
**Storage**: Shared JSON project file via File System Access API (with `<input type="file">` fallback)
**Testing**: Manual testing as primary validation (per Constitution VII for standalone HTML tools); documented manual test scenarios for critical paths (save/load, data format). Optional lightweight automated tests via the existing Vitest setup for shared JSON schema utilities if extracted
**Target Platform**: Modern desktop browsers (Chrome, Safari, Firefox, Edge) — fully offline
**Project Type**: Standalone HTML tool (single file, zero-config delivery)
**Performance Goals**: Form renders instantly; save/load completes in <1s; export opens print dialog in <1s
**Constraints**: Offline-first, zero external dependencies, zero telemetry, zero build tooling, single-user single-session
**Scale/Scope**: Single initiative per session (MVP); form with 9 questions; project files up to ~100KB

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Offline-First | **PASS** | No server, no network calls. Single HTML file runs from `file://` or any static host |
| II. Single-Session, Single-User | **PASS** | No auth, no collaboration. One user, one file, one session |
| III. Privacy by Default | **PASS** | No telemetry, no cookies, no external APIs |
| IV. Respect Upstream (mind-elixir) | **N/A** | COER is a Form-Based Tool; does not use mind-elixir-core |
| V. Simplicity | **PASS** | Standalone HTML, zero dependencies, zero build tooling. Simplest possible delivery |
| VI. Shared Data Format | **PASS** | Reads/writes the `effectivenessToolkit` envelope with namespaced `coer` section per initiative. Preserves unknown fields on round-trip |
| VII. Testing Standards | **PASS** | Manual testing as primary (per constitution allowance for standalone HTML). Critical paths documented as manual test scenarios |
| VIII. Commit Standards | **PASS** | Conventional Commits with `coer` scope |
| IX. Environment Config | **N/A** | No env vars needed for standalone HTML tool |
| X. Console Output | **N/A** | No build/batch processing |

**Pre-Phase 0 gate: PASS** — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-coer-form/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (file format contracts)
│   └── project-file-schema.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
tools/
└── coer/
    └── index.html       # Complete standalone COER tool (HTML + CSS + JS)

tests/
└── manual/
    └── coer-test-scenarios.md   # Documented manual test scenarios
```

**Structure Decision**: The COER tool is a standalone HTML file placed in `tools/coer/` at the repository root. This keeps it separate from the Memory Map's `src/` tree (which uses Vite + React + TypeScript) per Constitution Principle VI (tool independence — each tool is independently deployable). The `tools/` directory establishes the pattern for future standalone tools (Prioritization/TMM, etc.). No shared code is extracted in this MVP — the COER implements its own file I/O and JSON handling inline, since the patterns are simple enough to not warrant a shared library yet (Constitution Principle V — just-in-time architecture).

## Constitution Check — Post-Design Re-evaluation

*Re-check after Phase 1 design artifacts are complete.*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Offline-First | **PASS** | Confirmed: standalone HTML, `<a download>` + `<input type="file">`, `window.print()`. No network calls. Works from `file://` |
| II. Single-Session, Single-User | **PASS** | Confirmed: no auth, no collaboration, no persistence beyond explicit file save |
| III. Privacy by Default | **PASS** | Confirmed: no telemetry, no cookies, no external APIs, no localStorage reliance |
| IV. Respect Upstream | **N/A** | Confirmed: COER does not use mind-elixir-core |
| V. Simplicity | **PASS** | Confirmed: zero dependencies, zero build tooling, vanilla JS. Architecture is a single HTML file with embedded CSS/JS |
| VI. Shared Data Format | **PASS** | Confirmed: `effectivenessToolkit` envelope with namespaced `coer` section. Schema formalized in [contracts/project-file-schema.md](contracts/project-file-schema.md). Round-trip preservation of unknown fields guaranteed |
| VII. Testing | **PASS** | Manual test scenarios in quickstart.md. Critical paths (save/load, data format) documented |
| VIII. Commit Standards | **PASS** | `coer` scope, Conventional Commits format |
| IX. Environment Config | **N/A** | No env vars |
| X. Console Output | **N/A** | No build/batch processing |

**Post-design gate: PASS** — no violations. No complexity tracking needed.

## Complexity Tracking

No constitutional violations identified; table not required.
