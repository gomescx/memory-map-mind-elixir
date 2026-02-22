# Tasks: COER Form (Clarity of End Result)

**Feature**: `001-coer-form` | **Branch**: `001-coer-form` | **Date**: 2026-02-22  
**Input**: `specs/001-coer-form/` — plan.md, spec.md, data-model.md, contracts/project-file-schema.md, research.md, quickstart.md  
**Tech Stack**: Vanilla JavaScript (ES2020), HTML5, CSS3 — zero build tooling, zero dependencies  
**Delivery**: `tools/coer/index.html` — single standalone HTML file  
**Tests**: Manual test scenarios only (per Constitution §VII — standalone HTML tools). No automated test tasks included.

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Task can execute in parallel with other [P] tasks in the same phase (different sections of the same file — coordinate to avoid conflicts)
- **[US1/US2/US3]**: User story this task belongs to
- Task IDs: `T-000.N` = infrastructure/setup | `T-001.N` = US1 | `T-002.N` = US2 | `T-003.N` = US3 | `T-004.N` = polish

---

## Phase 1: Setup

**Purpose**: Create the repository structure and skeleton files. No user-visible behaviour yet.

- [x] T-000.01 Create directory `tools/coer/` and skeleton file `tools/coer/index.html` with valid HTML5 boilerplate (doctype, meta charset, viewport, title "COER — Clarity of End Result", empty `<body>`)

  > **Source**: plan.md §Project Structure  
  > **AC**:  
  > - **Given** the repo root, **When** `tools/coer/index.html` is opened in Chrome/Safari/Firefox/Edge, **Then** the page loads without errors (DevTools console clean) and the title bar shows "COER — Clarity of End Result"  
  > **Test Assertions**:  
  > - File exists at `tools/coer/index.html`  
  > - HTML5 doctype present  
  > - `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present  
  > - Page loads with no console errors in all 4 target browsers  
  > **Manual Verification**: Double-click `tools/coer/index.html` in Finder → opens in default browser → blank page with correct title, zero console errors

- [x] T-000.02 Create `tests/manual/coer-test-scenarios.md` with the 9 validation checks from quickstart.md §7, each formatted as a test scenario with Status: `[ ] PENDING`

  > **Source**: Constitution §VII Testing Standards; quickstart.md §7 Validation Checks  
  > **AC**:  
  > - **Given** the file exists, **When** compared against quickstart.md §7, **Then** all 9 validation checks are present as distinct, numbered test scenarios  
  > **Test Assertions**:  
  > - File exists at `tests/manual/coer-test-scenarios.md`  
  > - Contains exactly 9 numbered test scenarios  
  > - Each scenario has a Status field and Steps field  
  > **Manual Verification**: Open file in editor → count 9 scenarios → verify each maps to a quickstart.md check

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL user story phases depend on. No user story work begins until this phase is complete.

**⚠️ CRITICAL**: Phase 3, 4, and 5 cannot start until T-000.03 through T-000.06 are complete.

- [x] T-000.03 Implement `formState` plain JS object and `renderForm()` function in `tools/coer/index.html` — `formState` holds all fields at defaults; `renderForm()` projects `formState` to DOM

  > **Source**: research.md §R7 (State Management); data-model.md §COER  
  > **AC**:  
  > - **Given** the page loads, **When** the JS initialises, **Then** `formState` exists with fields: `initiativeName: ""`, `specificResults: []`, `reason: ""`, `corporateContribution: ""`, `consequencesAchieving: []`, `consequencesNotAchieving: []`, `startingPoint: ""`, `stakeholders: []`, `confidencePercent: ""`, `obstacles: []`  
  > - **Given** `renderForm()` is called, **When** `formState` has data, **Then** all DOM inputs reflect the state values  
  > **Test Assertions**:  
  > - `typeof formState === "object"` and all 10 keys present with correct types  
  > - After setting `formState.reason = "test"` and calling `renderForm()`, the Q3 textarea value equals `"test"`  
  > **Manual Verification**: Open DevTools Console → type `formState` → inspect all 10 keys and their default values

- [x] T-000.04 Implement `serializeToProjectFile()` and `deserializeFromProjectFile()` utility functions in `tools/coer/index.html` — serialize produces the `effectivenessToolkit` JSON envelope; deserialize extracts the first initiative's `coer` section into `formState`

  > **Source**: FR-US1.08, FR-US1.09, FR-US1.10; data-model.md §ProjectFile; contracts/project-file-schema.md §Contract 1  
  > **AC**:  
  > - **Given** a populated `formState`, **When** `serializeToProjectFile()` is called, **Then** the returned object has: `effectivenessToolkit.version === "1.0"`, `effectivenessToolkit.lastModified` (valid ISO 8601), `effectivenessToolkit.initiatives` (array with 1 element), and `initiatives[0].coer.lastModified` set to current time  
  > - **Given** the canonical JSON example from data-model.md, **When** `deserializeFromProjectFile(json)` is called, **Then** `formState.initiativeName` equals `"Improve client onboarding process"` and `formState.obstacles` equals the 3-element array  
  > - **Given** `serializeToProjectFile()` output matches `data-model.md §Canonical JSON Example` structure  
  > **Test Assertions**:  
  > - `serializeToProjectFile()` output passes `JSON.parse` without error  
  > - `output.effectivenessToolkit.version === "1.0"`  
  > - `output.effectivenessToolkit.initiatives[0].coer.lastModified` matches `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/`  
  > - `deserializeFromProjectFile(canonicalExample).obstacles.length === 3`  
  > **Manual Verification**: DevTools Console → call `serializeToProjectFile()` → inspect output structure against data-model.md canonical JSON

- [x] T-000.05 Implement `generateUUID()` function (UUID v4) in `tools/coer/index.html` — used when creating a new initiative with no loaded file

  > **Source**: data-model.md §Initiative.id ("UUID v4, generated on creation")  
  > **AC**:  
  > - **Given** a new session with no loaded file, **When** `generateUUID()` is called, **Then** it returns a string matching UUID v4 format  
  > **Test Assertions**:  
  > - Output matches regex `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`  
  > - Two successive calls return different values  
  > **Manual Verification**: DevTools Console → call `generateUUID()` five times → each result is unique and matches UUID v4 pattern

- [x] T-000.06 Implement `saveFileToDownload(content, filename, mimeType)` and `loadFileFromInput(callback)` utility functions in `tools/coer/index.html` — save via Blob + hidden `<a download>`; load via `<input type="file">` + FileReader

  > **Source**: research.md §R2 (File Save/Load Strategy); FR-US1.11, FR-US2.01  
  > **AC**:  
  > - **Given** a JSON string and filename, **When** `saveFileToDownload(json, "project.json", "application/json")` is called, **Then** a file download is triggered in the browser (Download bar appears)  
  > - **Given** a hidden `<input type="file" accept=".json">`, **When** the user selects a JSON file, **Then** the callback receives the file content as a string  
  > - **Given** `file://` protocol (offline), **When** both utilities are used, **Then** neither throws a security error  
  > **Test Assertions**:  
  > - `saveFileToDownload` creates a temporary `<a>` element and clicks it (verify via DOM observation)  
  > - `loadFileFromInput` callback is invoked with a non-empty string after file selection  
  > - No CORS or mixed-content errors in DevTools when run from `file://`  
  > **Manual Verification**: DevTools Console → call `saveFileToDownload('{"test":1}', "test.json", "application/json")` → downloads file → verify content; then call load utility and pick a JSON file → verify callback fires

**Checkpoint**: Foundation complete — all US1/US2/US3 phases can now begin

---

## Phase 3: User Story 1 — Fill In and Save a New COER (Priority: P1) 🎯 MVP

**Goal**: A user can open the tool, fill in all 9 COER questions, and save a valid project file. This story alone is the shippable MVP.

**Independent Test**: Open `tools/coer/index.html` in a browser, fill in all 9 questions, click Save, open the downloaded JSON — all answers are present in the correct envelope structure with a valid `lastModified` timestamp.

- [x] T-001.01 [US1] Implement Q1 initiative name — single-line `<input type="text">` for `formState.initiativeName` in `tools/coer/index.html`

  > **Source**: FR-US1.02; spec.md US1 Acceptance Scenario 1  
  > **AC**:  
  > - **Given** the form is rendered, **When** the user types `"My Initiative / Test 123!"` in Q1, **Then** the input accepts the characters with no format validation and no error message  
  > - **Given** Q1 has a value, **When** `readFormStateFromDOM()` is called before save, **Then** `formState.initiativeName` equals the exact typed string  
  > **Test Assertions**:  
  > - Q1 input accepts special characters: `/`, `!`, `(`, `)`, `&`, `'`  
  > - Q1 value persists in DOM after typing (no auto-clear)  
  > - `formState.initiativeName` matches Q1 input value after `readFormStateFromDOM()`  
  > **Manual Verification**: Type "Improve Onboarding (Q1 test / 2026)" → tab away → inspect `formState.initiativeName` in console → matches typed value exactly

- [x] T-001.02 [P] [US1] Implement Q3, Q4, Q6 as `<textarea>` elements for `formState.reason`, `formState.corporateContribution`, `formState.startingPoint` in `tools/coer/index.html`

  > **Source**: FR-US1.04; spec.md §Requirements FR-US1.04  
  > **AC**:  
  > - **Given** each textarea (Q3, Q4, Q6), **When** the user enters multi-line text with Enter key, **Then** line breaks are preserved in the DOM value  
  > - **Given** text with line breaks typed in Q3, **When** saved and reloaded, **Then** line breaks are present in the restored value  
  > **Test Assertions**:  
  > - `textarea.value` includes `\n` characters after Enter key press  
  > - Content of each textarea round-trips through serialize/deserialize without change  
  > **Manual Verification**: Type 3 lines (Enter between each) in Q3 → save → load → Q3 shows same 3 lines

- [x] T-001.03 [P] [US1] Implement Q2 (specific results) and Q7 (stakeholders) as dynamic bullet list components with add/remove in `tools/coer/index.html`

  > **Source**: FR-US1.03; spec.md US1 Acceptance Scenario 2; research.md §R5  
  > **AC**:  
  > - **Given** an empty Q2 list, **When** the user clicks "+ Add item", **Then** a new text input row appears in the list and focus moves to it  
  > - **Given** a Q2 list with 3 items, **When** the user clicks "Remove" on the second item, **Then** only the second item is deleted and items 1 and 3 remain in order  
  > - **Given** all items removed from Q2, **When** rendered, **Then** the list container remains visible with an "+ Add item" button (not collapsed or hidden)  
  > - **Given** Q2/Q7 with HTML special characters in an item text, **When** rendered via `innerHTML`, **Then** characters are escaped (no XSS execution)  
  > **Test Assertions**:  
  > - After "Add item", `formState.specificResults.length` increases by 1  
  > - After "Remove" on item at index 1 of 3, `formState.specificResults.length === 2`  
  > - After removing all items, "+ Add item" button is still visible (`display !== "none"`)  
  > - Item containing `<b>bold</b>` renders as literal text, not as HTML  
  > **Manual Verification**: Add 3 items to Q2 ("R1", "R2", "R3") → remove "R2" → verify "R1" and "R3" remain → remove both remaining → verify "+ Add item" still present

- [x] T-001.04 [US1] Implement Q5 dual-list component — two independent dynamic bullet lists "Achieving" and "Not Achieving" for `formState.consequencesAchieving` and `formState.consequencesNotAchieving` in `tools/coer/index.html`

  > **Source**: FR-US1.05; spec.md US1 Acceptance Scenario 3  
  > **AC**:  
  > - **Given** Q5, **When** rendered, **Then** two clearly labeled sections appear: "Achieving" and "Not Achieving", each with its own "+ Add item" button  
  > - **Given** the "Achieving" list has 1 item, **When** the user adds an item to "Not Achieving", **Then** `formState.consequencesAchieving.length` remains 1 and `formState.consequencesNotAchieving.length` becomes 1  
  > - **Given** an item removed from "Achieving", **When** done, **Then** "Not Achieving" list is unaffected  
  > **Test Assertions**:  
  > - Two distinct list containers present in DOM with labels "Achieving" and "Not Achieving"  
  > - `formState.consequencesAchieving` and `formState.consequencesNotAchieving` are independent arrays  
  > - Adding to one list does not change the other array's length  
  > **Manual Verification**: Add "Benefit 1" to Achieving, "Risk 1" to Not Achieving → remove "Benefit 1" → "Risk 1" unchanged → inspect `formState` in console → confirms two separate arrays

- [x] T-001.05 [P] [US1] Implement Q8 confidence percent as a single-line `<input type="text">` for `formState.confidencePercent` in `tools/coer/index.html`

  > **Source**: FR-US1.06; spec.md §Key Entities ("stored as text per agreed data format")  
  > **AC**:  
  > - **Given** Q8, **When** the user types `"high confidence (about 70)"`, **Then** the full string is accepted with no numeric validation error and no type coercion  
  > - **Given** Q8 with value `"65"`, **When** serialized, **Then** `coer.confidencePercent === "65"` (string, not number `65`)  
  > **Test Assertions**:  
  > - Q8 input accepts any string including non-numeric characters  
  > - `typeof formState.confidencePercent === "string"` after any input  
  > - Serialized JSON contains `"confidencePercent": "65"` not `"confidencePercent": 65`  
  > **Manual Verification**: Type "~70%" → inspect `formState.confidencePercent` in console → value is string `"~70%"`

- [x] T-001.06 [US1] Implement Q9 obstacles as a dynamic bullet list where each item is stored as a separate string in `formState.obstacles` in `tools/coer/index.html`

  > **Source**: FR-US1.07; spec.md US1 Acceptance Scenario 4  
  > **AC**:  
  > - **Given** Q9 with three obstacle entries, **When** saved, **Then** the serialized JSON has `coer.obstacles` as an array of 3 separate strings (not a single concatenated string)  
  > - **Given** Q9 with an empty list, **When** saved, **Then** `coer.obstacles === []` (empty array, not `null`, not absent)  
  > **Test Assertions**:  
  > - After adding "IT backlog", "No budget", "Ops resistance" to Q9, `formState.obstacles.length === 3`  
  > - `formState.obstacles[1] === "No budget"` (not a substring of a combined string)  
  > - Empty Q9 produces `"obstacles": []` in serialized JSON  
  > **Manual Verification**: Add 3 obstacles → Save → open JSON in text editor → `obstacles` key has array of 3 strings → delete all items → Save → `obstacles` key has `[]`

- [x] T-001.07 [US1] Implement the Save button — read DOM into `formState`, call `serializeToProjectFile()`, download via `saveFileToDownload()` in `tools/coer/index.html`

  > **Source**: FR-US1.08, FR-US1.09, FR-US1.10, FR-US1.11; spec.md US1 Acceptance Scenarios 5–6; SC-US1.01, SC-US1.02  
  > **AC**:  
  > - **Given** Q1 is filled and some answers entered, **When** the user clicks Save, **Then** a `.json` file download is triggered (Download bar/prompt appears)  
  > - **Given** the downloaded file, **When** opened in a text editor, **Then** it has structure: `{ "effectivenessToolkit": { "version": "1.0", "lastModified": "<ISO 8601>", "initiatives": [{ "id": "<UUID v4>", "name": "<Q1 value>", "coer": { "lastModified": "<ISO 8601>", ... } }] } }`  
  > - **Given** `coer.lastModified`, **When** checked, **Then** it is a valid ISO 8601 string and equals approximately `new Date().toISOString()` at time of save (within 5 seconds)  
  > - **Given** a saved file, **When** loaded back into the tool (via Load), **Then** all 9 question answers are restored exactly — no truncation, no ordering change in arrays  
  > **Test Assertions**:  
  > - Downloaded file is valid JSON (`JSON.parse` succeeds)  
  > - `json.effectivenessToolkit.version === "1.0"`  
  > - `json.effectivenessToolkit.initiatives[0].name === <Q1 value>`  
  > - `json.effectivenessToolkit.initiatives[0].coer.specificResults` is an array matching Q2 entries  
  > - `json.effectivenessToolkit.initiatives[0].coer.obstacles` preserves all Q9 entries as individual strings  
  > - `lastModified` matches `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/`  
  > **Manual Verification**: Fill all 9 questions → click Save → open JSON in VS Code → validate structure against data-model.md canonical example → load file back in tool → compare every field with originally entered values

- [x] T-001.08 [P] [US1] Implement baseline CSS — page layout, toolbar (Save/Load/Print/Export buttons), form layout (question sections, label typography), bullet list controls — all inline in `tools/coer/index.html`

  > **Source**: SC-US1.03; Constitution §UI/UX Guardrails — "Low Friction", "Immediately usable with minimal instruction"; plan.md §Performance Goals ("Form renders instantly")  
  > **AC**:  
  > - **Given** the tool opened in Chrome, Safari, Firefox, and Edge at 1280×800, **When** viewed, **Then** the form is readable, all question labels are visible, toolbar actions are above or beside the form, and no horizontal scrollbar appears  
  > - **Given** the page, **When** loaded, **Then** no FOUC (flash of unstyled content) occurs (CSS is embedded in `<style>` in `<head>`)  
  > **Test Assertions**:  
  > - All 9 question labels are visible without scrolling on standard desktop viewport  
  > - Toolbar buttons are grouped and labeled  
  > - No `console.error` or layout warnings in DevTools  
  > - Page renders in under 1 second (no external resource requests — verify in Network tab)  
  > **Manual Verification**: Open in all 4 browsers at 1280×800 → visually confirm layout is clean → check Network tab shows zero external requests

  - [x] T-001.09 [US1] Add timestamp to save filename — modify Save button handler to include DD-MM-YYYY date in the downloaded filename, matching the Memory Map convention

  > **Source**: FR-US1.12
  > **AC**:
  > - **Given** Q1 is "My Initiative" and today is 22 Feb 2026, **When** the user clicks Save, **Then** the downloaded filename is `My_Initiative-coer-22-02-2026.json`
  > - **Given** Q1 is empty, **When** the user clicks Save, **Then** the downloaded filename is `coer-22-02-2026.json`
  > - **Given** Q1 contains special characters like `/\?%*:|"<>`, **When** saved, **Then** those characters are replaced with `-` in the filename (existing sanitization preserved)
  > **Manual Verification**: Fill Q1 → Save → check filename in downloads bar includes today's date in DD-MM-YYYY format

**Checkpoint — MVP**: US1 complete. A user can fill and save a COER. Deploy and validate before proceeding.

---

## Phase 4: User Story 2 — Load and Edit an Existing COER (Priority: P2)

**Goal**: A returning user loads a saved project file, reviews/edits answers, and saves the updated file — with all non-COER data preserved exactly.

**Independent Test**: Save a project file with all 9 answers. Reload the page, click Load, select the file — form populates. Edit Q3. Click Save. Open new file — Q3 updated, `lastModified` updated, all other fields unchanged.

- [x] T-002.01 [US2] Implement the Load button — `<input type="file" accept=".json">` triggers `loadFileFromInput()`, calls `deserializeFromProjectFile()`, populates `formState`, calls `renderForm()` in `tools/coer/index.html`

  > **Source**: FR-US2.01, FR-US2.02; spec.md US2 Acceptance Scenario 1; SC-US2.01  
  > **AC**:  
  > - **Given** a valid saved project file, **When** the user clicks Load and selects the file, **Then** all 9 question fields populate with the saved values within 3 seconds on a standard laptop  
  > - **Given** the file contains `initiatives[0].name = "Improve onboarding"`, **When** loaded, **Then** Q1 displays `"Improve onboarding"`  
  > - **Given** the file has `coer.obstacles = ["IT backlog", "No budget"]`, **When** loaded, **Then** Q9 shows exactly 2 items in the correct order  
  > **Test Assertions**:  
  > - After load: `formState.initiativeName === json.effectivenessToolkit.initiatives[0].name`  
  > - After load: `formState.obstacles` array length and order match `coer.obstacles` in file  
  > - Load completes and form is interactive in under 3 seconds (measure with DevTools Performance tab)  
  > **Manual Verification**: Save a fully filled form → refresh page → Load → verify every field matches original → inspect Q9 item order matches saved order

- [x] T-002.02 [P] [US2] Implement schema version warning — on load, detect unrecognized `effectivenessToolkit.version`; show inline warning with "Proceed" and "Abort" options in `tools/coer/index.html`

  > **Source**: spec.md §Edge Cases "File format conflict"; data-model.md §Validation Rules ("warn if unrecognized version")  
  > **AC**:  
  > - **Given** a project file with `version: "9.9"` (unrecognised), **When** the user loads it, **Then** a warning message is shown before any form population: "File version '9.9' is not recognised by this tool. Data may not load correctly."  
  > - **Given** the warning, **When** the user clicks "Proceed", **Then** the tool attempts to deserialize and populate the form with whatever data it can read  
  > - **Given** the warning, **When** the user clicks "Abort", **Then** the dialog closes, the form remains blank/as-was, and no partial state is written  
  > - **Given** a file with `version: "1.0"` (known), **When** loaded, **Then** no warning is shown  
  > **Test Assertions**:  
  > - Warning UI is visible for `version !== "1.0"`  
  > - No warning for `version === "1.0"`  
  > - After Abort: `formState.initiativeName === ""` (blank state preserved)  
  > **Manual Verification**: Create JSON with `"version": "9.9"` → Load → warning appears → click Abort → form still blank → Load same file → Proceed → form attempts to show data

- [x] T-002.03 [US2] Implement round-trip preservation — store entire loaded JSON in memory (`loadedProjectFile`); on save, merge only COER-owned fields; write all other fields back unchanged in `tools/coer/index.html`

  > **Source**: FR-US2.04, FR-US2.05; contracts/project-file-schema.md §Contract 2 (all 5 test scenarios)  
  > **AC**:  
  > - **Given** a project file with `"sob": null`, **When** loaded and re-saved, **Then** the re-saved file contains `"sob": null` exactly  
  > - **Given** a project file with no `sob` key (absent), **When** loaded and re-saved, **Then** the re-saved file also has no `sob` key  
  > - **Given** a project file with `"sob": { "foo": "bar" }`, **When** loaded and re-saved, **Then** `"sob": { "foo": "bar" }` is unchanged in the output  
  > - **Given** a project file with `"customField": "testvalue"` at initiative level (unknown field), **When** loaded and re-saved, **Then** `"customField": "testvalue"` is present in the output unchanged  
  > - **Given** a project file with `"newField": 42` at `effectivenessToolkit` level (unknown field), **When** loaded and re-saved, **Then** `"newField": 42` is preserved  
  > **Test Assertions**:  
  > - `JSON.stringify(savedFile.effectivenessToolkit.initiatives[0].sob) === JSON.stringify(loadedFile.effectivenessToolkit.initiatives[0].sob)` (deep equality)  
  > - `"sob" in savedFile.effectivenessToolkit.initiatives[0] === "sob" in loadedFile.effectivenessToolkit.initiatives[0]` (key presence matches)  
  > - `savedFile.effectivenessToolkit.initiatives[0].customField === "testvalue"`  
  > **Manual Verification**: Create project JSON with `"sob": null`, `"customField": "preserve-me"`, and a `memoryMap: { "nodes": [] }` → Load → edit Q3 → Save → open output in VS Code → confirm all three fields are identical to input

- [x] T-002.04 [US2] Implement `lastModified` update on re-save — both `coer.lastModified` and `effectivenessToolkit.lastModified` updated to `new Date().toISOString()` on every save in `tools/coer/index.html`

  > **Source**: FR-US2.03; spec.md US2 Acceptance Scenario 2; SC-US2.02  
  > **AC**:  
  > - **Given** a loaded COER with `coer.lastModified = "2026-01-01T00:00:00.000Z"`, **When** the user edits Q3 and saves, **Then** `coer.lastModified` in the output file is more recent than `"2026-01-01T00:00:00.000Z"`  
  > - **Given** 10 sequential load → edit → save cycles, **When** the final file is inspected, **Then** all field values match the last edit session (no data drift)  
  > **Test Assertions**:  
  > - `new Date(savedFile.coer.lastModified) > new Date(loadedFile.coer.lastModified)`  
  > - After 10 save cycles: final `coer.reason` value equals the Q3 value entered in cycle 10 (not cycle 1 or any earlier)  
  > **Manual Verification**: Save file at T1 (note timestamp) → Load → edit Q3 to "Updated text" → Save at T2 → open output → `lastModified` is T2 > T1; repeat 3 more times, each time the timestamp advances

**Checkpoint — US2**: Loading, editing, and round-trip preservation working. All P1 and P2 features complete.

---

## Phase 5: User Story 3 — Export COER for Sharing (Priority: P3)

**Goal**: A completed COER can be exported as a printable PDF (via browser print dialog) or as a formatted markdown text file.

**Independent Test**: Open a saved COER, click "Print / Export PDF" — print preview shows clean document with no form controls and correct footer. Click "Export Text" — `.md` file downloads with all 9 questions as headings and answers as text, no JSON syntax.

- [x] T-003.01 [US3] Implement `@media print` CSS — hide all interactive controls, render questions and answers as static text, add print footer in `tools/coer/index.html`

  > **Source**: FR-US3.03, FR-US3.04, FR-US3.05, FR-US3.06; research.md §R3  
  > **AC**:  
  > - **Given** `@media print` rules, **When** in print preview, **Then** all `<input>`, `<textarea>`, `<button>`, and elements with class `.no-print` are hidden (`display: none`)  
  > - **Given** bullet-list answers (Q2, Q5, Q7, Q9), **When** in print view, **Then** they render as readable `<ul><li>` lists — not as bracket notation `["a","b"]`  
  > - **Given** the print view header, **When** rendered, **Then** `<h1>` shows the initiative name and a subtitle shows the `lastModified` date in human-readable format (e.g., "Last Modified: 22 Feb 2026")  
  > - **Given** the print view footer, **When** rendered, **Then** a footer section reads exactly: `"Generated by the Effectiveness Suite app — visit https://claudio.coach for access"`  
  > - **Given** print layout, **When** applied, **Then** `break-inside: avoid` prevents a question section from splitting across pages  
  > **Test Assertions**:  
  > - `@media print` CSS rule hides `.no-print` and form controls (verify via DevTools "Emulate Print Media Type")  
  > - Footer text matches the exact string from FR-US3.06  
  > - Q2 with 3 items shows 3 `<li>` elements in print view, not raw array string  
  > **Manual Verification**: Fill Q2 with 3 items → DevTools → Rendering → Emulate CSS media: print → inspect: no inputs visible, Q2 shows as bullet list, footer text correct; then use "print-color-adjust: exact" to verify header styling preserved

- [x] T-003.02 [P] [US3] Implement "Print / Export PDF" button — calls `window.print()` — in `tools/coer/index.html`

  > **Source**: FR-US3.01; spec.md US3 Acceptance Scenario 1; SC-US3.01  
  > **AC**:  
  > - **Given** a COER with answers, **When** the user clicks "Print / Export PDF", **Then** the browser's native print dialog opens  
  > - **Given** the print dialog, **When** "Save as PDF" is selected, **Then** the resulting PDF shows: initiative name as heading, all 9 questions with their answers, the `lastModified` date as subtitle, and the footer line  
  > - **Given** the PDF, **When** reviewed, **Then** no form input boxes, textarea fields, or add/remove buttons are visible  
  > **Test Assertions**:  
  > - Button click calls `window.print()` (verify by temporarily overriding with a spy in console: `window.print = () => console.log("print called")`)  
  > - PDF output (manual verification) shows clean layout matching professional document standard  
  > **Manual Verification**: Fill all 9 questions → click Print/Export PDF → print dialog opens → Save as PDF → open PDF → verify: initiative name heading, all 9 answers, `lastModified` subtitle, footer, zero form controls visible

- [x] T-003.03 [US3] Implement "Export Text" button — build markdown string from `formState`, download as `.md` file via `saveFileToDownload()` in `tools/coer/index.html`

  > **Source**: FR-US3.02, FR-US3.04, FR-US3.05, FR-US3.06; spec.md US3 Acceptance Scenarios 2, 3, 4; contracts/project-file-schema.md §Contract 3; SC-US3.02  
  > **AC**:  
  > - **Given** a COER with answers, **When** the user clicks "Export Text", **Then** a `.md` file download is triggered  
  > - **Given** the downloaded `.md` file, **When** opened in a text editor, **Then** it contains all 9 question headings (using `##`) and their answers in human-readable format  
  > - **Given** Q2 with items `["R1", "R2"]`, **When** exported, **Then** the `.md` file contains `- R1\n- R2` — not `["R1","R2"]` or any JSON bracket notation  
  > - **Given** the export footer, **When** at end of file, **Then** it reads exactly: `"Generated by the Effectiveness Suite app — visit https://claudio.coach for access"` (preceded by `---` separator)  
  > - **Given** Q5, **When** exported, **Then** the "Achieving" and "Not Achieving" sublists are rendered as two labeled bullet sections  
  > - **Given** the downloaded file, **When** reviewed, **Then** no UI label text (e.g., "+ Add item", "Remove", "Save", "Load") appears in the output  
  > **Test Assertions**:  
  > - Exported file extension is `.md`  
  > - File content contains `# Clarity of End Result (COER)` as first heading  
  > - `**Initiative**:` line present with correct initiative name  
  > - `**Last Modified**:` line present with human-readable date  
  > - Q2 items appear as `- item` format, not JSON  
  > - Footer line matches exactly per FR-US3.06  
  > - No JSON special characters (`[`, `]`, `{`, `}`) appear in exported output  
  > **Manual Verification**: Fill all 9 questions (Q2: 3 items, Q5: 2+2 items, Q9: 3 items) → Export Text → open `.md` in VS Code → verify against contract-3 template in `contracts/project-file-schema.md` → confirm all 9 question sections present, footer present, no JSON syntax

**Checkpoint — US3**: All three user stories complete. Full tool functionality available.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Security hardening, accessibility, edge case validation, and final manual sign-off.

- [x] T-004.01 [P] Implement HTML-escaping for all user inputs rendered via `innerHTML` — create `escapeHtml(str)` helper and apply to every list item render in `tools/coer/index.html`

  > **Source**: research.md §R5 "Gotchas — Must HTML-escape user input before injecting via innerHTML to prevent XSS"  
  > **AC**:  
  > - **Given** a bullet list item containing `<script>alert(1)</script>`, **When** added and rendered, **Then** the text displays literally as `<script>alert(1)</script>` and no alert fires  
  > - **Given** input containing `&`, `<`, `>`, `"`, `'`, **When** rendered in the DOM via innerHTML, **Then** correct HTML entities are used: `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`  
  > **Test Assertions**:  
  > - `escapeHtml('<script>alert(1)</script>')` returns `'&lt;script&gt;alert(1)&lt;/script&gt;'`  
  > - `escapeHtml('a & b')` returns `'a &amp; b'`  
  > - Adding `<b>bold</b>` as Q2 item renders as literal text (no bold formatting in DOM)  
  > **Manual Verification**: Type `<img src=x onerror=alert('xss')>` as a Q2 list item → click Add → item appears as literal text → no alert fires; save → load → item still displays as literal text

- [x] T-004.02 [P] Implement accessibility — semantic HTML5 landmarks, `aria-label` on icon-only buttons, `for`/`id` label association, keyboard navigation for bullet list add/remove in `tools/coer/index.html`

  > **Source**: Constitution §UI/UX Guardrails — "Support keyboard navigation and semantic HTML for assistive technologies"  
  > **AC**:  
  > - **Given** the form, **When** navigated using Tab key only (no mouse), **Then** all interactive elements (Q1 input, all textareas, Q2/Q5/Q7/Q9 add buttons, all Remove buttons, toolbar Save/Load/Print/Export) are reachable in logical order  
  > - **Given** a dynamic bullet list, **When** the "+ Add item" button is activated (click or Enter key), **Then** focus moves automatically to the new input field  
  > - **Given** Save, Load, Print, and Export toolbar buttons, **When** inspected with a screen reader or DevTools Accessibility panel, **Then** each has a descriptive accessible name (not just an icon)  
  > **Test Assertions**:  
  > - All `<button>` elements with icon-only content have `aria-label` attribute set  
  > - All form `<label>` elements have a matching `for` attribute pointing to a form control `id`  
  > - Tab order follows visual document order (no `tabindex` jumps)  
  > - After "+ Add item" click, `document.activeElement` is the new input  
  > **Manual Verification**: Open tool → press Tab repeatedly from Q1 → confirm all 9 Q inputs and all list controls reached without mouse → add Q2 item with keyboard (Tab to Add button, press Enter) → confirm focus jumps to new input → check DevTools Accessibility tree for toolbar button labels

- [x] T-004.03 Validate all 6 edge case behaviours — implement any missing guards in `tools/coer/index.html`

  > **Source**: spec.md §Edge Cases (all 6 items)  
  > **AC**:  
  > - **Given** only Q1 filled (all others blank), **When** saved, **Then** file downloads without error; JSON has `coer.specificResults: []`, `coer.reason: ""`, `coer.obstacles: []` (all defaults; no missing keys)  
  > - **Given** Q9 with zero items, **When** saved, **Then** `coer.obstacles === []` — not `null`, not absent from JSON  
  > - **Given** the last item removed from any bullet list, **When** done, **Then** the list container remains visible with an "+ Add item" button shown  
  > - **Given** Q9 with 25 items, **When** viewed, **Then** all 25 items are accessible (scroll if needed); none are truncated, clipped, or hidden  
  > - **Given** an empty form, **When** Export Text is triggered, **Then** the export renders question labels even for blank answers (no questions are skipped)  
  > - **Given** Q8 left blank, **When** exported as markdown, **Then** Q8 section appears with an empty answer line (not omitted)  
  > **Test Assertions**:  
  > - Save with Q1-only → `JSON.parse` → all 9 coer fields present → array fields are `[]` and string fields are `""`  
  > - `"obstacles" in savedJson.effectivenessToolkit.initiatives[0].coer === true` when Q9 is empty  
  > - After removing all Q2 items: `.add-item-btn` element for Q2 is visible  
  > - Add 25 Q9 items → list container height > viewport → scroll bar appears → item 25 is scrollable to  
  > **Manual Verification**: Test each of the 6 edge cases from spec.md §Edge Cases sequentially; annotate pass/fail in `tests/manual/coer-test-scenarios.md`

- [ ] T-004.04 Execute quickstart.md manual test checklist — run all 9 validation checks; update `tests/manual/coer-test-scenarios.md` with PASS/FAIL results for Chrome and Firefox

  > **Source**: Constitution §VII; quickstart.md §7 Validation Checks; SC-US1.01, SC-US1.02, SC-US1.03, SC-US2.01, SC-US2.02, SC-US3.01, SC-US3.02  
  > **AC**:  
  > - **Given** all 9 quickstart.md validation checks, **When** executed in Chrome and Firefox, **Then** all 9 pass in both browsers  
  > - **Given** the results, **When** documented in `tests/manual/coer-test-scenarios.md`, **Then** each check has status PASS or FAIL and any FAIL includes a description of the failure  
  > - **Given** "No network requests in DevTools Network tab" check, **When** the tool is open, **Then** zero requests appear in the Network tab (tool is fully offline)  
  > **Test Assertions**:  
  > - All 9 checks documented with status  
  > - Zero FAILs at release gate; any FAIL blocks the phase from completing  
  > - Network tab confirms zero external requests in both browsers  
  > **Manual Verification**: Follow quickstart.md steps 1–7 exactly in Chrome, then in Firefox; record results; fix any failures before marking this task complete

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup (T-000.01, T-000.02)
    └── Phase 2: Foundational (T-000.03 → T-000.06) — BLOCKS all story phases
            ├── Phase 3: US1 (T-001.01 → T-001.08) — MVP
            │       └── Phase 4: US2 (T-002.01 → T-002.04)
            │               └── Phase 5: US3 (T-003.01 → T-003.03)
            └── Phase 6: Polish (T-004.01 → T-004.04) — after all story phases
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|-----------|-----------------|
| US1 (P1) | Phase 2 complete | T-000.06 done |
| US2 (P2) | Phase 2 + US1 preferred (Load builds on Save infrastructure) | T-000.06 (required), T-001.07 (recommended) |
| US3 (P3) | Phase 2 + US1 (Export reads `formState` populated by US1) | T-001.07 (required for `formState` to exist) |
| Polish | All story phases complete | T-003.03 done |

### Within Each Phase — Internal Order

```
Phase 3 (US1):
  T-001.01 (Q1) + T-001.02 (Q3/Q4/Q6) + T-001.03 (Q2/Q7) [parallel within same file — coordinate]
  T-001.04 (Q5) — after T-001.03 pattern established
  T-001.05 (Q8) + T-001.06 (Q9) [can parallel with T-001.04]
  T-001.07 (Save) — after all Q inputs done
  T-001.08 (CSS) — can parallel with Q implementations

Phase 4 (US2):
  T-002.01 (Load) — first
  T-002.02 (Version warning) + T-002.03 (Preservation) [parallel]
  T-002.04 (lastModified update) — after T-002.01

Phase 5 (US3):
  T-003.01 (@media print CSS) — first
  T-003.02 (Print button) + T-003.03 (Export Text) [parallel, after T-003.01]
```

---

## Parallel Execution Notes

All tasks within a phase are in a single HTML file (`tools/coer/index.html`). "Parallel" means concurrent implementation windows are possible only if working on clearly separate sections (e.g., CSS block vs. JS functions vs. HTML structure). Coordinate to avoid merge conflicts.

**Safe parallel pairs within Phase 3**:
- T-001.02 (textareas HTML + JS) + T-001.08 (CSS) — different sections of the file
- T-001.03 (Q2/Q7 list components) + T-001.05 (Q8 input) — different form sections

**Safe parallel pairs within Phase 4**:
- T-002.02 (version warning) + T-002.03 (round-trip preservation) — different JS functions

**Safe parallel pairs within Phase 5**:
- T-003.02 (print button — 5 lines of JS) + T-003.03 (export text — JS function) — after T-003.01 CSS is done

**Safe parallel pairs within Phase 6**:
- T-004.01 (XSS escaping) + T-004.02 (accessibility) — different code sections

---

## Implementation Strategy

### MVP First (US1 Only — Phase 1 + 2 + 3)

1. Complete Phase 1: Setup (T-000.01, T-000.02) — ~30 min
2. Complete Phase 2: Foundational (T-000.03 → T-000.06) — ~2 hrs
3. Complete Phase 3: US1 (T-001.01 → T-001.08) — ~3 hrs
4. **STOP and VALIDATE**: Open `tools/coer/index.html`, fill all 9 questions, save, reload and verify round-trip
5. If passing, commit: `feat(coer): implement COER form MVP — US1 fill and save [T-001.07]`

### Incremental Delivery

```
Phase 1 + 2  →  Skeleton and utilities ready (no user value yet)
+ Phase 3     →  MVP: fill and save (shippable)
+ Phase 4     →  Load and edit (fully iterative coaching use)
+ Phase 5     →  Export for sharing (professional coaching output)
+ Phase 6     →  Polished, accessible, security-hardened, tested
```

### Commit Convention

Format: `type(coer): description [T-NNN.NN]`

Examples:
- `feat(coer): create tools/coer directory and HTML skeleton [T-000.01]`
- `feat(coer): implement form state management foundation [T-000.03]`
- `feat(coer): implement save to project file [T-001.07]`
- `feat(coer): implement load and round-trip preservation [T-002.03]`
- `feat(coer): implement print and text export [T-003.03]`
- `fix(coer): add HTML escaping for XSS prevention [T-004.01]`

---

## Summary

| Phase | Tasks | Story | Est. Time |
|-------|-------|-------|-----------|
| Phase 1: Setup | T-000.01 – T-000.02 | — | ~30 min |
| Phase 2: Foundational | T-000.03 – T-000.06 | — | ~2 hrs |
| Phase 3: US1 (MVP) | T-001.01 – T-001.08 | US1 | ~3 hrs |
| Phase 4: US2 | T-002.01 – T-002.04 | US2 | ~2 hrs |
| Phase 5: US3 | T-003.01 – T-003.03 | US3 | ~1.5 hrs |
| Phase 6: Polish | T-004.01 – T-004.04 | — | ~2 hrs |
| **Total** | **21 tasks** | | **~11 hrs** |

**Parallel opportunities**: 8 task pairs identified (see Parallel Execution Notes above)  
**Independent test criteria**: Each user story phase has a documented Independent Test at its header  
**Suggested MVP scope**: Phase 1 + 2 + 3 only (T-000.01 through T-001.08)
