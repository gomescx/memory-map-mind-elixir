# Research Findings

## Method
- Reviewed mind-elixir-core APIs and node schema to ensure backward-compatible extensions.
- Evaluated offline-friendly export approaches (CSV, DOCX via client-side libraries, or HTML printable view).
- Assessed state management options suited for small, single-user SPA.

## Findings
- mind-elixir-core supports custom node fields; additional attributes can live under a namespaced key (e.g., `extended`) to avoid collisions.
- CSV export is straightforward via tree flattening; DOCX adds dependency/weight. HTML table with print-to-PDF covers the Word use case with lower complexity.
- For solo-dev simplicity, avoid heavy state managers; stick to local component state + minimal context or a tiny store.
- File save/load can use `Blob` + `URL.createObjectURL` + `a.download`; drag-drop and file input cover loading; include schema versioning in saved JSON.
- LocalStorage auto-save is feasible as opt-in; guard for availability and private mode failures.
- Validation: warn (not block) when startDate > dueDate; ensure stable node IDs by persisting existing IDs.

## Decisions
- Use HTML table export (printable) plus CSV; defer true DOCX unless future demand justifies added dependency.
- Store extended attributes under `extended.plan` to keep backward compatibility with upstream nodes.
- Keep tooling minimal: Vite + TypeScript + Vitest + Playwright; no additional runtime deps beyond mind-elixir-core and a lightweight date helper if needed.
- Version saved files with `{ version: "1.0.0", data: { ...map... } }` to allow future migrations.
- Autosave: optional toggle; debounce saves to localStorage; recovery prompt on load when data exists.

## Alternatives Considered
- DOCX export via `docx` library: rejected for bundle weight/complexity; HTML print covers need.
- Redux/Pinia/Zustand: rejected as overkill; context + hooks sufficient for single-user scope.
- Web workers for export: deferred; only introduce if profiling shows >2s blocking for 500 nodes.
