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
