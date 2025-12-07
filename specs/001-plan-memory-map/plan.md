# Implementation Plan: Memory Map Action Planner MVP

**Branch**: `001-plan-memory-map` | **Date**: 2025-12-07 | **Spec**: `/specs/001-plan-memory-map/spec.md`
**Input**: Feature specification from `/specs/001-plan-memory-map/spec.md`

**Note**: This plan follows the `/speckit.plan` workflow and references `.specify/memory/constitution.md` (v1.0.0).

## Summary

Extend the mind-elixir-core fork to add six optional planning attributes per node, keep core keyboard/interaction behavior intact, and deliver offline-first save/load plus CSV and MS-Word table export. Implement as a single-page web app (TypeScript + Vite) with zero backend calls, file-based persistence, and a lightweight side-panel editor with visual badges.

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020 target) in-browser SPA built with Vite 5  
**Primary Dependencies**: mind-elixir-core (fork), lightweight utility helpers only (built-in Blob/File APIs for download; no network deps)  
**Storage**: File-based JSON export/import with versioned metadata; optional localStorage snapshot for auto-recover (opt-in)  
**Testing**: Vitest for units (node schema, export flattening, validation), Playwright smoke for keyboard + save/load/export flows  
**Target Platform**: Modern desktop browsers (Chrome, Safari, Firefox, Edge) running fully offline  
**Project Type**: Single web application (no backend)  
**Performance Goals**: Export 200-node maps in <2s without UI freeze; maintain 60fps interactions on typical maps; stable node IDs across save/load/export  
**Constraints**: Offline-first, zero telemetry/external API calls, preserve upstream shortcuts/layout, minimal bundle/dependency surface  
**Scale/Scope**: Single-user, single-session usage; maps up to ~500 nodes; solo-dev maintainability

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Offline-first: no backend or network calls planned (pass)  
- Single-session/single-user: no auth or collaboration features (pass)  
- Privacy by default: no telemetry, no third-party API calls (pass)  
- Respect upstream mind-elixir: node model remains compatible; keyboard/layout preserved (pass)  
- Simplicity: minimal dependencies (TypeScript + Vite + tests) suited for solo dev (pass)

## Project Structure

### Documentation (this feature)

```text
specs/001-plan-memory-map/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md               # created by /speckit.tasks later
```

### Source Code (repository root)

```text
src/
├── core/            # mind-elixir fork glue, node schema extensions
├── ui/              # attribute panel, modals, badges
├── services/        # persistence, export, autosave utilities
├── state/           # lightweight state container/hooks
└── utils/           # helpers (id, validation, formatting)

tests/
├── unit/            # schema, validation, exporters
├── integration/     # save/load flows, keyboard shortcuts
└── contract/        # export format regression (CSV/Word samples)

public/              # static entry, icons
```

**Structure Decision**: Single web app with feature-focused folders under `src/`; no backend folders; documentation lives under `specs/001-plan-memory-map`.

## Complexity Tracking

No constitutional violations identified; table not required.
