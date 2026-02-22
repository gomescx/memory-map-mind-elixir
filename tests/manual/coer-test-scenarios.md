# Manual Test Scenarios: COER Form

**Feature**: `001-coer-form` | **Created**: 2026-02-22  
**Source**: quickstart.md §7 Validation Checks  
**How to use**: Open `tools/coer/index.html` in any modern browser and execute each scenario. Update Status to `[P] PASS` or `[F] FAIL` with notes.

---

## Scenario 1 — Minimal Save (Q1 Only)

**Status**: `[ ] PENDING`

**Precondition**: Page freshly loaded, all fields blank.

**Steps**:
1. Fill Q1 (initiative name) with any text (e.g., `"Test Initiative"`).
2. Leave all other questions blank.
3. Click **Save**.

**Expected Result**: Browser triggers a `.json` file download. No error messages
 appear. Saved file is valid JSON.

---

## Scenario 2 — Full Round-Trip (All 9 Questions)

**Status**: `[ ] PENDING`

**Precondition**: Page freshly loaded.

**Steps**:
1. Fill all 9 questions with distinct values (at least 2 bullet items in Q2, Q5a, Q5b, Q7, Q9).
2. Click **Save**. Note the saved filename.
3. Reload the page (Cmd+R / F5).
4. Click **Load** and select the saved file.

**Expected Result**: Every field in the form matches the originally entered
 values — text, order of bullet items, and confidence value all preserved
 exactly. No data loss or truncation.

---

## Scenario 3 — Bullet List Add / Remove

**Status**: `[ ] PENDING`

**Precondition**: Page freshly loaded.

**Steps**:
1. In Q2, click **"+ Add item"** three times. Enter `"R1"`, `"R2"`, `"R3"`.
2. Click **Remove** on the second item (`"R2"`).
3. Verify `"R1"` and `"R3"` remain in order.
4. Repeat the add/remove check for Q5 **Achieving** list, Q5 **Not Achieving** list, Q7, and Q9.

**Expected Result**: Each list responds independently — removing an item from one
 list does not affect other lists. After removing all items, the **"+ Add item"**
 button remains visible.

---

## Scenario 4 — Save with Defaults (Partial Fill)

**Status**: `[ ] PENDING`

**Precondition**: Page freshly loaded.

**Steps**:
1. Fill only Q1 with `"Partial Save Test"`. Leave everything else blank.
2. Click **Save**.
3. Open the downloaded JSON in a text editor.

**Expected Result**: File is valid JSON. `initiatives[0].name === "Partial Save Test"`.
 Array fields (`specificResults`, `consequencesAchieving`, `consequencesNotAchieving`,
 `stakeholders`, `obstacles`) are empty arrays `[]`, not `null` or absent.
 String fields (`reason`, `corporateContribution`, `startingPoint`, `confidencePercent`)
 are empty strings `""`, not `null`.

---

## Scenario 5 — No Data Drift on Re-Save

**Status**: `[ ] PENDING`

**Precondition**: A fully filled project file saved from Scenario 2.

**Steps**:
1. Click **Load** and select the previously saved file.
2. Make a small edit to Q3.
3. Click **Save** again.
4. Click **Load** and select the newly saved file.

**Expected Result**: All fields other than Q3 are identical to the original.
 Q3 reflects the edit. `lastModified` timestamp has advanced. No data loss or
 duplicate entries across three load/save cycles.

---

## Scenario 6 — Print View (No Form Controls)

**Status**: `[ ] PENDING`

**Precondition**: Form filled with at least Q1, Q2 (2 items), Q3.

**Steps**:
1. Open DevTools → Rendering → Emulate CSS media: **print**.
   (Alternative: Click **"Print / Export PDF"** and inspect the print preview.)
2. Inspect the rendered page in print mode.

**Expected Result**: No form inputs, buttons, or file controls are visible.
 Q2 items appear as a bullet list (plain text). A footer line is present
 at the bottom of the document.

---

## Scenario 7 — Text Export (Markdown, No JSON)

**Status**: `[ ] PENDING`

**Precondition**: Form filled with all 9 questions (Q2: 2 items, Q5: 1+1 items, Q9: 2 items).

**Steps**:
1. Click **"Export Text"**.
2. Open the downloaded `.md` file in a text editor (e.g., VS Code).

**Expected Result**: File is readable markdown — 9 question sections with
 headings, answers as plain text, bullet items as `- item` lines.
 No JSON syntax (`{`, `}`, `"key":`) visible. No UI labels (e.g., no "Add item"
 button text). A footer line is present.

---

## Scenario 8 — Round-Trip Preservation of Non-COER Fields

**Status**: `[ ] PENDING`

**Precondition**: A project JSON file that includes a `"sob": null` key inside
 the initiative object, plus any other unrecognised keys.

**Steps**:
1. Create (or hand-edit) a project file that has `"sob": null` and a custom
   field `"customField": "preserve-me"` alongside the `coer` section.
2. Click **Load** and select that file.
3. Edit Q3 to any new value.
4. Click **Save**.
5. Open the new file in a text editor.

**Expected Result**: `"sob": null` is present and unchanged. `"customField": "preserve-me"`
 is present and unchanged. Only `coer.lastModified` and
 `effectivenessToolkit.lastModified` have updated values.

---

## Scenario 9 — No Network Requests

**Status**: `[ ] PENDING`

**Precondition**: Tool opened from `file://` (double-click) or a local static server.

**Steps**:
1. Open DevTools → **Network** tab. Enable recording.
2. Perform a full save/load/export cycle (fill Q1, Save, Load, Export Text).

**Expected Result**: Zero network requests appear in the Network tab. The tool
 operates entirely offline with no external resource fetches.

---

## Edge Case Scenarios (T-004.03)

*Source: spec.md §Edge Cases. Run after completing core scenarios 1–9.*

---

### Scenario EC-1 — Empty Form Save (Q1 Only)

**Status**: `[ ] PENDING`

**Edge Case**: Empty form save — if the user saves with only Q1 filled, the form
 saves with all other fields at their empty defaults; no validation error is raised.

**Precondition**: Page freshly loaded, all fields blank.

**Steps**:
1. Fill Q1 with `"Minimal COER"`. Leave all other fields blank.
2. Click **Save**.
3. Open the downloaded JSON in a text editor.

**Expected Result**: File is valid JSON. `initiatives[0].name === "Minimal COER"`.
 All array fields are `[]` (not `null`). All string fields are `""` (not `null`).
 No error or alert was shown during save.

---

### Scenario EC-2 — Empty Q9 Obstacles at Save

**Status**: `[ ] PENDING`

**Edge Case**: Empty Q9 at save — obstacles array may be empty `[]`; must not break
 future Tool 3 integration.

**Precondition**: Page freshly loaded.

**Steps**:
1. Fill Q1 and at least one other question. Leave Q9 completely empty.
2. Click **Save**.
3. Open the downloaded JSON in a text editor.

**Expected Result**: `coer.obstacles` is present and equals `[]`
 (not absent, not `null`). File is valid JSON throughout.

---

### Scenario EC-3 — Single-Item Bullet List Removal

**Status**: `[ ] PENDING`

**Edge Case**: Single-item removal — removing the last item leaves the list
 empty `[]`; an "Add item" prompt remains visible.

**Precondition**: Page freshly loaded.

**Steps**:
1. In Q9, click **"+ Add item"** once. Type any text.
2. Click **Remove** on that single item.
3. Inspect the Q9 section.

**Expected Result**: Q9 list is empty. The **"+ Add item"** button is still visible
 (not hidden, not collapsed). Repeat for Q2, Q7, and each Q5 sub-list.

---

### Scenario EC-4 — File Format Conflict (Unrecognised Version)

**Status**: `[ ] PENDING`

**Edge Case**: File format conflict — unrecognised schema version triggers a
 warning rather than silently corrupting data.

**Precondition**: A project JSON file with `"version": "9.9"` in the envelope.

**Steps**:
1. Hand-edit a valid project file to change `"version": "1.0"` → `"version": "9.9"`.
2. Click **Load** and select the modified file.
3. Observe the inline warning banner.
4. Click **Abort** — verify form remains blank (or unchanged).
5. Click **Load** again, select the same file, then click **Proceed** — verify form
   attempts to show data.

**Expected Result**: On load, a warning banner appears with version `9.9` and
 "Proceed" / "Abort" options. Abort leaves the form unchanged. Proceed loads
 whatever data is parseable.

---

### Scenario EC-5 — Export with Empty Answers

**Status**: `[ ] PENDING`

**Edge Case**: Export renders question labels even when answers are blank.

**Precondition**: Page freshly loaded. Fill Q1 only; leave Q2–Q9 blank.

**Steps**:
1. Click **Print / Export PDF** → inspect the print preview.
2. Click **Export Text** → open the `.md` file.

**Expected Result (Print)**: All 9 question labels are visible. Blank text fields
 show a "(Not yet answered)" placeholder. Empty list sections show their heading
 with no list items. No form controls visible.

**Expected Result (Export)**: All 9 question headings are present in the `.md` file.
 Blank text answers show `(Not yet answered)`. Empty list sections show their
 heading with no bullet items. No JSON syntax visible.

---

### Scenario EC-6 — Large Obstacle List (20+ Items)

**Status**: `[ ] PENDING`

**Edge Case**: Q9 with 20+ items must remain usable (scroll within list or page;
 no truncation).

**Precondition**: Page freshly loaded.

**Steps**:
1. In Q9, add 25 items (can use copy-paste to speed up entry).
2. Scroll the page to verify all 25 items are accessible.
3. Click **Save**. Open the downloaded JSON in a text editor.

**Expected Result**: All 25 items are visible (via page scroll — no items hidden
 or truncated). The downloaded JSON has all 25 entries in `coer.obstacles`.
 No layout overflow or horizontal scrollbar.

---

## Results Summary

| # | Scenario | Chrome | Firefox | Safari | Edge |
|---|----------|--------|---------|--------|------|
| 1 | Minimal Save | — | — | — | — |
| 2 | Full Round-Trip | — | — | — | — |
| 3 | Bullet List Add/Remove | — | — | — | — |
| 4 | Save with Defaults | — | — | — | — |
| 5 | No Data Drift | — | — | — | — |
| 6 | Print View | — | — | — | — |
| 7 | Text Export | — | — | — | — |
| 8 | Non-COER Round-Trip | — | — | — | — |
| 9 | No Network Requests | — | — | — | — |
| EC-1 | Empty Form Save | — | — | — | — |
| EC-2 | Empty Q9 at Save | — | — | — | — |
| EC-3 | Single-Item Removal | — | — | — | — |
| EC-4 | Format Conflict / Version Warning | — | — | — | — |
| EC-5 | Export with Empty Answers | — | — | — | — |
| EC-6 | Large Obstacle List (20+) | — | — | — | — |
