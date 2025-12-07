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
- Create nodes with mind-elixir shortcuts (Enter child, Tab sibling).
- Open attribute panel (hotkey or button), edit planning fields, save.
- Save map to JSON (download), reload via file picker or drag/drop.
- Export to CSV and HTML table (printable for Word-like output).
- Toggle autosave, close tab, reopen, and recover session.

4) **Validation checks**
- Start date after due date shows warning (non-blocking).
- Node IDs remain stable across save/load/export.
- No network requests in DevTools Network tab.

5) **Tests**
```sh
npm run test          # vitest unit
npm run test:e2e      # playwright smoke (if configured)
```
