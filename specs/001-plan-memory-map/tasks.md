---

description: "Task list for Memory Map Action Planner MVP"
---

# Tasks: Memory Map Action Planner MVP

**Input**: Design documents from `/specs/001-plan-memory-map/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include unit/integration/contract checks where they materially reduce risk for each story. Playwright used only for keyboard and recovery flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align tooling with offline-first Vite + TypeScript plan

- [x] T001 Validate required deps (mind-elixir fork, Vite 5, TypeScript 5, Vitest, Playwright) in `package.json`
- [x] T002 Configure TypeScript target/paths for ES2020 + `src/*` aliases in `tsconfig.json`
- [x] T003 [P] Configure Vite for offline SPA (base path, asset inlining) in `vite.config.ts`
- [x] T004 [P] Add lint/format rules consistent with constitution (no telemetry, minimal deps) in `.eslintrc.cjs`
- [x] T005 Add npm scripts for dev, build, unit, and Playwright smoke per quickstart in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, state, and utilities required by all stories

- [x] T006 [P] Define extended node types with `extended.plan` fields in `src/core/types/node.ts`
- [x] T007 [P] Add plan field validation helpers (dates, numbers, enums) in `src/utils/validation/plan.ts`
- [x] T008 Create lightweight state store with selection, history hooks, and plan field setters in `src/state/store.ts`
- [x] T009 [P] Add shared constants for schema version and ID handling in `src/core/constants.ts`
- [x] T010 [P] Implement browser file IO helpers (Blob download, file picker/drag-drop reader) in `src/services/storage/file-io.ts`
- [x] T011 Create reusable alert/toast component for errors/warnings in `src/ui/components/alert.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Visual Mind Map with Planning Attributes (Priority: P1) 🎯 MVP

**Goal**: Extend mind-elixir nodes with six optional planning attributes and editable UI while keeping core interactions intact

**Independent Test**: Create map, add nodes via keyboard, open side panel/hotkey, edit all planning fields, save, and see badges/tooltip summaries on selection/hover

### Implementation for User Story 1

- [X] T012 [P] [US1] Extend mind-elixir node adapter to read/write `extended.plan` defaults in `src/core/node-adapter.ts`
- [X] T013 [P] [US1] Implement plan form schema + validation messages in `src/ui/forms/plan-form.ts`
- [X] T014 [US1] Build planning attribute side panel component with inputs for all six fields in `src/ui/panels/plan-panel.tsx`
- [X] T015 [US1] Wire selection + hotkey to open/close panel without breaking existing shortcuts in `src/ui/shortcuts/plan-panel.ts`
- [X] T016 [P] [US1] Render inline/badge summary for nodes with plan data in `src/ui/badges/node-plan-badges.tsx`
- [X] T017 [P] [US1] Add hover/selection tooltip summarizing plan fields in `src/ui/tooltips/node-plan-tooltip.tsx`
- [X] T018 [US1] Connect plan edit actions to state store setters and node updates in `src/state/store.ts`
- [X] T019 [P] [US1] Add Vitest unit tests for node adapter + plan form validation in `tests/unit/core/node-plan.spec.ts`

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Save and Load Mind Maps as Offline Files (Priority: P1)

**Goal**: Save/load JSON files with full structure and planning attributes, offline-only

**Independent Test**: Create map with attributes, save to JSON via UI/hotkey, reload via picker or drag-drop, verify data fidelity and clear error on invalid file

### Implementation for User Story 2

[X] T021 [US2] Add save action + UI trigger/hotkey using file IO helper in `src/ui/actions/save-map.ts`. Use root node label to default filename e.g. `rootname-memorymap-dd-mm-yyyy.json`
[X] T022 [US2] Add load action supporting picker + drag-drop with schema validation in `src/ui/actions/load-map.ts`
[X] T023 [US2] Surface load/save errors and warnings through alert component in `src/ui/components/alert.tsx`

---

## Phase 5: User Story 3 - Export Mind Map to Tabular Action Plan (Priority: P1)

**Goal**: Export flattened map to CSV and Word-like (HTML table) with stable IDs and parent path traceability

**Independent Test**: Create multi-level map with attributes, export CSV and HTML table, verify columns/ordering/IDs, open CSV in spreadsheet without errors

### Implementation for User Story 3

- [X] T026 [P] [US3] Finalize tree flattening to `ExportRow` with parentPath in `src/services/export/flatten.ts`
- [X] T027 [P] [US3] Build CSV export generator using flatten output in `src/services/export/csv.ts`
- [X] T028 [US3] Build HTML table export (Word-friendly) with same columns in `src/services/export/html-table.ts`
- [X] T029 [US3] Add export UI action/hotkey (CSV + HTML table) in `src/ui/actions/export-map.ts`
- [X] T030 [P] [US3] Add contract regression test against `contracts/export-openapi.yaml` samples in `tests/contract/export-openapi.spec.ts`
- [X] T031 [P] [US3] Add integration test for multi-level export verifying stable IDs in `tests/integration/export-flow.spec.ts`

**Checkpoint**: User Stories 1–3 (all P1) independently functional

---

## Phase 6: User Story 4 - Preserve Mind-Elixir Keyboard Shortcuts and Interaction Model (Priority: P2)

**Goal**: Ensure default keyboard shortcuts and layout behavior remain intact alongside new features

**Independent Test**: Keyboard-only session can add sibling/child, delete, navigate arrows, undo/redo without regressions

### Implementation for User Story 4

- [X] T032 [P] [US4] Lock default shortcut map and upstream key handling compatibility in `src/core/shortcuts.ts`
- [X] T033 [US4] Wire undo/redo/delete/navigation handlers through state/history layer in `src/state/history.ts`
- [X] T034 [P] [US4] Add Playwright smoke test for keyboard-only map editing in `tests/integration/keyboard-shortcuts.spec.ts`

**Checkpoint**: User Story 4 independently functional

---

## Phase 7: User Story 5 - Visual Indicators for Planning Status (Priority: P2)

**Goal**: Show badges/icons for completed, overdue, assigned, and time-tracked nodes without cluttering map

**Independent Test**: Nodes with various statuses show correct badge/warning/assignee indicators; hovering reveals time tooltip; nodes without plan data remain unchanged

### Implementation for User Story 5

- [X] T035 [P] [US5] Derive status/overdue/assignee flags from plan data in `src/utils/plan-status.ts`
- [X] T036 [US5] Render badges/icons on node view using derived flags in `src/ui/badges/node-plan-badges.tsx`
- [X] T037 [P] [US5] Add tooltip content for invested/elapsed time and dates in `src/ui/tooltips/node-plan-tooltip.tsx`
- [X] T038 [P] [US5] Add Vitest snapshot/logic tests for badge and overdue calculations in `tests/unit/ui/node-plan-badges.spec.ts`

**Checkpoint**: User Story 5 independently functional

---

## Phase 8: User Story 6 - Optional LocalStorage Auto-Save for Convenience (Priority: P3)

**Goal**: Opt-in autosave to localStorage with recovery prompt and graceful degradation when unavailable

**Independent Test**: Enable autosave, create map, close tab, reopen and recover session; ensure opt-out clears stored data; handle private mode gracefully

### Implementation for User Story 6

- [ ] T039 [P] [US6] Add autosave settings toggle and storage availability guard in `src/state/autosave/settings.ts`
- [ ] T040 [US6] Implement debounced autosave writer using serializer in `src/services/storage/autosave.ts`
- [ ] T041 [US6] Add recovery prompt modal + start-fresh option in `src/ui/modals/recover-session.tsx`
- [ ] T042 [P] [US6] Add integration test for autosave/recover flow in `tests/integration/autosave-recover.spec.ts`

**Checkpoint**: User Story 6 independently functional

---

## User Story 7: UX Layout Adjustments

- [X] T046 [P] [US7] Make `Planning Attributes Sidepane` sit outside canvas so it doesn't cover canvas zoom commands
- [X] T047 [P] [US7] Remove all tooltips below every attribute on `Planning Attributes Sidepane` 
- [X] T048 [P] [US7] Remove Attribute Status value `-- None --`, default value to `Not Started` when creating the node
- [X] T049 [P] [US7] Expand Header to 2 lines, first line has icons, 2nd line has shortcuts


---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Performance, docs, and validation across stories

- [ ] T043 [P] Add 200-node export performance check script and notes in `tests/perf/export-benchmark.ts`
- [ ] T044 [P] Update quickstart with save/load/export/autosave steps in `specs/001-plan-memory-map/quickstart.md`
- [ ] T045 Refresh repo README with offline usage, keyboard shortcuts, and export notes in `README.md`

---

## Dependencies & Execution Order

- Setup (Phase 1) → Foundational (Phase 2) → Stories (Phases 3–8) → Polish (Phase 9).
- User Stories 1, 2, 3 are all P1 and can proceed after Phase 2; they remain independently testable but should avoid conflicting UI entry points.
- User Story 4 depends on Phase 2 + US1 groundwork (shortcut-safe UI hooks) to verify no regressions.
- User Story 5 depends on US1 data fields being available; otherwise independent of save/export flows.
- User Story 6 depends on US2 serializer to persist/recover snapshots.

### User Story Completion Order (graph)

- US1 (P1) → enables US5 visuals
- US2 (P1) → enables US6 autosave
- US3 (P1) independent of US1/US2 but uses shared node data
- US4 (P2) depends on foundational + US1 shortcut coexistence check
- US5 (P2) depends on US1 plan data availability
- US6 (P3) depends on US2 serialization

---

## Parallel Execution Examples

- **US1**: T012, T013, T016, T017, T019 can run in parallel; gate UI wiring (T014–T015) until form/schema ready.
- **US2**: T020, T024, T025 parallel; T021–T023 sequence after serializer exists.
- **US3**: T026, T027, T030, T031 parallel; T028–T029 follow flatten output contract.
- **US4**: T032 and T034 parallel; T033 after shortcut map defined.
- **US5**: T035, T037, T038 parallel; T036 after flags exist.
- **US6**: T039 and T042 parallel; T040–T041 follow settings/serializer availability.

---

## Implementation Strategy

- **MVP First**: Complete Phases 1–3 to deliver editable planning attributes with badges/tooltip, validating core value.
- **Incremental Delivery**: Add US2 (save/load) and US3 (export) next for offline trust; then US4/US5 usability; finish with US6 convenience.
- **Quality Gates**: Run Vitest unit suites per story completion; run Playwright for keyboard and autosave scenarios; re-check offline/no-network via DevTools.
- **Stability**: Keep node IDs stable across serializers/exports before adding visuals; prefer hooks/context over new dependencies to maintain simplicity.
