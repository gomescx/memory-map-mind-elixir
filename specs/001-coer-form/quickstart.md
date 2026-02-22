# Quickstart: COER Form

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## 1. Open the Tool

```text
Open tools/coer/index.html in any modern browser (Chrome, Firefox, Safari, Edge).
Double-click the file, or drag it into a browser window.
No build step. No installation. No server.
```

## 2. Fill in a New COER

1. Enter the initiative name in Q1.
2. For bullet-list questions (Q2, Q5, Q7, Q9), click **"+ Add item"** to add entries. Click **"Remove"** on any item to delete it.
3. Q5 has two separate lists — "Achieving" and "Not Achieving" — each with independent add/remove controls.
4. Q8 (confidence) is free text — type any value (e.g., `70`, `70%`, `high`).
5. Fill in as many or as few questions as needed — partial saves are allowed.

## 3. Save to Project File

- Click **"Save"** (or the save button in the toolbar).
- The browser downloads a `.json` project file.
- Choose a location and filename (e.g., `my-project yyyy-mm-dd.json`).
- The file contains the complete `effectivenessToolkit` envelope with your initiative and COER data.

## 4. Load an Existing Project File

- Click **"Load"** (or the load button in the toolbar).
- Select a previously saved `.json` project file.
- The form populates with the saved initiative name and all COER answers.
- Any data from other tools in the file (Memory Map, Strength of Belief, etc.) is preserved — the COER tool does not modify sections it doesn't own.

## 5. Edit and Re-Save

- After loading, edit any answers.
- Click **"Save"** again — the `lastModified` timestamp updates.
- The entire file is re-downloaded with your changes.

## 6. Export for Sharing

### Print / Export PDF
- Click **"Print / Export PDF"**.
- The browser's print dialog opens with a clean, professional view.
- Choose "Save as PDF" as the printer destination.
- Form controls are hidden — only questions and answers are shown.

### Export Text (Markdown)
- Click **"Export Text"**.
- A `.md` file downloads with all 9 questions and answers formatted as readable markdown.
- Share via email, print, or import into any document editor.

## 7. Validation Checks

- [x] Q1 filled → form saves successfully.
- [x] All 9 questions filled → all values round-trip through save/load.
- [ ] Bullet list add/remove works for Q2, Q5 (both lists), Q7, Q9.
- [ ] Save with only Q1 → file is valid, other fields at defaults.
- [ ] Load a file → re-save → re-load → data identical (no drift).
- [ ] Print view: no form controls visible, footer present.
- [ ] Text export: no JSON syntax, no UI labels, footer present.
- [ ] Load a file with `sob: null` → COER operates fine, `sob: null` preserved on save.
- [ ] No network requests in DevTools Network tab.
