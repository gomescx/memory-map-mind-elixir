# Feature Specification: Clarity of End Result (COER) Form

**Feature Branch**: `001-coer-form`  
**Created**: 2026-02-22  
**Status**: Draft  
**Governance**: [Constitution v1.2.0](../../.specify/memory/constitution.md) | [Solo Developer Principles](../../.specify/memory/solo-developer-principles.md)  
**Input**: [docs/coer-scope-statement.md](../../docs/coer-scope-statement.md) | [docs/Business_statement.md](../../docs/Business_statement.md)

## Context

The COER is Tool 2 in the Effectiveness Toolkit suite. It is a guided nine-question form used in PEP coaching to clarify the desired end result for a selected initiative (Big Rock). It sits between the Prioritization tool (Tool 1, not yet built) and the Strength of Belief tool (Tool 3, not yet built). This MVP delivers the form as a standalone HTML tool with save/load to the shared JSON project file and export for sharing.

> Constitutional governance (Principle I–VI) applies. Principles are not repeated here — they are referenced where relevant.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Fill In and Save a New COER (Priority: P1)

A coach or client opens the COER tool in a browser, enters an initiative name as free text, answers all nine COER questions, and saves the completed form to a project file. This is the entire core value of the tool.

**Why this priority**: No other story has value without this one. This story alone constitutes a shippable MVP.

**Independent Test**: Open the tool in a browser, fill in all 9 questions, save to file, reload the file — all answers appear correctly.

**Acceptance Scenarios**:

1. **Given** the COER tool is open with a blank form, **When** the user enters an initiative name in Q1, **Then** the name is accepted as free text with no constraints on format or uniqueness.
2. **Given** a blank Q2 bullet list, **When** the user clicks "Add item", **Then** a new editable text entry appears; **And** when the user clicks "Remove" on any item, **Then** that item is deleted from the list.
3. **Given** Q5 (consequences), **When** the section renders, **Then** two separate bullet lists are shown — one labeled "Achieving" and one labeled "Not Achieving" — each with independent add/remove controls.
4. **Given** Q9 (obstacles), **When** the user adds three obstacle entries, **Then** each obstacle is stored as a separate string in the obstacles array (not concatenated).
5. **Given** the form is filled with at least Q1 and one answer, **When** the user triggers "Save", **Then** a JSON project file is written containing the `coer` namespace nested under the initiative, with a `lastModified` ISO 8601 timestamp.
6. **Given** a saved project file, **When** the user opens it in the same tool, **Then** all 9 question answers are restored exactly as saved.

---

### User Story 2 — Load and Edit an Existing COER (Priority: P2)

A user who previously saved a project file opens it to review or update a COER. They may be returning between coaching sessions to revise their answers. They modify one or more answers and save the updated file.

**Why this priority**: Enables iterative coaching use. Coach or client can refine the COER across multiple sessions without starting over.

**Independent Test**: Save a project file with a COER. Reopen the tool, load the file, edit one answer, save again — the updated answer is present and `lastModified` is updated.

**Acceptance Scenarios**:

1. **Given** the tool is open, **When** the user loads a project file, **Then** the COER form populates with the saved initiative name and all saved answers.
2. **Given** a loaded COER, **When** the user edits any answer and saves, **Then** the `lastModified` timestamp is updated to the current date-time.
3. **Given** a project file where `sob`, `memoryMap`, `tmm`, and `impactMap` sections are either explicitly set to `null` or entirely absent (key not present in the JSON), **When** the file is loaded, **Then** the COER tool loads and operates correctly without errors; **And** on re-save, those sections are written back exactly as received — absent keys remain absent, null values remain null — with no data added, altered, or defaulted by the COER tool (per Constitution Principle VI — Tool Independence).
4. **Given** a project file created by a future version of the tool with additional unknown fields, **When** loaded in this version, **Then** known fields are restored correctly and unknown fields are preserved unchanged on next save.

---

### User Story 3 — Export COER for Sharing (Priority: P3)

After completing or reviewing a COER, the coach or client wants to produce a clean, readable document to share with the client or retain for filing. They export the form as a printable document or save it as a text file.

**Why this priority**: Enables professional coaching output. The tool has standalone value (US1+US2) even if export is unavailable; export enhances it for active coaching engagements.

**Independent Test**: Open a saved COER, trigger export — a document appears with all 9 questions and answers formatted for reading, with no form controls or buttons visible.

**Acceptance Scenarios**:

1. **Given** a COER with answers, **When** the user triggers "Print / Export PDF", **Then** the browser's print dialog opens showing a clean document with the initiative name, all 9 questions, their answers, the last-modified date, and a footer reading "Generated by the Effectiveness Suite app — visit https://claudio.coach for access".
2. **Given** a COER with answers, **When** the user triggers "Export Text", **Then** a markdown text file is downloaded containing all 9 questions and answers in a readable format, ending with a footer line reading "Generated by the Effectiveness Suite app — visit https://claudio.coach for access".
3. **Given** the print view, **When** rendered, **Then** form input controls (text fields, add/remove buttons) are not visible — only question labels and answer content.
4. **Given** the exported document, **When** reviewed, **Then** bullet-list answers (Q2, Q5, Q7, Q9) are formatted as readable lists, not raw arrays.

---

### Edge Cases

- **Empty form save**: What happens if the user saves with only Q1 filled? — The form saves with all other fields at their empty defaults (empty strings, empty arrays); no validation error is raised for incomplete forms.
- **Empty Q9 at save**: Obstacles array may be empty `[]`; this is valid and must not break Tool 3 integration when it reads the field in future.
- **Single-item bullet list removal**: If the user removes the last item from a bullet list, the list becomes empty `[]`; an "Add item" prompt remains visible.
- **File format conflict**: If the loaded project file has a `coer` section with an unrecognised schema version, the tool shows a warning and offers to overwrite rather than silently corrupting data.
- **Export with empty answers**: Export renders question labels even when answers are blank, so the document remains readable as a partially-completed form.
- **Large obstacle list**: Q9 with 20+ items must remain usable (scroll within list or page; no truncation).

---

## Requirements *(mandatory)*

### Functional Requirements — US1: Fill In and Save

- **FR-US1.01**: The form MUST display all 9 COER questions in their canonical order with their standard PEP labels.
- **FR-US1.02**: Q1 (initiative name) MUST be a single-line text input accepting free text with no format restrictions.
- **FR-US1.03**: Q2 (specific results), Q7 (stakeholders) MUST each render as a dynamic unordered list where the user can add new items and remove existing items individually.
- **FR-US1.04**: Q3 (reason), Q4 (corporate contribution), Q6 (starting point) MUST each render as a multi-line text area.
- **FR-US1.05**: Q5 (consequences) MUST render as two separate dynamic bullet lists under the same question — one for "Achieving" consequences and one for "Not Achieving" consequences — each with independent add/remove controls.
- **FR-US1.06**: Q8 (confidence percentage) MUST be a single-line text input; no numeric validation is applied (stored as text per agreed data format).
- **FR-US1.07**: Q9 (obstacles) MUST render as a dynamic bullet list where each obstacle is stored as a separate string entry; items MUST NOT be concatenated.
- **FR-US1.08**: On save, the tool MUST write the COER data into the `coer` namespace of the initiative object within the shared project JSON file, conforming to Constitution Principle VI (Shared Data Format).
- **FR-US1.09**: The saved `coer` object MUST include a `lastModified` field in ISO 8601 format set to the current date-time at time of save.
- **FR-US1.10**: The project file MUST use the envelope structure: `{ "effectivenessToolkit": { "version": "1.0", "lastModified": "...", "initiatives": [...] } }`.
- **FR-US1.11**: If no project file is currently open, saving MUST prompt the user to choose a file location and filename (browser file save dialog).
- **FR-US1.12**: The saved filename MUST include a timestamp in YYYY-MM-DD format, following the pattern `{sanitized-initiative-name}-coer-{YYYY}-{MM}-{DD}.json`, consistent with the Memory Map filename convention.
### Functional Requirements — US2: Load and Edit

- **FR-US2.01**: The tool MUST allow the user to load an existing project JSON file from their local file system.
- **FR-US2.02**: On load, the tool MUST parse the project file, locate the first initiative's `coer` section, and populate all form fields with the saved values.
- **FR-US2.03**: On save after editing, the `lastModified` field in the `coer` section MUST be updated to the current date-time.
- **FR-US2.04**: The tool MUST load and operate correctly when `sob`, `memoryMap`, `tmm`, and `impactMap` sections in the project file are `null` or absent (Constitution Principle VI — Tool Independence).
- **FR-US2.05**: On save, the tool MUST preserve all fields in the loaded project file that it does not own (other tool sections, other initiatives), writing them back unchanged.

**[DEFERRED — post-MVP]**: Navigation between multiple initiatives within the same project file (the MVP serves the first/only initiative; multi-initiative selection is deferred).

### Functional Requirements — US3: Export

- **FR-US3.01**: The tool MUST provide a "Print / Export PDF" action that opens the browser's native print dialog with a print-optimised view of the COER.
- **FR-US3.02**: The tool MUST provide an "Export Text" action that downloads a markdown text (.md) file containing all 9 questions and their answers.
- **FR-US3.03**: The print/export view MUST suppress all interactive form controls (input fields, buttons, add/remove controls) and render only question labels and answer content.
- **FR-US3.04**: Bullet-list answers (Q2, Q5, Q7, Q9) MUST render as formatted lists in both the print view and the text export, not as raw bracket notation.
- **FR-US3.05**: The exported document MUST include the initiative name as a heading and the `lastModified` timestamp as a subtitle.
- **FR-US3.06**: Both the print/PDF view and the text (.md) export MUST include a footer line: "Generated by the Effectiveness Suite app — visit https://claudio.coach for access". This footer MUST appear at the end of the document, visually separated from the content.

### Key Entities

- **Initiative**: A named project or responsibility the user is working on. Contains a unique `id`, a `name` (free text), and namespaced tool sections. One COER per initiative.
- **COER**: The nine-question form answers for one initiative. Fields: `lastModified` (ISO 8601), `specificResults` (string[]), `reason` (string), `corporateContribution` (string), `consequencesAchieving` (string[]), `consequencesNotAchieving` (string[]), `startingPoint` (string), `stakeholders` (string[]), `confidencePercent` (string), `obstacles` (string[]). Each obstacle is an independent string for future Tool 3 consumption.
- **Project File**: The single shared JSON file per user. Contains the `effectivenessToolkit` envelope with `version`, `lastModified`, and `initiatives[]`. Owned by the user; no cloud storage (Constitution Principle I).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-US1.01**: A coach can open the tool, complete all 9 questions for a new initiative, and save a project file in under 10 minutes from a standing start.
- **SC-US1.02**: A saved project file, when reloaded, restores all form data exactly — no data loss, no field truncation, no ordering change in bullet lists.
- **SC-US1.03**: The form is fully usable in a standard desktop browser with no installation, no build step, and no network connection after the initial file is opened.
- **SC-US2.01**: A returning user can load a previously saved project file and see all COER answers restored within 3 seconds on a standard laptop.
- **SC-US2.02**: Editing and re-saving a COER 10 times in sequence produces a valid, uncorrupted project file each time (no field drift or data loss across save cycles).
- **SC-US3.01**: The exported/printed document is readable and professionally formatted — a coach can hand it to a client without additional editing.
- **SC-US3.02**: The text export contains all 9 questions with their answers; no raw JSON syntax or UI control labels appear in the output.

---

## Assumptions

- Initiative name uniqueness is not enforced; the user is responsible for distinguishing initiatives by name.
- The MVP serves a single initiative per project file; multi-initiative support within one file is deferred.
- `confidencePercent` is stored as a free-text string per the agreed data format in the scope statement; no numeric range validation is applied in this MVP.
- Save is explicitly user-triggered (no auto-save); data in the browser is lost if the tab is closed without saving.
- The browser's native print-to-PDF capability is sufficient for PDF export; no third-party PDF library is required.
- No authentication, multi-user access, or conflict resolution is needed (Constitution Principle II).
- The tool is delivered as a standalone HTML file or minimal web app; no build tooling is introduced unless complexity demands it (Constitution Principle V, Technical Guardrails — Form-Based Tools).

---

## Deferred (Post-MVP)

- Visual indication of which initiatives in a project file already have COERs completed.
- Navigation / selection between multiple initiatives within the same project file.
- Import initiative name from the Prioritization/TMM tool (Tool 1) — free text entry is used instead in this MVP.
- Active integration with Strength of Belief (Tool 3) — obstacles are stored in the correct format for future consumption but no active link exists in this MVP.
