### 🧭 **Product Vision Statement: Effectiveness Toolkit**

> **We are building an offline-first suite of visual planning and coaching tools that digitises the five principles of effectiveness used in the Personal Efficiency Program (PEP): Prioritization, Clarity of End Result, Strength of Belief, Planning, and Impact Mapping.**

Initially developed to support executive coaching under PEP, the Effectiveness Toolkit guides users through a proven methodology for turning high-priority initiatives ("Big Rocks") into clear, actionable plans — and for identifying and managing obstacles along the way.

Each tool in the suite addresses one principle of effectiveness. Together they form an iterative, non-linear workflow: a coach or executive can take one initiative from prioritization through to a detailed action plan in a single session, then return days later to develop another initiative — or revisit an earlier one. Data flows forward between tools (e.g., obstacles identified in Clarity of End Result feed into Strength of Belief; actions from Strength of Belief become branches in the Memory Map), and users can move freely between stages as their thinking evolves.

All tools share a single JSON project file per user, keeping data portable, offline, and under the user's full control.

> Our long-term vision is to provide coaches and knowledge workers with an integrated, open, and offline-first effectiveness methodology platform — one that bridges strategic thinking, belief management, and disciplined execution without requiring cloud accounts, subscriptions, or IT support.

---

#### 🔍 Optional Short Taglines

> _"From Big Rocks to clear action — one principle at a time."_

> _"Where mind maps meet project plans."_

> _"Five principles. One toolkit. Your effectiveness."_

---

### 🧩 **Vision Board: Effectiveness Toolkit**

#### 🎯 Target Group

- Executive coaches delivering the PEP program (pilot users)
- Senior executives and coachees participating in coaching sessions (MVP users)
- Broader knowledge workers and self-managed professionals using structured planning methodologies (production)

#### 🧠 Needs

- Prioritize large initiatives and distinguish urgent from important
- Clarify the desired end result, motivation, and obstacles for each initiative before planning begins
- Identify and manage obstacles by distinguishing what is within the user's control, influence, and concern
- Quickly ideate and structure projects using visual tools (mind mapping)
- Sequence tasks, capture invested and elapsed time, and convert mind maps into trackable action plans without rewriting
- Assess the impact and consequences of uncontrollable factors and develop mitigation or amplification strategies
- Revisit and rework plans across multiple coaching sessions without starting from scratch
- Keep all data in a single portable file under the user's control — no cloud dependency

#### 🛠 Product

The Effectiveness Toolkit is a suite of five interconnected, offline-first web tools:

**Tool 1 — Prioritization (Time Management Matrix)**
A four-quadrant matrix (based on the Covey/Eisenhower model) where users plot their Big Rocks — high-priority initiatives — across the dimensions of urgency and importance. The user selects one initiative to carry forward into the next tool.

**Tool 2 — Clarity of End Result (COER)**
A guided form where the user answers nine structured questions about their selected initiative: what specific result they want to achieve, why it matters, how it connects to broader objectives, where they are now, who is involved, their confidence level, and what obstacles stand in the way. The form can be completed by the coach with the client during a session, or independently by the client between sessions, depending on the coaching engagement. The obstacles identified in question 9 feed directly into Tool 3.

**Tool 3 — Strength of Belief (SoB)**
A diagram where the user plots obstacles (imported from COER question 9) within two concentric circles: Circle of Control (inner) and Circle of Concern (outer). The user then identifies actions to increase their influence over these obstacles and draws a Circle of Influence between the two. Actions to increase influence feed forward into Tool 4 as first-level branches. Items that remain between the circles of influence and concern (where the user cannot take direct action) feed into Tool 5.

**Tool 4 — Memory Map Action Planner**
A web-based mind mapping tool (built on a fork of mind-elixir-core) enhanced with planning attributes:
  → Task sequencing
  → Invested and elapsed time tracking
  → Start/due dates, assignee, status per node
  → Visual-to-linear transformation into exportable action plans (CSV, HTML table)
  → Table view with depth filtering, drag-and-drop reordering, and inline editing
  → Full keyboard shortcut support replicating established mind map applications (FreeMind, XMind)

The initiative name is imported as the root node. Actions to increase influence from Tool 3 become first-level branches. The user brainstorms additional branches, sequences tasks, and exports the result as a structured action plan.

**Tool 5 — Impact Map**
A mind-map-based tool (reusing the mind-elixir engine) for brainstorming the impacts and consequences of factors identified in Tool 3 that sit between the circles of influence and concern — areas where direct action is not possible. The user classifies consequences as positive or negative, develops ideas for reducing negative impact and amplifying positive impact, connects these ideas to the relevant nodes, and sequences them into an action plan. Users can also add further items beyond those imported from Tool 3.

#### Inter-Tool Data Flow

```
Tool 1: Prioritization (TMM)
  │
  ├── Select a Big Rock (initiative name)
  │
  ▼
Tool 2: Clarity of End Result (COER)
  │
  ├── Q9 obstacles ──────────────────────┐
  │                                       │
  ▼                                       ▼
Tool 3: Strength of Belief (SoB)    
  │                                  
  ├── Actions to increase influence ──► Tool 4: Memory Map Action Planner
  │                                       │
  ├── Items between influence             ├── Brainstorm, sequence, export
  │   and concern ───────────────────► Tool 5: Impact Map
  │                                       │
  │                                       ├── Classify +/- consequences
  │                                       ├── Mitigation/amplification ideas
  │                                       └── Action plan
  │
  └── User can return to any tool at any time
```

#### 🔄 Iterative Workflow Principle

The toolkit is designed for non-linear, iterative use across multiple sessions:

- A user may complete Tools 1–4 for one Big Rock in a single coaching session
- They return days or weeks later to develop a second Big Rock through the same workflow
- They may revisit an earlier initiative's COER or SoB as circumstances change
- All data for all initiatives is stored in a single JSON project file, enabling this fluid movement

This mirrors real coaching practice where progress is incremental, non-sequential, and responsive to evolving priorities.

---

#### 📈 Business Goals

- Digitize and enhance the full PEP effectiveness methodology to save time and improve coaching outcomes
- Increase coaching program value by providing professional, structured output artifacts at each stage
- Build brand awareness as a coach by providing a free, open solution
- Provide a serverless, standalone client solution acceptable in secure corporate environments
- Enable coaches to use tools independently or as a connected suite — no rigid workflow enforcement

---

### Development Approach

#### Architecture Principles

- **Offline-first**: All tools function entirely in the browser with no server, login, or external API dependency
- **Single-user, single-session**: No multi-user collaboration, accounts, or real-time sync in MVP
- **Privacy by default**: No telemetry, tracking, or third-party data collection
- **Shared data format**: All tools read from and write to a single JSON project file with namespaced sections per tool
- **Technology simplicity**: Each tool uses the simplest technology appropriate to its needs — standalone HTML for forms (COER), Vite/TypeScript with mind-elixir for visual tools (Memory Map, Impact Map), to be determined for diagram tools (TMM, SoB)
- **Monorepo**: All tools live in the same repository under a shared folder structure (e.g., `apps/memory-map`, `apps/coer`), enabling shared schema documentation and eventual integration

#### Development Priorities

| Priority | Tool | Status | Rationale |
|----------|------|--------|-----------|
| P1 (delivered) | Memory Map Action Planner | MVP complete (US1-US8) | Core value proposition; most complex tool |
| P2 (next) | Clarity of End Result | Not started | Simple form; immediate coaching need; feeds SoB and Memory Map |
| P3 | Strength of Belief | Not started | Visual diagram; depends on COER obstacles |
| P4 | Prioritization (TMM) | Not started | Entry point to workflow; less urgent because coaches already do this on paper |
| P5 | Impact Map | Not started | Reuses mind-elixir engine; depends on SoB output |

#### Development Effort

- Prioritize the simplest viable implementation for each tool
- Use existing open-source libraries and engines where possible (mind-elixir-core for map-based tools)
- Solo developer with GitHub Copilot for implementation; Speckit for governance and specification
- Each tool goes through its own `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` cycle
- Time-boxed iterations: aim for shippable increments every 1–2 weeks

---

#### 🧱 Shared JSON Project File (Conceptual Structure)

All tools contribute to a single project file. Each initiative is a container holding data from whichever tools the user has completed so far. Sections not yet populated are `null`.

```json
{
  "effectivenessToolkit": {
    "version": "1.0",
    "lastModified": "2026-02-22T10:00:00Z",
    "initiatives": [
      {
        "id": "init-001",
        "name": "Initiative name from TMM or free-text",
        "tmm": {
          "quadrant": "Q2-important-not-urgent"
        },
        "coer": {
          "specificResults": "...",
          "reason": "...",
          "corporateContribution": "...",
          "consequences": "...",
          "startingPoint": "...",
          "stakeholders": "...",
          "confidencePercent": 70,
          "obstacles": ["obstacle 1", "obstacle 2"]
        },
        "sob": null,
        "memoryMap": null,
        "impactMap": null
      }
    ]
  }
}
```

This structure is illustrative. The exact schema will be refined during each tool's `/speckit.plan` phase. The key constraint is that all tools share the same file and can reference each other's data.

---

#### 🏗️ Competitors / Alternatives

| Alternative | Limitation |
|-------------|-----------|
| Paper-based PEP worksheets | Not reusable; no data flow between steps; hard to revise |
| Generic mind mapping tools (FreeMind, XMind, MindMeister) | No planning attributes; no structured methodology integration |
| Project management tools (Jira, Trello, MS Project) | Overkill for coaching sessions; require accounts and setup; no PEP methodology support |
| Custom spreadsheets | Fragile; no visual ideation; poor user experience for executives |

The Effectiveness Toolkit's differentiator is the integration of a proven coaching methodology (PEP's five principles of effectiveness) with purpose-built tools that flow data between stages — in an offline, private, zero-setup package.
