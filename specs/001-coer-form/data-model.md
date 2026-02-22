# Data Model: COER Form

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Research**: [research.md](research.md)

## Entities

### ProjectFile (Envelope)

The shared JSON project file, per Constitution Principle VI. This is the first formal definition — all future tools conform to this structure.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `effectivenessToolkit` | object | Yes | Top-level namespace |
| `effectivenessToolkit.version` | string | Yes | Schema version (e.g., `"1.0"`) |
| `effectivenessToolkit.lastModified` | string | Yes | ISO 8601 timestamp of last save across any tool |
| `effectivenessToolkit.initiatives` | Initiative[] | Yes | Array of initiatives (MVP: single element) |

### Initiative

A named project or responsibility the user is working on.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (UUID v4, generated on creation) |
| `name` | string | Yes | Initiative name (free text, no format constraints) |
| `coer` | COER \| null | No | COER form data for this initiative. `null` or absent if not yet filled |
| `sob` | object \| null | No | Strength of Belief data (future — preserved on round-trip) |
| `memoryMap` | object \| null | No | Memory Map data (future — preserved on round-trip) |
| `tmm` | object \| null | No | Prioritization/TMM data (future — preserved on round-trip) |
| `impactMap` | object \| null | No | Impact Map data (future — preserved on round-trip) |

**Rules**:
- Tool sections not yet populated are `null` or absent (key not present).
- On save, the COER tool MUST preserve all fields it does not own (other tool sections, other initiatives) by writing them back unchanged.
- Unknown fields at any level MUST be preserved for forward compatibility.

### COER

The nine-question form answers for one initiative.

| Field | Type | Default | Maps to Question |
|-------|------|---------|-----------------|
| `lastModified` | string | (set on save) | — ISO 8601 timestamp |
| `specificResults` | string[] | `[]` | Q2: Specific results by timeline |
| `reason` | string | `""` | Q3: Why I want to achieve it |
| `corporateContribution` | string | `""` | Q4: Corporate contribution |
| `consequencesAchieving` | string[] | `[]` | Q5a: Consequences of achieving |
| `consequencesNotAchieving` | string[] | `[]` | Q5b: Consequences of not achieving |
| `startingPoint` | string | `""` | Q6: Where am I now |
| `stakeholders` | string[] | `[]` | Q7: Who else needs to be involved |
| `confidencePercent` | string | `""` | Q8: Confidence percentage (stored as text) |
| `obstacles` | string[] | `[]` | Q9: Obstacles (each stored separately for future Tool 3 consumption) |

**Notes**:
- Q1 (initiative name) is stored as `Initiative.name`, not inside the `coer` object.
- `confidencePercent` is free text, not a number. No numeric validation in MVP.
- Array fields may be empty `[]`. An empty `obstacles` array is valid and must not break future Tool 3 integration.
- `lastModified` is set to `new Date().toISOString()` at time of save.

## Canonical JSON Example

```json
{
  "effectivenessToolkit": {
    "version": "1.0",
    "lastModified": "2026-02-22T14:30:00.000Z",
    "initiatives": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Improve client onboarding process",
        "coer": {
          "lastModified": "2026-02-22T14:30:00.000Z",
          "specificResults": [
            "Reduce onboarding time from 4 weeks to 2 weeks by June 30",
            "Achieve 90% client satisfaction score within first month"
          ],
          "reason": "This will free up 40% of my time currently spent on manual onboarding tasks, allowing me to focus on strategic growth.",
          "corporateContribution": "Directly supports the company's Q2 target of 25% increase in client retention and operational efficiency.",
          "consequencesAchieving": [
            "More time for strategic work",
            "Higher client satisfaction and retention",
            "Team can handle more clients without additional headcount"
          ],
          "consequencesNotAchieving": [
            "Continue losing 2 days per week to manual processes",
            "Risk of client churn due to slow onboarding",
            "Team burnout from repetitive work"
          ],
          "startingPoint": "Current onboarding is a 4-week manual process with 6 handoffs. Client satisfaction is at 72%. No automation in place.",
          "stakeholders": [
            "Operations Manager — owns the current process",
            "IT Team — needed for system integration",
            "Client Success Lead — handles client communication"
          ],
          "confidencePercent": "65",
          "obstacles": [
            "IT team is overcommitted until March",
            "No budget allocated for automation tools",
            "Resistance to change from operations team"
          ]
        },
        "sob": null,
        "memoryMap": null,
        "tmm": null,
        "impactMap": null
      }
    ]
  }
}
```

## Validation Rules

| Rule | Enforcement | Notes |
|------|-------------|-------|
| `effectivenessToolkit.version` must be present | On load — warn if unrecognized version | Offer to proceed or abort |
| `initiatives` must be an array | On load — reject if not array | Show error message |
| `id` must be a non-empty string | On creation — generate UUID v4 | |
| `name` must be a non-empty string | On save — Q1 must have content | Minimum: at least Q1 filled for save |
| Array fields accept empty `[]` | Always valid | No minimum items required |
| String fields accept empty `""` | Always valid | Partial form saves allowed |
| `confidencePercent` is free text | No numeric validation | Stored as string per agreed format |
| Unknown fields preserved | On round-trip | Forward compatibility |
| Other tool sections preserved | On round-trip | `null`, absent, or populated — all preserved as-is |

## State Transitions

```text
[New Form]
    │
    ▼
[User fills Q1..Q9]  ← editing in memory only
    │
    ├── Save → serialize formState + envelope → download JSON file
    │          sets coer.lastModified and envelope.lastModified
    │
    ├── Load → parse JSON → extract first initiative's coer → populate formState → render
    │          preserves entire file structure in memory for round-trip
    │
    ├── Print/PDF → window.print() with @media print CSS
    │
    └── Export Text → build markdown string → download .md file
```

## Data Dictionary (exact field names)

| JSON Path | Type | Example Value |
|-----------|------|---------------|
| `effectivenessToolkit` | object | `{}` |
| `effectivenessToolkit.version` | string | `"1.0"` |
| `effectivenessToolkit.lastModified` | string | `"2026-02-22T14:30:00.000Z"` |
| `effectivenessToolkit.initiatives` | array | `[...]` |
| `effectivenessToolkit.initiatives[].id` | string | `"a1b2c3d4-..."` |
| `effectivenessToolkit.initiatives[].name` | string | `"Improve onboarding"` |
| `effectivenessToolkit.initiatives[].coer` | object\|null | `{...}` |
| `effectivenessToolkit.initiatives[].coer.lastModified` | string | `"2026-02-22T14:30:00.000Z"` |
| `effectivenessToolkit.initiatives[].coer.specificResults` | string[] | `["Result 1", "Result 2"]` |
| `effectivenessToolkit.initiatives[].coer.reason` | string | `"Because..."` |
| `effectivenessToolkit.initiatives[].coer.corporateContribution` | string | `"Supports Q2 target..."` |
| `effectivenessToolkit.initiatives[].coer.consequencesAchieving` | string[] | `["Benefit 1"]` |
| `effectivenessToolkit.initiatives[].coer.consequencesNotAchieving` | string[] | `["Risk 1"]` |
| `effectivenessToolkit.initiatives[].coer.startingPoint` | string | `"Current state is..."` |
| `effectivenessToolkit.initiatives[].coer.stakeholders` | string[] | `["Person A"]` |
| `effectivenessToolkit.initiatives[].coer.confidencePercent` | string | `"65"` |
| `effectivenessToolkit.initiatives[].coer.obstacles` | string[] | `["Obstacle 1"]` |
| `effectivenessToolkit.initiatives[].sob` | object\|null | `null` |
| `effectivenessToolkit.initiatives[].memoryMap` | object\|null | `null` |
| `effectivenessToolkit.initiatives[].tmm` | object\|null | `null` |
| `effectivenessToolkit.initiatives[].impactMap` | object\|null | `null` |
