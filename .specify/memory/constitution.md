<!-- SYNC IMPACT REPORT
Version: 1.0.0 (NEW)
Baseline: Initial constitution for Memory Map Action Planner project
Modified Principles: N/A (new constitution)
Added Sections: 
  - Core Principles (5 principles)
  - Technical Guardrails
  - Data Model & Persistence
  - User Experience
  - Scope Boundaries
  - Speckit Governance
Removed Sections: N/A
Templates Requiring Updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check gates align with principles)
  - ✅ .specify/templates/spec-template.md (Requirements section validates against scope)
  - ✅ .specify/templates/tasks-template.md (Task categorization reflects principles)
Follow-up TODOs: None (all values defined)
-->

# Memory Map Action Planner – mind-elixir fork Constitution

## Core Principles

### I. Offline-First Architecture
The system MUST function entirely within the browser with no server component, login, or external database. All user data lives in the client (browser tab) and in user-controlled exported/imported files. This principle ensures:
- No network dependency during normal usage
- Data privacy by elimination of server-side collection points
- Acceptability in secure, air-gapped environments (business goal)
- Simplicity: no backend services to build, maintain, or scale

### II. Single-Session, Single-User Model
The MVP is a lightweight, single-user, single-session tool. Multi-user collaboration, real-time synchronization, accounts, and authentication are explicitly out of scope. This principle ensures:
- Architectural simplicity suitable for one senior developer (+ Copilot)
- No distributed state or conflict resolution overhead
- Clear mental model: "my map, my session, my export"
- Focus on core value (visual planning → action plan) rather than collaboration infrastructure

### III. Privacy by Default
The system MUST NOT call external APIs, collect telemetry, or track usage during normal operation. No third-party integrations without explicit user action. This principle ensures:
- User trust through transparent, boring data handling
- Compliance with secure environments and coaching confidentiality
- No dependency on external services beyond the mind-elixir-core library
- User owns all data generated within the tool

### IV. Respect Upstream (mind-elixir-core)
Extensions to mind-elixir-core MUST preserve the core mental model (central topic → branches → children), default keyboard shortcuts, and interaction patterns. Changes to core behaviors (selection, drag/drop, zoom) require explicit justification. This principle ensures:
- Users familiar with mind-elixir can adopt this tool without relearning
- The fork remains maintainable relative to upstream changes
- Backwards compatibility: existing mind maps can load and display correctly
- Data model extensions are backwards-compatible and non-breaking

### V. Simplicity Over Completeness
Architecture, dependencies, and patterns MUST be understandable and maintainable by one senior developer with Copilot assistance, without bespoke frameworks or over-engineering. Prefer boring, proven solutions. This principle ensures:
- No accidental complexity or unnecessary abstraction layers
- Clear, navigable codebase (single developer, single session)
- Reduced onboarding friction and future technical debt
- Fast time-to-MVP and ease of iteration based on coach feedback

## Technical Guardrails

### Base Technology
- **Core Engine**: Fork of `mind-elixir-core` (https://github.com/ssshooter/mind-elixir-core)
- **Deployment**: Web application (HTML/CSS/JavaScript), runs entirely in the browser
- **Build System**: Minimal tooling (e.g., no complex monorepo, no custom build pipeline unless essential)
- **Dependencies**: Kept minimal; new dependencies require justification (complexity vs. value trade-off)

### Node Data Model
Extend the default node with optional, backwards-compatible attributes:
- **start date** (ISO 8601 or null)
- **due date** (ISO 8601 or null)
- **invested time** (hours or null)
- **elapsed time** (hours or null)
- **assignee** (free text, null, or structured minimal reference)
- **status** (e.g., "Not Started", "In Progress", "Completed", or null)

**Backwards Compatibility Rule**: Existing mind-elixir features MUST ignore these attributes safely (graceful degradation). Node IDs and structural relationships MUST remain stable.

### Export & Tabulation
The system MUST support export-to-table operations:
- **Format**: CSV (minimum), HTML table view (should), Excel/XLSX (optional if disproportionate complexity avoided)
- **Content**: Rows including node ID, depth/level, title, start date, due date, invested time, elapsed time, assignee, status, parent reference/path
- **Design**: Flattens the tree into a linear, actionable format suitable for external planning or tracking tools
- **Implication**: Export must work without server; format should be versioned for migration safety

### Persistence & File Format
- **Primary Mechanism**: File-based save/load (JSON or similar format) with no backend or cloud dependency
- **Format Requirements**: Stable, versioned format to reduce future migration pain
- **Optional Enhancement**: localStorage or IndexedDB for "last open map" convenience (not primary persistence)
- **Implication**: User explicitly controls save/load; file system is the source of truth

## User Experience Principles

### Target Users & Terminology
- **Primary Users**: Executive coaches delivering the Personal Efficiency Program (PEP), senior executives participating in coaching sessions
- **Language**: Prefer PEP/Memory Map terminology (e.g., "invested time", "elapsed time") over generic project-management jargon
- **Model**: "A mind map that can become a plan" — not a full project management suite

### UI/UX Guardrails
- **Node Creation & Editing**: Keep friction as low as mind-elixir's default (fast, keyboard-friendly)
- **Attribute Editing**: Use side panel, modal, or inline editor; MUST NOT clutter the core map view
- **Visual Consistency**: Preserve mind-elixir's default layout, colors, and iconography where possible
- **Accessibility**: No tracking required; support keyboard navigation and semantic HTML for assistive technologies

## Scope Boundaries for MVP

### In Scope
- Extend nodes with the six optional attributes (start date, due date, invested time, elapsed time, assignee, status)
- UI to view and edit those attributes without overwhelming the map
- Export of the entire map into a linear, tabular structure (CSV + HTML, optional XLSX)
- Save and load of maps as standalone files suitable for offline use
- Preservation of keyboard shortcuts and interaction model from mind-elixir-core

### Explicitly Out of Scope
- Multi-user collaboration, accounts, or authentication
- Backend services or cloud persistence
- Advanced scheduling logic (e.g., critical path, automatic due date propagation)
- Integrations with external tools (Jira, Trello, calendar systems, etc.)
- Real-time synchronization or conflict resolution

## Speckit Governance

### Constitution as Enforcement Point
All specifications, plans, and tasks MUST pass a "Constitution Check" gate before Phase 0 research begins (and re-checked after Phase 1 design in the implementation plan). The following triggers a **constitutional violation**:

- Any requirement introducing a backend service, cloud storage, or external API (except graceful, opt-in integrations explicitly approved in future amendments)
- Multi-user features, authentication, or real-time collaboration in the MVP
- Dependency on third-party libraries without clear simplicity/value justification
- Over-engineering or architectural patterns not maintainable by one developer + Copilot

### Speckit Workflow Compliance
- **Specs** (`/speckit.specify`): Feature requirements MUST respect scope boundaries and not propose out-of-scope items (collaboration, backend, advanced scheduling)
- **Plans** (`/speckit.plan`): Technical approach MUST maintain Simplicity and Offline-First principles; plans introducing complexity require explicit rationale
- **Tasks** (`/speckit.tasks`): Task sizes and phrasing MUST assume a solo Delivery Manager using Copilot; no "team collaboration" or "distributed consensus" tasks
- **Implementation** (`/speckit.implement`): Code changes must preserve upstream compatibility and node data model stability

### Amendment Procedure
Amendments to this constitution require:
1. Clear rationale documenting why the principle or scope boundary is insufficient
2. Proposed text change with rationale
3. Version bump according to semantic versioning:
   - **MAJOR**: Backwards-incompatible principle removal or redefinition (e.g., adding multi-user as in-scope)
   - **MINOR**: New principle or materially expanded guidance without breaking existing constraints
   - **PATCH**: Clarifications, wording refinements, or non-semantic corrections
4. Updated `LAST_AMENDED_DATE` and version number
5. Sync Impact Report documenting affected templates and follow-up work

---

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07
