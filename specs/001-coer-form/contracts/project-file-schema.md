# Contracts: COER Form — Project File Schema

**Feature**: [../spec.md](../spec.md) | **Data Model**: [../data-model.md](../data-model.md)

## Overview

The COER tool is a standalone HTML application with no backend. All "contracts" are client-side data format agreements governing the shared JSON project file. These contracts ensure inter-tool compatibility per Constitution Principle VI.

---

## Contract 1: Project File Envelope

**Purpose**: Standard envelope structure for the shared JSON project file. All tools in the Effectiveness Toolkit read and write this format.

### Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Effectiveness Toolkit Project File",
  "type": "object",
  "required": ["effectivenessToolkit"],
  "additionalProperties": false,
  "properties": {
    "effectivenessToolkit": {
      "type": "object",
      "required": ["version", "lastModified", "initiatives"],
      "additionalProperties": true,
      "properties": {
        "version": {
          "type": "string",
          "description": "Schema version. Current: 1.0",
          "enum": ["1.0"]
        },
        "lastModified": {
          "type": "string",
          "format": "date-time",
          "description": "ISO 8601 timestamp of the last save across any tool"
        },
        "initiatives": {
          "type": "array",
          "description": "Array of initiatives. MVP: single element.",
          "items": { "$ref": "#/definitions/Initiative" }
        }
      }
    }
  },
  "definitions": {
    "Initiative": {
      "type": "object",
      "required": ["id", "name"],
      "additionalProperties": true,
      "properties": {
        "id": {
          "type": "string",
          "description": "Unique identifier (UUID v4)"
        },
        "name": {
          "type": "string",
          "description": "Initiative name (free text)"
        },
        "coer": {
          "oneOf": [
            { "type": "null" },
            { "$ref": "#/definitions/COER" }
          ],
          "description": "COER form data. null if not yet filled."
        },
        "sob": {
          "description": "Strength of Belief data. null or absent if not yet filled.",
          "default": null
        },
        "memoryMap": {
          "description": "Memory Map data. null or absent if not yet filled.",
          "default": null
        },
        "tmm": {
          "description": "Prioritization/TMM data. null or absent if not yet filled.",
          "default": null
        },
        "impactMap": {
          "description": "Impact Map data. null or absent if not yet filled.",
          "default": null
        }
      }
    },
    "COER": {
      "type": "object",
      "required": ["lastModified"],
      "additionalProperties": true,
      "properties": {
        "lastModified": {
          "type": "string",
          "format": "date-time",
          "description": "ISO 8601 timestamp of the last COER save"
        },
        "specificResults": {
          "type": "array",
          "items": { "type": "string" },
          "default": [],
          "description": "Q2: Specific results by timeline"
        },
        "reason": {
          "type": "string",
          "default": "",
          "description": "Q3: Why I want to achieve it"
        },
        "corporateContribution": {
          "type": "string",
          "default": "",
          "description": "Q4: Corporate contribution"
        },
        "consequencesAchieving": {
          "type": "array",
          "items": { "type": "string" },
          "default": [],
          "description": "Q5a: Consequences of achieving"
        },
        "consequencesNotAchieving": {
          "type": "array",
          "items": { "type": "string" },
          "default": [],
          "description": "Q5b: Consequences of not achieving"
        },
        "startingPoint": {
          "type": "string",
          "default": "",
          "description": "Q6: Where am I now"
        },
        "stakeholders": {
          "type": "array",
          "items": { "type": "string" },
          "default": [],
          "description": "Q7: Who else needs to be involved"
        },
        "confidencePercent": {
          "type": "string",
          "default": "",
          "description": "Q8: Confidence percentage (stored as text, no validation)"
        },
        "obstacles": {
          "type": "array",
          "items": { "type": "string" },
          "default": [],
          "description": "Q9: Obstacles (each stored individually for future Tool 3)"
        }
      }
    }
  }
}
```

---

## Contract 2: Round-Trip Preservation

**Purpose**: Guarantee that loading and re-saving a project file does not lose data from other tools.

### Rules

1. On load, the COER tool reads the entire JSON file into memory.
2. The COER tool modifies **only**:
   - `effectivenessToolkit.lastModified` (updated to current timestamp)
   - `effectivenessToolkit.initiatives[0].name` (from Q1 form field)
   - `effectivenessToolkit.initiatives[0].coer` (from form state)
3. All other fields (`sob`, `memoryMap`, `tmm`, `impactMap`, other initiatives, unknown fields at any level) are written back **exactly as loaded**.
4. Fields that were `null` remain `null`. Fields that were absent (key not present) remain absent.
5. Unknown fields at any nesting level are preserved — no stripping, no defaulting.

### Test Scenarios

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Load file with `sob: null` | `"sob": null` | `"sob": null` in saved file |
| Load file with `sob` absent | No `sob` key | No `sob` key in saved file |
| Load file with `sob: { ... }` (populated by future tool) | `"sob": { "foo": "bar" }` | `"sob": { "foo": "bar" }` unchanged |
| Load file with unknown top-level field | `"effectivenessToolkit": { "newField": 42 }` | `"newField": 42` preserved |
| Load file with unknown initiative field | `"initiatives": [{ "customField": true }]` | `"customField": true` preserved |

---

## Contract 3: Markdown Export Format

**Purpose**: Define the structure of the `.md` text export for consistent output.

### Template

```markdown
# Clarity of End Result (COER)

**Initiative**: {initiative.name}
**Last Modified**: {coer.lastModified formatted as readable date}

---

## 1. Choose an important responsibility or project to work on

{initiative.name}

## 2. I want to achieve the following specific result(s) by a specific timeline

{for each item in specificResults:}
- {item}

## 3. I want to achieve it because (what's in it for me)

{reason}

## 4. This will contribute to corporate objectives in the following ways

{corporateContribution}

## 5. The consequences of achieving it / not achieving it are

### Achieving
{for each item in consequencesAchieving:}
- {item}

### Not Achieving
{for each item in consequencesNotAchieving:}
- {item}

## 6. Where am I now? My starting point is

{startingPoint}

## 7. Who else needs to be involved?

{for each item in stakeholders:}
- {item}

## 8. How confident am I that I will achieve the result with ease?

{confidencePercent}%

## 9. The obstacle(s) I see affecting the ease of achieving the result

{for each item in obstacles:}
- {item}

---

*Generated by the Effectiveness Suite app — visit https://claudio.coach for access*
```

### Rules

- Empty string fields render as "(Not yet answered)" or similar placeholder.
- Empty array fields render an empty section (heading shown, no bullet items).
- Bullet lists never show raw JSON bracket notation.
- The footer line is always present, even on empty/partial forms.

---

## Contract 4: New File Creation

**Purpose**: Define the default structure when user saves a new COER with no existing file loaded.

### Default Envelope

```json
{
  "effectivenessToolkit": {
    "version": "1.0",
    "lastModified": "{current ISO 8601 timestamp}",
    "initiatives": [
      {
        "id": "{generated UUID v4}",
        "name": "{Q1 initiative name from form}",
        "coer": {
          "lastModified": "{current ISO 8601 timestamp}",
          "specificResults": [],
          "reason": "",
          "corporateContribution": "",
          "consequencesAchieving": [],
          "consequencesNotAchieving": [],
          "startingPoint": "",
          "stakeholders": [],
          "confidencePercent": "",
          "obstacles": []
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

- UUID v4 generation: use `crypto.randomUUID()` (supported in all modern browsers since 2021, including `file://` in Chrome/Edge/Firefox; Safari 15.4+).
- If `crypto.randomUUID()` is unavailable, fall back to a simple `crypto.getRandomValues()`-based UUID generator.
