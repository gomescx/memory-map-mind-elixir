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

## User Story 8: Table View for Memory Map with Depth Filtering (Priority: P2)

**Goal**: Enable users to view, filter, reorder, and edit nodes in table format synchronized with mindmap view

**Independent Test**: User can switch views, filter by depth, drag-drop reorder, inline edit attributes, and see all changes reflected bidirectionally without data loss

---

### Implementation for User Story 8

- [X] T050 [P] [US8] Create table view component structure with columns for sequence, name, attributes, depth in `src/ui/views/table-view.tsx`

**Acceptance Criteria**:
- Given mindmap data with 10 nodes including custom planning attributes
- When table view component is rendered
- Then displays table with columns: Sequence, Name, Status, Priority, Due Date, Assignee, Est. Hours, Inv. Hours, Depth
- And rows show all 10 nodes in depth-first traversal order
- And each cell displays correct data from node model (or "--" for empty values)

**Tests Required**:
- [X] Unit: `test_table_renders_with_correct_columns()` in `tests/unit/ui/table-view.spec.ts`
- [X] Unit: `test_table_rows_match_node_data()` in `tests/unit/ui/table-view.spec.ts`
- [X] Integration: `test_table_displays_all_nodes_from_state()` in `tests/integration/table-view.spec.ts`

---

- [X] T051 [P] [US8] Add view toggle button (Mindmap/Table) to header with state persistence in `src/ui/controls/view-toggle.tsx`

**Acceptance Criteria**:
- Given user is in mindmap view
- When user clicks "Table View" toggle button
- Then view switches to table view rendering all nodes
- And toggle button updates to show "Mindmap View" label
- And view state persists in session (survives toggling back and forth)

**Tests Required**:
- [ ] Unit: `test_toggle_button_switches_views()` in `tests/unit/ui/view-toggle.spec.ts`
- [ ] Integration: `test_toggle_preserves_data()` in `tests/integration/view-toggle.spec.ts`

---

- [X] T052 [US8] Implement depth filtering dropdown with "All, 1, 2, 3, 4" options in `src/ui/controls/depth-filter.tsx`

**Acceptance Criteria**:
- Given table view with nodes at depths 1, 2, and 3
- When user selects "Depth 2" from dropdown
- Then table displays only depth-2 nodes
- And sequence numbers remain consistent with full node set (not renumbered 1, 2, 3...)
- And depth column shows "2" for all visible rows

**Tests Required**:
- [ ] Unit: `test_depth_filter_reduces_visible_rows()` in `tests/unit/ui/depth-filter.spec.ts`
- [ ] Unit: `test_depth_filter_preserves_sequence_numbers()` in `tests/unit/ui/depth-filter.spec.ts`

---

- [ ] T053 [P] [US8] Add depth-first traversal utility to flatten tree by depth level in `src/utils/tree/depth-traversal.ts`

**Acceptance Criteria**:
- Given tree structure with nodes at multiple depths
- When `flattenByDepth(rootNode, depthFilter)` is called with depthFilter=2
- Then returns flat array of only depth-2 nodes in depth-first order
- And each node includes computed depth property
- And maintains parent-child relationship metadata for sequence calculations

**Tests Required**:
- [ ] Unit: `test_flatten_by_depth_filters_correctly()` in `tests/unit/utils/depth-traversal.spec.ts`
- [ ] Unit: `test_flatten_maintains_depth_first_order()` in `tests/unit/utils/depth-traversal.spec.ts`

---

- [ ] T054 [US8] Implement drag-drop row reordering using drag-and-drop library (e.g., dnd-kit) in `src/ui/views/table-view.tsx`

**Acceptance Criteria**:
- Given table with 5 sibling rows A, B, C, D, E
- When user drags row C to position between A and B
- Then table updates to show A, C, B, D, E
- And sequence numbers recalculate: A=1, C=2, B=3, D=4, E=5
- And underlying node sequence in data model updates
- And dragging provides visual feedback (ghost row, drop indicator)

**Tests Required**:
- [ ] Integration: `test_drag_drop_reorders_siblings()` in `tests/integration/table-drag-drop.spec.ts`
- [ ] Integration: `test_reorder_updates_data_model()` in `tests/integration/table-drag-drop.spec.ts`

---

- [ ] T055 [US8] Implement updateNodeSequence() function to persist reorder in state in `src/state/tree/mutations.ts`

**Acceptance Criteria**:
- Given node C currently at position 3 among siblings
- When `updateNodeSequence(nodeId, newPosition=1)` is called
- Then node C moves to first position in parent's children array
- And all sibling positions recalculate
- And state change triggers reactive update in both views

**Tests Required**:
- [ ] Unit: `test_update_node_sequence_reorders_siblings()` in `tests/unit/state/mutations.spec.ts`
- [ ] Unit: `test_sequence_change_emits_state_update()` in `tests/unit/state/mutations.spec.ts`

---

- [ ] T056 [P] [US8] Implement inline editing for text cells (Name, Assignee) with validation in `src/ui/table/editable-text-cell.tsx`

**Acceptance Criteria**:
- Given table cell displaying node name "Research"
- When user double-clicks or presses Enter on cell
- Then cell becomes editable text input with current value
- When user changes text to "User Research" and presses Enter (or blurs)
- Then cell saves new value to data model and exits edit mode
- When user presses Escape
- Then cell exits edit mode without saving changes
- And validation enforces max 200 chars for Name field

**Tests Required**:
- [ ] Unit: `test_editable_cell_saves_on_enter()` in `tests/unit/ui/editable-cell.spec.ts`
- [ ] Unit: `test_editable_cell_cancels_on_escape()` in `tests/unit/ui/editable-cell.spec.ts`
- [ ] Unit: `test_name_validation_enforces_max_length()` in `tests/unit/ui/editable-cell.spec.ts`

---

- [ ] T057 [P] [US8] Implement inline editing for dropdown cells (Status, Priority) in `src/ui/table/editable-select-cell.tsx`

**Acceptance Criteria**:
- Given table cell displaying Status "Not Started"
- When user clicks on cell
- Then cell shows dropdown with options: Not Started, In Progress, Completed, Blocked, Deferred
- When user selects "In Progress"
- Then cell saves new value and exits edit mode
- And dropdown closes
- And change immediately visible in table and mindmap

**Tests Required**:
- [ ] Unit: `test_select_cell_saves_on_selection()` in `tests/unit/ui/editable-select-cell.spec.ts`
- [ ] Integration: `test_status_change_updates_both_views()` in `tests/integration/table-edit-sync.spec.ts`

---

- [ ] T058 [P] [US8] Implement inline editing for date cells (Due Date) with date picker in `src/ui/table/editable-date-cell.tsx`

**Acceptance Criteria**:
- Given table cell displaying empty due date
- When user clicks on cell
- Then date picker modal/dropdown opens
- When user selects date 2026-03-15
- Then cell displays "2026-03-15" (formatted)
- And value saves to data model
- And date becomes visible in mindmap hover tooltip

**Tests Required**:
- [ ] Unit: `test_date_cell_opens_picker_on_click()` in `tests/unit/ui/editable-date-cell.spec.ts`
- [ ] Unit: `test_date_cell_saves_selected_date()` in `tests/unit/ui/editable-date-cell.spec.ts`

---

- [ ] T059 [P] [US8] Implement inline editing for numeric cells (Est. Hours, Inv. Hours) with validation in `src/ui/table/editable-number-cell.tsx`

**Acceptance Criteria**:
- Given table cell displaying Estimated Hours = 10
- When user clicks and edits to "abc" (non-numeric)
- Then inline validation error appears "Must be a number"
- And value does not save
- And cell reverts to previous value (10) on blur
- When user edits to "40" and presses Enter
- Then validation passes and value saves as 40
- And accepts range 0-9999

**Tests Required**:
- [ ] Unit: `test_number_cell_validates_numeric_input()` in `tests/unit/ui/editable-number-cell.spec.ts`
- [ ] Unit: `test_number_cell_rejects_invalid_input()` in `tests/unit/ui/editable-number-cell.spec.ts`
- [ ] Unit: `test_number_cell_enforces_range()` in `tests/unit/ui/editable-number-cell.spec.ts`

---

- [ ] T060 [US8] Wire table cell edits to state mutations (updateNodeAttribute) in `src/state/tree/mutations.ts`

**Acceptance Criteria**:
- Given any editable cell in table view
- When user completes edit (Enter, blur, select)
- Then `updateNodeAttribute(nodeId, attributeName, newValue)` is called
- And state update propagates to both table and mindmap views
- And changes are captured by autosave (if US6 enabled)

**Tests Required**:
- [ ] Integration: `test_cell_edit_calls_update_mutation()` in `tests/integration/table-edit-sync.spec.ts`
- [ ] Integration: `test_edit_syncs_to_mindmap_immediately()` in `tests/integration/table-edit-sync.spec.ts`

---

- [ ] T061 [US8] Add reactive state subscription to table view for mindmap changes in `src/ui/views/table-view.tsx`

**Acceptance Criteria**:
- Given table view is currently displayed
- When user toggles to mindmap and edits node name
- And toggles back to table view
- Then table immediately shows updated name without manual refresh
- And uses reactive state listener (no polling)

**Tests Required**:
- [ ] Integration: `test_table_updates_when_mindmap_changes()` in `tests/integration/bidirectional-sync.spec.ts`

---

- [ ] T062 [P] [US8] Add empty state handling for table (no nodes, no nodes at depth) in `src/ui/views/table-view.tsx`

**Acceptance Criteria**:
- Given map has only root node (no children)
- When user switches to table view
- Then table shows empty state message "No nodes to display. Add nodes in mindmap view."
- Given map has nodes at depth 1 and 2 only
- When user filters to Depth 3
- Then table shows "No nodes at this depth level"

**Tests Required**:
- [ ] Unit: `test_table_shows_empty_state_when_no_nodes()` in `tests/unit/ui/table-view.spec.ts`
- [ ] Unit: `test_table_shows_no_results_for_empty_filter()` in `tests/unit/ui/table-view.spec.ts`

---

- [ ] T063 [P] [US8] Add Playwright integration test for complete table workflow in `tests/integration/table-view-e2e.spec.ts`

**Acceptance Criteria**:
- Test creates map with 10 nodes across 3 depths
- Switches to table view
- Filters to Depth 2
- Drags row to reorder
- Edits Status and Due Date inline
- Switches back to mindmap
- Verifies all changes persist in mindmap view
- Test passes without manual intervention

**Tests Required**:
- [ ] Integration: `test_complete_table_workflow()` in `tests/integration/table-view-e2e.spec.ts`

---

**Checkpoint**: User Story 8 independently functional - table view provides overview, filtering, reordering, and inline editing fully synchronized with mindmap view

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
