# Quickstart

1) **Install deps**
```sh
npm install
```

2) **Run dev server** (offline-capable SPA)
```sh
npm run dev
```

3) **Core flows to test**

### Mindmap view
- Create nodes with mind-elixir shortcuts: `Tab` (add child), `Enter` (add sibling).
- Select a node then press `Ctrl+P` / `Cmd+P` to open the Planning Attributes side panel.
- Edit all six planning fields (start date, due date, estimated/invested hours, assignee, status).
- Save map to JSON: `Ctrl+S` / `Cmd+S` (or click 💾 Save button).
- Load a saved map: `Ctrl+O` / `Cmd+O` (or click 📂 Load button).
- Undo / Redo: `Ctrl+Z` / `Ctrl+Y` (`Cmd+Z` / `Cmd+Shift+Z` on Mac).

### Table view
- Click the **Table** toggle in the toolbar to switch from mindmap to table view.
- Use the **Depth** dropdown to filter visible rows (All, 1, 2, 3, 4).
- Inline-edit text cells (Name, Assignee) by double-clicking or pressing `Enter`.
- Inline-edit date cells (Due Date) by clicking the cell.
- Inline-edit status/priority by clicking the dropdown cell.
- Inline-edit numeric cells (Est. Hours, Inv. Hours) by double-clicking.
- Drag rows to reorder siblings within the same parent.
- Click the **Mindmap** toggle to switch back — all changes are reflected.

### Export
- Export to CSV and HTML table: `Ctrl+E` / `Cmd+E` (or use 📊 CSV / 📄 HTML buttons).
- Open the generated HTML file in Word or a browser for a printable action plan.

4) **Validation checks**
- Start date after due date shows warning (non-blocking).
- Node IDs remain stable across save/load/export.
- No network requests in DevTools Network tab.
- Table view and mindmap view remain in sync after inline edits.
- Depth filter shows correct subset of rows; sequence numbers remain consistent.

5) **Keyboard shortcuts reference**

| Shortcut | Action |
|---|---|
| `Tab` | Add child node |
| `Enter` | Add sibling node |
| `Del` / `Backspace` | Delete selected node |
| `Ctrl/Cmd+Z` | Undo |
| `Ctrl/Cmd+Y` / `Cmd+Shift+Z` | Redo |
| `Ctrl/Cmd+S` | Save map to JSON |
| `Ctrl/Cmd+O` | Load map from JSON |
| `Ctrl/Cmd+E` | Export CSV + HTML |
| `Ctrl/Cmd+P` | Toggle planning attributes panel |
| `Alt+↑ / Alt+↓` | Reorder node among siblings |
| `F2` or `Enter` | Rename selected node |

6) **Tests**
```sh
npm run test          # vitest unit + integration
npm run test:e2e      # playwright smoke (requires: npm run dev)
```
