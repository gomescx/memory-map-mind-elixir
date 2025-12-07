# Data Model

## Entities

### MindMap
- `id`: string (map id)
- `title`: string
- `version`: string (schema version, e.g., "1.0.0")
- `root`: Node

### Node
- `id`: string (stable, preserved across save/load/export)
- `topic`: string (title)
- `children`: Node[]
- `expanded`: boolean | undefined
- `style`: object | undefined (mind-elixir-core compatible)
- `tags`: string[] | undefined
- `extended`:
  - `plan`:
    - `startDate`: string | null (ISO 8601)
    - `dueDate`: string | null (ISO 8601)
    - `investedTimeHours`: number | null
    - `elapsedTimeHours`: number | null
    - `assignee`: string | null
    - `status`: "Not Started" | "In Progress" | "Completed" | null

### ExportRow
- `id`: string
- `depth`: number (root=0)
- `title`: string
- `startDate`: string | null
- `dueDate`: string | null
- `investedTimeHours`: number | null
- `elapsedTimeHours`: number | null
- `assignee`: string | null
- `status`: string | null
- `parentPath`: string (breadcrumbs of ancestor topics)

## Validation Rules
- Dates: allow null; if both present and startDate > dueDate, emit warning flag (non-blocking).
- Numbers: non-negative; allow null.
- Status: enum or null only.
- Extended attributes optional; absence must not break upstream mind-elixir parsing.

## State Transitions
- Node edit updates `extended.plan` fields; retains `id` and core structure.
- Save: wrap map with `version` metadata and serialize to JSON.
- Load: validate schema version; on mismatch, attempt to fill missing `extended.plan` fields as null; warn on failure.
- Export: flatten tree preserving order; include `parentPath` for traceability.
- Autosave: optional localStorage snapshot keyed by map id; clear on explicit "Start Fresh".
