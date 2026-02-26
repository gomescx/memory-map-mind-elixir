# Tasks: Suite Launcher and Deployment Restructure

**Feature**: `001-suite-launcher` | **Generated**: 2026-02-26  
**Input**: `specs/001-suite-launcher/` — plan.md, spec.md, data-model.md, research.md, contracts/url-structure.md, quickstart.md  
**Tests**: Manual verification only (per plan.md §Constitution Check VII — standalone HTML exception)

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Can execute in parallel with other [P] tasks in the same phase (different files, no shared state)
- **[Story]**: User story scope label — maps to spec.md user stories
- **No story label**: Setup or cross-cutting infrastructure
- Task sizing: 30–60 min implementation windows

---

## Phase 1: Setup — Directory Structure

**Purpose**: Create the one new directory required before any file moves or content creation can happen.  
**Blocks**: Phase 2 (T-000.2 requires the target directory to exist).

- [X] T-000.1 Create `tools/memory-map/` directory in repository root

  **FR/SC**: AD-001 (plan.md), FR-US2.1  
  **Acceptance Criteria**:  
  - Given the repository root does not have a `tools/memory-map/` path  
  - When `mkdir -p tools/memory-map` is run from the repo root  
  - Then `tools/memory-map/` exists as an empty directory tracked by git  

  **Test Assertions**:  
  ```bash
  test -d tools/memory-map && echo "PASS" || echo "FAIL"
  ```

---

## Phase 2: Foundational — Entry Point Relocation & Build Config

**Purpose**: Relocate the Vite HTML entry point and update build configuration. These two tasks **block all user story verification** — no tool can be built or previewed until both complete.

**⚠️ CRITICAL**: T-000.3 depends on T-000.2 completing first (vite.config.ts must reference the new path).

- [X] T-000.2 Move root `index.html` to `tools/memory-map/index.html` via `git mv` — `tools/memory-map/index.html`

  **FR/SC**: FR-US2.1, AD-001 (plan.md), R-001 (research.md), R-005 (research.md), SC-004  
  **Acceptance Criteria**:  
  - Given `index.html` exists at the repository root  
  - When `git mv index.html tools/memory-map/index.html` is executed  
  - Then `tools/memory-map/index.html` contains the original Memory Map entry HTML (including `<script type="module" src="/src/main.tsx">`) and the root `index.html` no longer exists  

  **Test Assertions**:  
  ```bash
  # File moved
  test -f tools/memory-map/index.html && echo "PASS: file exists" || echo "FAIL: file missing"
  # Root index.html gone
  test ! -f index.html && echo "PASS: root index removed" || echo "FAIL: root index still present"
  # Script tag preserved
  grep -q 'src="/src/main.tsx"' tools/memory-map/index.html && echo "PASS: script ref intact" || echo "FAIL: script ref missing"
  ```

  **Manual Verification**:  
  - Open `tools/memory-map/index.html` in an editor and confirm `<script type="module" src="/src/main.tsx">` is present and unchanged  
  - Run `git status` and confirm the move shows as a rename, not a new file + delete

- [X] T-000.3 Update `vite.config.ts` — functional `defineConfig`, conditional `base`, and `rollupOptions.input` — `vite.config.ts`

  **FR/SC**: FR-US2.1, FR-US2.3, AD-002 (plan.md), R-001 (research.md), R-002 (research.md), data-model.md §Vite Configuration  
  **Changes required**:  
  1. Add `import { resolve } from 'path'` (or reuse existing `path` import)  
  2. Wrap `defineConfig({...})` in `defineConfig(({ command }) => ({...}))`  
  3. Replace `base: '/memory-map-mind-elixir/'` with:  
     ```ts
     base: command === 'serve'
       ? '/tools/memory-map/'
       : '/memory-map-mind-elixir/tools/memory-map/',
     ```
  4. Add to `build.rollupOptions`:  
     ```ts
     input: {
       'memory-map': resolve(__dirname, 'tools/memory-map/index.html'),
     },
     ```  

  **Acceptance Criteria**:  
  - Given `vite.config.ts` is updated as described above  
  - When `npm run build` is executed  
  - Then the build succeeds and `dist/tools/memory-map/index.html` is created  
  - And `dist/tools/memory-map/assets/` contains at least one `.js` and one `.css` file  
  - And no `index.html` is emitted at `dist/` root by the Vite build step (the root `dist/index.html` comes from `public/index.html` in Phase 3)  

  **Test Assertions**:  
  ```bash
  npm run build
  # Memory Map output at new path
  test -f dist/tools/memory-map/index.html && echo "PASS: MM index" || echo "FAIL: MM index missing"
  # Assets present
  ls dist/tools/memory-map/assets/*.js 2>/dev/null | head -1 | xargs test -f && echo "PASS: JS asset" || echo "FAIL: JS asset missing"
  ls dist/tools/memory-map/assets/*.css 2>/dev/null | head -1 | xargs test -f && echo "PASS: CSS asset" || echo "FAIL: CSS asset missing"
  # Base path baked into built HTML
  grep -q '/memory-map-mind-elixir/tools/memory-map/' dist/tools/memory-map/index.html && echo "PASS: base path" || echo "FAIL: base path wrong"
  ```

  **Manual Verification**:  
  - Open `dist/tools/memory-map/index.html` and confirm asset `<script>` tags reference `/memory-map-mind-elixir/tools/memory-map/assets/...`  
  - Run `npm run dev` and confirm Memory Map is reachable at `http://localhost:5173/tools/memory-map/` (not the root)

**Checkpoint**: Foundation complete. Entry point relocated; Vite produces output at `dist/tools/memory-map/`. All user story phases can now begin.

---

## Phase 3: User Story 1 — Discover and Navigate to a Toolkit Tool (P1) 🎯 MVP

**Goal**: Serve a static launcher page at the suite root URL showing the Effectiveness Toolkit name, two active tool links (Memory Map, COER), and making the suite navigable in ≤ 2 clicks from root.

**Independent Test**: Open `http://localhost:4173/memory-map-mind-elixir/` after `npx vite preview`. Page title reads "Effectiveness Toolkit"; at least two clickable links are visible; clicking "Memory Map Action Planner" navigates to `/memory-map-mind-elixir/tools/memory-map/`.

- [X] T-001.1 [US1] Create `public/index.html` — static launcher with suite header and two active tool links — `public/index.html`

  **FR/SC**: FR-US1.1, FR-US1.2, FR-US1.3, FR-US1.5, FR-US1.6, FR-US1.7, SC-001, SC-004, AD-003, data-model.md §Tool Registry  
  **Content requirements**:  
  - `<title>Effectiveness Toolkit</title>`  
  - Visible heading: "Effectiveness Toolkit" (or "PEP Effectiveness Toolkit")  
  - Brief suite description (1–2 sentences)  
  - `<a href="./tools/memory-map/">Memory Map Action Planner</a>` with one-line description: "Visualise priorities as a mind map with planning attributes"  
  - `<a href="./tools/coer/">COER Form</a>` with one-line description: "Define clarity of end result for each initiative"  
  - No `<link>` to external stylesheets; no `<script>` tags of any kind  
  - Inline or embedded `<style>` block for all visual presentation  
  - `class="tool-card"` on active tool container elements (per data-model.md)  

  **Acceptance Criteria**:  
  - Given `public/index.html` has been created with the content above  
  - When `npm run build` completes  
  - Then `dist/index.html` is present and identical to `public/index.html`  
  - And `dist/index.html` contains `"Effectiveness Toolkit"` in both `<title>` and body  
  - And `dist/index.html` contains `href="./tools/memory-map/"` and `href="./tools/coer/"`  
  - And there are no `http://` or `https://` references in `dist/index.html`  
  - When the page is loaded in a browser after network is disabled  
  - Then the page renders without error (no failed network requests)  

  **Test Assertions**:  
  ```bash
  npm run build
  # Launcher exists in dist
  test -f dist/index.html && echo "PASS: launcher in dist" || echo "FAIL: launcher missing"
  # Title present
  grep -q 'Effectiveness Toolkit' dist/index.html && echo "PASS: title" || echo "FAIL: title missing"
  # Active tool links present
  grep -q 'href="./tools/memory-map/"' dist/index.html && echo "PASS: MM link" || echo "FAIL: MM link missing"
  grep -q 'href="./tools/coer/"' dist/index.html && echo "PASS: COER link" || echo "FAIL: COER link missing"
  # No external references (fails if any http/https found)
  grep -qE 'src="https?://|href="https?://' dist/index.html && echo "FAIL: external refs found" || echo "PASS: no external refs"
  ```

  **Manual Verification**:  
  1. Run `npx vite preview` and open `http://localhost:4173/memory-map-mind-elixir/`  
  2. Confirm page title in browser tab reads "Effectiveness Toolkit"  
  3. Confirm two tool cards/links are visible  
  4. Click "Memory Map Action Planner" — confirm navigation to `/memory-map-mind-elixir/tools/memory-map/` and Memory Map app loads  
  5. Navigate back, click "COER Form" — confirm navigation to `/memory-map-mind-elixir/tools/coer/` and COER form loads  
  6. Load once, disconnect network in DevTools, reload — page renders from cache with no console errors

**Checkpoint**: US1 complete. Suite root URL serves the launcher; tool navigation is working.

---

## Phase 4: User Story 2 — Access Memory Map at Its New URL (P2)

**Goal**: The Memory Map app is fully functional at `/tools/memory-map/` — zero regression from its previous root deployment. All existing features (canvas, plan panel, export, shortcuts) operate normally.

**Independent Test**: Navigate directly to `/memory-map-mind-elixir/tools/memory-map/` (bypassing the launcher). Complete the workflow: create a node → open plan panel → set a status → export CSV. Verify no console errors and no 404s.

**Note**: This story is fully delivered by the Phase 2 foundational tasks (T-000.2 + T-000.3). The tasks below are acceptance-verification tasks confirming the relocation succeeded end-to-end.

- [ ] T-002.1 [US2] Verify `tools/memory-map/index.html` entry file integrity — `tools/memory-map/index.html`

  **FR/SC**: FR-US2.2, SC-002, AD-001, R-005  
  **Acceptance Criteria**:  
  - Given `tools/memory-map/index.html` was moved from root via `git mv` (T-000.2)  
  - When the file is inspected  
  - Then it contains `<script type="module" src="/src/main.tsx">` (absolute path, unchanged)  
  - And it contains `<div id="root"></div>` (React mount point, unchanged)  
  - And it has no references to the old root-relative path that would break under `/tools/memory-map/`  

  **Test Assertions**:  
  ```bash
  grep -q '<div id="root">' tools/memory-map/index.html && echo "PASS: root div" || echo "FAIL: root div missing"
  grep -q 'src="/src/main.tsx"' tools/memory-map/index.html && echo "PASS: script ref" || echo "FAIL: script ref wrong"
  # Confirm built output also has root div
  grep -q '<div id="root">' dist/tools/memory-map/index.html && echo "PASS: built root div" || echo "FAIL: built root div missing"
  ```

  **Manual Verification**:  
  1. Run `npx vite preview` and navigate directly to `http://localhost:4173/memory-map-mind-elixir/tools/memory-map/`  
  2. Confirm Memory Map canvas renders (mind-elixir root node visible)  
  3. Create a child node; confirm plan panel opens  
  4. Set Priority, Status, and a date on the node  
  5. Export via CSV; confirm file downloads without error  
  6. Open browser DevTools → Network tab; confirm no 404 responses for any asset  
  7. Press browser back button; confirm no 404 errors

**Checkpoint**: US2 complete. Memory Map is feature-identical at its new URL; zero regression confirmed.

---

## Phase 5: User Story 3 — Access COER Form at Its Designated URL (P3)

**Goal**: The COER standalone HTML form is accessible at `/tools/coer/`, deployed as-is from `public/tools/coer/index.html` with no build processing.

**Independent Test**: Navigate directly to `/memory-map-mind-elixir/tools/coer/` (bypassing the launcher). Confirm the form renders with all fields interactive and no JavaScript errors in the console.

- [ ] T-003.1 [P] [US3] Verify `public/tools/coer/index.html` is present and self-contained — `public/tools/coer/index.html`

  **FR/SC**: FR-US3.1, FR-US3.2, FR-US3.3, SC-003, data-model.md §Validation Rules  
  **Acceptance Criteria**:  
  - Given `public/tools/coer/index.html` exists (pre-existing from constitution v1.3.0 follow-up)  
  - When `npm run build` completes  
  - Then `dist/tools/coer/index.html` is byte-identical to `public/tools/coer/index.html`  
  - And neither the source nor the output file references external URLs in `src` or `href` attributes  

  **Test Assertions**:  
  ```bash
  npm run build
  # File deployed
  test -f dist/tools/coer/index.html && echo "PASS: COER in dist" || echo "FAIL: COER missing"
  # Byte-identical (unchanged by build)
  diff public/tools/coer/index.html dist/tools/coer/index.html && echo "PASS: byte-identical" || echo "FAIL: content modified"
  ```

  **Manual Verification**:  
  1. Run `npx vite preview` and navigate directly to `http://localhost:4173/memory-map-mind-elixir/tools/coer/`  
  2. Confirm the COER form renders with all visible fields and controls  
  3. Interact with at least one form field; confirm it responds correctly  
  4. Open browser DevTools → Console; confirm zero JavaScript errors  
  5. Open DevTools → Network tab; confirm no 404 responses for any asset

**Checkpoint**: US3 complete. COER form is live at its designated URL; deployed as-is without transformation.

---

## Phase 6: User Story 4 — Future Tools Visible as Placeholders (P4)

**Goal**: The launcher page lists three future tools (Strength of Belief, Prioritization/TMM, Impact Map) as non-navigable "coming soon" entries, communicating the full suite vision to stakeholders.

**Independent Test**: Open the launcher page and scroll through the tool list. Confirm three entries exist that are not clickable links and each is labelled "Coming Soon" or equivalent.

- [X] T-004.1 [US4] Add three coming-soon placeholder entries to `public/index.html` — `public/index.html`

  **FR/SC**: FR-US1.4, data-model.md §Tool Registry (rows 3–5)  
  **Content requirements**:  
  - Entry 1: "Strength of Belief" — description: "Assess confidence in achieving each goal"  
  - Entry 2: "Prioritization / TMM" — description: "Rank initiatives using the Time Management Matrix"  
  - Entry 3: "Impact Map" — description: "Map outcomes to deliverables with measurable impact"  
  - Each entry uses `class="tool-card coming-soon"` (per data-model.md)  
  - Each entry has a visible "Coming Soon" label (or equivalent text)  
  - No `<a href>` on any placeholder entry — no hyperlinks whatsoever  
  - Clicking a placeholder element MUST NOT trigger any navigation event  

  **Acceptance Criteria**:  
  - Given US1 launcher (`public/index.html`) has been created (T-001.1)  
  - When the three placeholder entries are added  
  - Then `dist/index.html` contains the text "Strength of Belief", "Prioritization", and "Impact Map"  
  - And none of those three entries contains an `<a href` attribute  
  - And each contains "coming soon" text (case-insensitive)  

  **Test Assertions**:  
  ```bash
  npm run build
  grep -qi 'Strength of Belief' dist/index.html && echo "PASS: SoB" || echo "FAIL: SoB missing"
  grep -qi 'Prioritization' dist/index.html && echo "PASS: TMM" || echo "FAIL: TMM missing"
  grep -qi 'Impact Map' dist/index.html && echo "PASS: IM" || echo "FAIL: IM missing"
  # Verify no href on coming-soon items (check class proximity to href)
  grep -A3 'coming-soon' dist/index.html | grep -v 'href=' && echo "PASS: no links on placeholders" || echo "WARN: review manually"
  ```

  **Manual Verification**:  
  1. Open the launcher in a browser  
  2. Confirm three "coming soon" entries are visible in the tool list  
  3. Confirm each is visually distinct from active tool links (greyed out, non-underlined, or similar)  
  4. Click/tap each placeholder; confirm no navigation or JavaScript error occurs

**Checkpoint**: US4 complete. Full suite vision communicated via launcher placeholders.

---

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: End-to-end verification against spec success criteria and quickstart.md checklist.

- [ ] T-099.1 [P] Run full build and verify `dist/` structure has exactly 3 `index.html` files — `dist/`

  **FR/SC**: SC-004, FR-000.1, data-model.md §Build Output Dictionary  
  **Acceptance Criteria**:  
  - Given all previous tasks are complete  
  - When `npm run build` executes  
  - Then `find dist -name 'index.html' | sort` outputs exactly:  
    ```
    dist/index.html
    dist/tools/coer/index.html
    dist/tools/memory-map/index.html
    ```  
  - And no other `index.html` files exist in `dist/`  

  **Test Assertions**:  
  ```bash
  npm run build
  COUNT=$(find dist -name 'index.html' | wc -l | tr -d ' ')
  [ "$COUNT" = "3" ] && echo "PASS: exactly 3 index.html" || echo "FAIL: found $COUNT"
  find dist -name 'index.html' | sort
  ```

- [ ] T-099.2 Run `npx vite preview` and execute the full quickstart.md verification checklist — manual

  **FR/SC**: SC-001, SC-002, SC-003, SC-004, SC-005, FR-000.2, FR-000.3, contracts/url-structure.md §Verification Checklist  
  **Acceptance Criteria**:  
  - Given the production preview server is running  
  - When each quickstart.md checklist item is executed  
  - Then all items pass:  
    1. `dist/index.html` contains "Effectiveness Toolkit" ✓  
    2. `dist/tools/memory-map/index.html` contains `<div id="root">` ✓  
    3. `dist/tools/coer/index.html` matches `public/tools/coer/index.html` ✓  
    4. `dist/tools/memory-map/assets/` has `.js` and `.css` files ✓  
    5. Launcher page loads at `http://localhost:4173/memory-map-mind-elixir/` ✓  
    6. "Memory Map Action Planner" link navigates to `/memory-map-mind-elixir/tools/memory-map/` ✓  
    7. "COER Form" link navigates to `/memory-map-mind-elixir/tools/coer/` ✓  
    8. Memory Map app is fully functional (create node, add plan, export CSV) ✓  
    9. COER form fields are interactive ✓  
    10. Three "coming soon" placeholders visible, not clickable ✓  

  **Test Assertions**: All 10 checklist items pass without error or deviation.

  **Manual Verification**:  
  ```bash
  npm run build && npx vite preview
  # Navigate to each URL and execute the full quickstart.md checklist manually
  ```

- [ ] T-099.3 [P] Verify `npm run dev` dev server routes per contracts/url-structure.md §Dev Server Routes — manual

  **FR/SC**: R-002 (research.md), contracts/url-structure.md §Dev Server Routes  
  **Acceptance Criteria**:  
  - Given `npm run dev` is running on port 5173  
  - When each dev route is visited  
  - Then:  
    - `http://localhost:5173/` → serves `public/index.html` (launcher page)  
    - `http://localhost:5173/tools/memory-map/` → serves Memory Map app with hot reload  
    - `http://localhost:5173/tools/coer/` → serves COER form static file  

  **Test Assertions** (manual):  
  - Visit each URL above and confirm the correct page loads  
  - Edit a source file and confirm HMR applies at the Memory Map URL

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (T-000.1)
    └── Phase 2 (T-000.2 → T-000.3)          ← blocks US2 verification
            ├── Phase 3 (T-001.1)  [US1]      ← can start in parallel with Phase 2
            ├── Phase 4 (T-002.1)  [US2]      ← depends on Phase 2 complete
            ├── Phase 5 (T-003.1)  [US3]      ← depends on Phase 2 & Phase 3 (build)
            └── Phase 6 (T-004.1)  [US4]      ← depends on Phase 3 (same file)
                    └── Phase 7 (T-099.x)     ← depends on all phases complete
```

### User Story Dependencies

| Story | Phase | Blocks | Depends On | Independent? |
|-------|-------|--------|------------|-------------|
| US1 (P1) | Phase 3 | US4 (same file) | Phase 1+2 for build | ✅ Yes — testable as static HTML before build |
| US2 (P2) | Phase 4 | — | Phase 2 complete | ✅ Yes — bypass launcher to test at direct URL |
| US3 (P3) | Phase 5 | — | Phase 2 complete (for build) | ✅ Yes — bypass launcher to test at direct URL |
| US4 (P4) | Phase 6 | — | Phase 3 (same file) | ✅ Yes — test launcher page independently |

### Within Each Phase

- T-000.2 must complete before T-000.3 (vite.config.ts must reference the moved file)
- T-001.1 must complete before T-004.1 (both write `public/index.html`)
- All Phase 7 tasks require all prior phases complete

### Parallel Opportunities

**Phase 1 → Phase 2**: Sequential (Phase 1 creates directory, Phase 2 uses it).

**Phase 2 → Phase 3**: T-001.1 can begin in parallel with Phase 2 (different files).

**Phase 3 → Phase 4 → Phase 5**: After Phase 2 and Phase 3 complete, T-002.1 and T-003.1 can run in parallel:
```bash
# Parallel within Phase 4+5 (after Phase 2+3 done):
verify_memory_map &   # T-002.1
verify_coer_form &    # T-003.1
wait
```

**Phase 7**: T-099.1 and T-099.3 are marked [P] and can run in parallel.

---

## Suggested MVP Scope

| Scope | Stories | Deliverable |
|-------|---------|-------------|
| **MVP** | US1 + US2 | Root URL serves launcher; Memory Map works at new URL |
| **MVP+** | US1 + US2 + US3 | All three tools accessible via direct URL |
| **Full** | US1 + US2 + US3 + US4 | Full suite vision with placeholders |

> US4 (placeholders) adds content to an already-created file. It can be deferred without affecting any other story.

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 9 |
| Infrastructure tasks (T-000.x) | 3 |
| US1 tasks | 1 |
| US2 tasks | 1 |
| US3 tasks | 1 |
| US4 tasks | 1 |
| Polish tasks (T-099.x) | 3 |
| Parallelizable tasks [P] | 4 |
| Files created | 2 (`public/index.html`, `tools/memory-map/` dir) |
| Files moved | 1 (`index.html` → `tools/memory-map/index.html`) |
| Files modified | 1 (`vite.config.ts`) |
| Files unchanged | All `src/`, `public/tools/coer/`, deploy workflow |
