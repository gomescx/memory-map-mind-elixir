# COER Scope Statement — Input for `/speckit.specify`

## Tool Context

The Clarity of End Result (COER) is Tool 2 in the Effectiveness Toolkit suite. It is a guided form where the user answers nine structured questions about a selected initiative (Big Rock). The COER sits between Prioritization (Tool 1, not yet built) and Strength of Belief (Tool 3, not yet built) in the PEP effectiveness workflow.

For MVP, the initiative name is entered as free text. In a future version, it will be imported from the Prioritization/TMM tool.

## What the COER Does

The user opens the COER tool, enters or selects an initiative name, and answers nine questions from the standard PEP Clarity of End Result form:

1. **Choose an important responsibility or project to work on** (the initiative name) — TEXT (single text input)
2. **I want to achieve the following specific result(s) by a specific timeline** — BULLET LIST (unordered list; user can add/remove items)
3. **I want to achieve it because (what's in it for me)** — TEXT (text area)
4. **This will contribute to corporate objectives in the following ways** — TEXT (text area)
5. **The consequences of achieving it / not achieving it are** — TWO BULLET LISTS: one list for consequences of achieving, one list for consequences of not achieving (user can add/remove items in each)
6. **Where am I now? My starting point is** — TEXT (text area)
7. **Who else needs to be involved?** — BULLET LIST (unordered list; user can add/remove items)
8. **How confident am I that I will achieve the result with ease?** (percentage) — TEXT (single text input)
9. **The obstacle(s) I see affecting the ease with which I can achieve the result, and/or the quality of the end result are** — BULLET LIST (unordered list; user can add/remove items; each obstacle stored individually)

Questions with bullet lists (Q2, Q5, Q7, Q9) allow the user to add and remove individual entries dynamically. Q5 has two separate lists under the same question. Each list item in Q9 is stored separately because obstacles feed individually into the Strength of Belief tool (Tool 3) in a future integration.

Each COER is associated with exactly one initiative. One COER per initiative. The COER must carry a timestamp (date/time it was created or last modified).

## User Interaction Model

The COER form can be used in two coaching contexts:
- Coach fills it in with the client during a coaching session (collaborative, real-time)
- Client fills it in independently between coaching sessions (solo, self-paced)

Both contexts use the same form — no special modes or permissions needed.

## MVP Scope

### Must Have
- The 9-question form as described above
- Save to and load from the shared JSON project file (per constitution Principle VI)
- The COER data lives in the `coer` namespace of the initiative object in the shared project file
- Export to PDF, Text, or browser print (so the coach or client can produce a clean document to share or file)
- Ability to create a new initiative with a COER, or open an existing project file and edit a COER
- Timestamp on the COER (created/last modified)

### Nice to Have (Deferred)
- Import initiative name from TMM (Tool 1) — for now, free text entry
- Visual indication of which initiatives in a project file already have COERs completed
- Navigation between multiple initiatives within the same project file

### Out of Scope
- Integration with Strength of Belief (Tool 3) — obstacles are stored in the shared file for future consumption, but no active link in this MVP
- Integration with Memory Map (Tool 4) — no import/export between COER and Memory Map in this MVP
- Multi-user, authentication, cloud storage (per constitution)

## Technology

Per constitution: standalone HTML or lightweight web application. No build tools required unless complexity demands it. This is a Form-Based Tool — prefer zero-config delivery with standard browser APIs.

## Data Format

The COER section within the shared project file should look conceptually like:

```json
{
  "coer": {
    "lastModified": "2026-02-22T10:00:00Z",
    "specificResults": ["Result 1 by timeline", "Result 2 by timeline"],
    "reason": "...",
    "corporateContribution": "...",
    "consequencesAchieving": ["Consequence 1", "Consequence 2"],
    "consequencesNotAchieving": ["Consequence 1", "Consequence 2"],
    "startingPoint": "...",
    "stakeholders": ["Person 1", "Person 2"],
    "confidencePercent": "70",
    "obstacles": [
      "Obstacle 1 text",
      "Obstacle 2 text",
      "Obstacle 3 text"
    ]
  }
}
```

Note: `confidencePercent` is stored as text. Bullet list fields (Q2, Q5, Q7, Q9) are stored as arrays of strings. Q5 splits into two arrays (`consequencesAchieving` and `consequencesNotAchieving`). The exact schema will be refined during `/speckit.plan`.

## Acceptance Context

This tool is needed for a live coaching engagement. Target delivery: within 2-3 days. The coaching client will use it next week.
