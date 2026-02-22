<!-- SYNC IMPACT REPORT
Version: 1.0.0 → 1.2.0 (MINOR)
Baseline: Memory Map Action Planner constitution v1.0.0
Rationale: 
  1. Elevate constitution from single-tool (Memory Map) to suite-level (Effectiveness Toolkit) governance (from v1.1.0 draft)
  2. Align with Speckit Solo DM Operating Manual mandatory sections (Testing, Commit, Env Config, Console Output Standards)
  3. Align role terminology with Solo DM Ecosystem role model (DM + Speckit + Copilot, not "solo developer")
  4. Add Specification Structure Principle per Solo Developer Governance Principles doc
  5. Remove embedded solo-developer constraints that belong in solo-developer-principles.md (not constitution)
Modified Principles:
  - III. Privacy by Default → minor wording (removed "beyond the mind-elixir-core library")
  - IV. Respect Upstream (mind-elixir-core) → scoped to "Tools that extend mind-elixir-core"
  - V. Simplicity Over Completeness → generalized; role terminology corrected to Solo DM ecosystem
Added Sections:
  - VI. Shared Data Format & Inter-Tool Data Flow (new principle)
  - VII. Testing Standards (mandatory per Operating Manual)
  - VIII. Commit Standards (mandatory per Operating Manual)
  - IX. Environment Configuration Standards (mandatory per Operating Manual, scoped for browser-based tools)
  - X. Console Output Standards (mandatory per Operating Manual, scoped for build/dev tooling)
  - Specification Structure Principle (per Governance Principles doc)
  - Solo DM Ecosystem role model (in Speckit Governance section)
  - Technical Guardrails > Form-Based Tools, Diagram-Based Tools (new sections)
Removed Sections: None
Scoped Sections:
  - Technical Guardrails > Base Technology → scoped as "Mind-Elixir Tools"
  - Technical Guardrails > Node Data Model → scoped as "Mind-Elixir Tools"
  - Technical Guardrails > Export & Tabulation → scoped as "Mind-Elixir Tools"
  - User Experience > UI/UX Guardrails → split into suite-wide and mind-elixir-specific
  - Scope Boundaries → abstracted to suite level
Templates Requiring Updates:
  - ⚠ .specify/templates/plan-template.md (Constitution Check now references principles I-VI plus standards VII-X)
  - ⚠ .specify/templates/spec-template.md (Constitutional Validation must check Principle VI; FR numbering must follow Specification Structure Principle)
  - ⚠ .specify/templates/tasks-template.md (Every task must include Given/When/Then ACs per Section VII)
Follow-up TODOs:
  - Ensure solo-developer-principles.md exists as a separate file in the repo (referenced at /speckit.specify time, NOT embedded in constitution)
  - Each new tool's /speckit.specify must validate against all six principles plus four standards
  - Shared JSON schema to be refined during first tool's /speckit.plan that consumes it (likely COER)
-->

# Effectiveness Toolkit Constitution

## Core Principles

### I. Offline-First Architecture
All tools in the Effectiveness Toolkit MUST function entirely within the browser with no server component, login, or external database. All user data lives in the client (browser tab) and in user-controlled exported/imported files. This principle ensures:
- No network dependency during normal usage
- Data privacy by elimination of server-side collection points
- Acceptability in secure, air-gapped environments (business goal)
- Simplicity: no backend services to build, maintain, or scale

### II. Single-Session, Single-User Model
The MVP is a lightweight, single-user, single-session toolkit. Multi-user collaboration, real-time synchronization, accounts, and authentication are explicitly out of scope. A tool may be used by a coach or by a client independently, but never concurrently by multiple users on the same data. This principle ensures:
- Architectural simplicity suitable for the Solo DM ecosystem (Delivery Manager + Speckit + Copilot)
- No distributed state or conflict resolution overhead
- Clear mental model: "my project file, my session, my export"
- Focus on core value (effectiveness methodology → action plans) rather than collaboration infrastructure

### III. Privacy by Default
No tool in the suite MUST call external APIs, collect telemetry, or track usage during normal operation. No third-party integrations without explicit user action. This principle ensures:
- User trust through transparent, boring data handling
- Compliance with secure environments and coaching confidentiality
- No dependency on external services
- User owns all data generated within the toolkit

### IV. Respect Upstream (mind-elixir-core)
**Applies to: Tools that extend mind-elixir-core (Memory Map Action Planner, Impact Map).**

Extensions to mind-elixir-core MUST preserve the core mental model (central topic → branches → children), default keyboard shortcuts, and interaction patterns. Changes to core behaviors (selection, drag/drop, zoom) require explicit justification. This principle ensures:
- Users familiar with mind-elixir can adopt these tools without relearning
- The fork remains maintainable relative to upstream changes
- Backwards compatibility: existing mind maps can load and display correctly
- Data model extensions are backwards-compatible and non-breaking

Tools that do not use mind-elixir (COER, Strength of Belief, Prioritization/TMM) are not bound by this principle but MUST still respect Principle V (Simplicity).

### V. Simplicity Over Completeness
Architecture, dependencies, and patterns across all tools MUST be understandable and maintainable within the Solo DM ecosystem: a Delivery Manager making decisions, Speckit providing governance and analysis, and Copilot implementing code. No bespoke frameworks or over-engineering. Each tool should use the simplest technology appropriate to its needs. Prefer boring, proven solutions. This principle ensures:
- No accidental complexity or unnecessary abstraction layers
- Clear, navigable codebase
- Reduced onboarding friction and future technical debt
- Fast time-to-MVP and ease of iteration based on coach feedback
- Tools can range from standalone HTML (forms) to Vite/TypeScript (visual tools) based on actual complexity requirements

### VI. Shared Data Format & Inter-Tool Data Flow
All tools in the Effectiveness Toolkit MUST read from and write to a single, user-controlled JSON project file with namespaced sections per tool. Data flows between tools (e.g., obstacles from COER feed into Strength of Belief; actions from Strength of Belief become branches in the Memory Map) MUST use this shared file as the integration mechanism — never direct tool-to-tool coupling. This principle ensures:
- Portable, offline data: a single file is the complete project state
- Tools can be developed, deployed, and used independently
- No hidden data channels or implicit state sharing
- Users can inspect, back up, and version-control their project file
- Future tools can be added without modifying existing tools' internals
- The shared file format MUST be versioned for migration safety

## Development Standards

### VII. Testing Standards

#### Test Generation Requirements
- Every task marked "Implementation" must generate corresponding tests
- Test types required (where applicable to the tool's complexity):
  * Unit tests: Individual function validation
  * Integration tests: Component interaction validation
  * Smoke tests: Basic "app doesn't crash" validation
- Minimum coverage target: 70% for tools with build systems (Vite/TypeScript tools)
- For standalone HTML tools (e.g., COER): manual testing is acceptable as primary validation, but critical paths (save/load, data format compliance) MUST have automated tests or documented manual test scenarios

#### Test Execution Strategy
- Unit + Integration tests run on every commit (for tools with test infrastructure)
- Manual verification required for:
  * Visual UI components
  * Complex user workflows
  * Accessibility features
  * Inter-tool data flow (loading a project file modified by another tool)

#### Acceptance Criteria Format
Every task MUST have acceptance criteria formatted as:
- **Given**: Initial state
- **When**: User action
- **Then**: Expected outcome (must be pass/fail testable)

This is the root-cause fix for MVP bugs: tasks without ACs produce ambiguous implementations.

### VIII. Commit Standards
- Follow Conventional Commits v1.0.0
- One commit per task with task ID in scope
- Format: `type(scope): description [task-id]`
- Example: `feat(coer): add save-to-project-file [T-002.03]`
- Scope SHOULD identify the tool (e.g., `coer`, `memory-map`, `sob`, `tmm`, `impact-map`) or `shared` for cross-tool work

### IX. Environment Configuration Standards

**Mandatory requirements for tools with build systems (Vite/TypeScript):**
1. Use `dotenv` (Node) for automatic .env loading where environment variables are needed
2. Config.validate() MUST be called at application entry points if environment configuration exists
3. .env.example MUST exist with all required variables documented
4. Users should NEVER need to run `source .env` manually

**Task generation requirement:**
Phase 0 MUST include (where applicable):
- [ ] T-000.X: Configure automatic .env loading and create .env.example

**For standalone HTML tools:** Environment configuration is typically unnecessary. If needed, use inline configuration or a simple config object. Do not introduce build tooling solely for .env support.

### X. Console Output Standards

**During build, test, or batch processing, output MUST be human-scannable:**
- Show progress as: "Processing X/Y - [status]"
- Summarize, don't enumerate every action
- Group related messages
- Use clear status indicators: ✓ success, ✗ failure, ⏳ processing

**Bad**: "file 1 - trimming... submitting... request... unsuccessful..."
**Good**: "Processing 1/197 - ✗ Unresolved (both validators failed)"

## Specification Structure Principle

All functional requirements (FRs) MUST be nested under their owning User Story.
- Format: FR-USX.N where USX = User Story number
- Cross-cutting requirements use FR-000.X
- This ensures requirements are discovered in context, not by global search

## Technical Guardrails

### Mind-Elixir Tools (Memory Map Action Planner, Impact Map)

#### Base Technology
- **Core Engine**: Fork of `mind-elixir-core` (https://github.com/ssshooter/mind-elixir-core)
- **Build System**: Vite + TypeScript
- **Deployment**: Web application (HTML/CSS/JavaScript), runs entirely in the browser
- **Dependencies**: Kept minimal; new dependencies require justification (complexity vs. value trade-off)

#### Node Data Model
Extend the default node with optional, backwards-compatible attributes:
- **start date** (ISO 8601 or null)
- **due date** (ISO 8601 or null)
- **invested time** (hours or null)
- **elapsed time** (hours or null)
- **assignee** (free text, null, or structured minimal reference)
- **status** (e.g., "Not Started", "In Progress", "Completed", or null)

**Backwards Compatibility Rule**: Existing mind-elixir features MUST ignore these attributes safely (graceful degradation). Node IDs and structural relationships MUST remain stable.

#### Export & Tabulation
Mind-elixir-based tools MUST support export-to-table operations:
- **Format**: CSV (minimum), HTML table view (should), Excel/XLSX (optional if disproportionate complexity avoided)
- **Content**: Rows including node ID, depth/level, title, start date, due date, invested time, elapsed time, assignee, status, parent reference/path
- **Design**: Flattens the tree into a linear, actionable format suitable for external planning or tracking tools
- **Implication**: Export must work without server; format should be versioned for migration safety

### Form-Based Tools (COER, Prioritization/TMM)

#### Base Technology
- **Deployment**: Standalone HTML or lightweight web application, runs entirely in the browser
- **Build System**: No build tools required unless complexity demands it; prefer zero-config delivery
- **Dependencies**: Minimal to none; standard browser APIs preferred

### Diagram-Based Tools (Strength of Belief)

#### Base Technology
- **Deployment**: Web application, runs entirely in the browser
- **Build System**: To be determined during `/speckit.plan`; choose simplest option that supports the interactive diagram requirements
- **Dependencies**: Minimal; prefer canvas/SVG with standard APIs over heavy diagram libraries unless justified

### All Tools — Persistence & File Format
- **Primary Mechanism**: File-based save/load using the shared JSON project file (see Principle VI) with no backend or cloud dependency
- **Shared File Structure**: The project file contains a top-level envelope with version metadata and an array of initiatives. Each initiative holds namespaced sections for each tool (e.g., `coer`, `sob`, `memoryMap`, `tmm`, `impactMap`). Sections not yet populated are `null`.
- **Tool Independence**: Each tool MUST be able to load a project file and operate on its own section without requiring other sections to be populated. A tool MUST NOT fail or degrade if sections for other tools are `null` or absent.
- **Format Requirements**: Stable, versioned format to reduce future migration pain
- **Optional Enhancement**: localStorage or IndexedDB for "last open project" convenience (not primary persistence)
- **Implication**: User explicitly controls save/load; file system is the source of truth

## User Experience Principles

### Target Users & Terminology
- **Primary Users**: Executive coaches delivering the Personal Efficiency Program (PEP), senior executives and coachees participating in coaching sessions
- **Language**: Prefer PEP effectiveness terminology (e.g., "Big Rock", "invested time", "elapsed time", "Circle of Influence") over generic project-management jargon
- **Model**: "A toolkit that guides you from priorities to action plans" — not a full project management suite

### UI/UX Guardrails (All Tools)
- **Low Friction**: Every tool should be immediately usable with minimal instruction
- **Accessibility**: Support keyboard navigation and semantic HTML for assistive technologies
- **No Tracking**: No analytics, cookies, or usage monitoring
- **Consistent Visual Language**: Tools in the suite should feel like they belong together (consistent layout patterns, typography, color usage) without requiring a shared component library in MVP

### UI/UX Guardrails (Mind-Elixir Tools)
- **Node Creation & Editing**: Keep friction as low as mind-elixir's default (fast, keyboard-friendly)
- **Attribute Editing**: Use side panel, modal, or inline editor; MUST NOT clutter the core map view
- **Visual Consistency**: Preserve mind-elixir's default layout, colors, and iconography where possible

## Scope Boundaries

### Suite-Wide: In Scope
- Five tools corresponding to the five PEP principles of effectiveness: Prioritization (TMM), Clarity of End Result (COER), Strength of Belief (SoB), Memory Map Action Planner, Impact Map
- Shared JSON project file enabling data flow between tools
- Each tool independently deployable and usable (no mandatory tool ordering)
- Offline, serverless operation across all tools
- Monorepo structure with separate folders per tool

### Suite-Wide: Explicitly Out of Scope
- Multi-user collaboration, accounts, or authentication
- Backend services or cloud persistence
- Real-time synchronization or conflict resolution
- Integrations with external tools (Jira, Trello, calendar systems, etc.)
- A unified launcher/hub UI in MVP (tools are accessed independently; integration deferred)
- Mobile native apps (web-only for MVP)

### Tool-Specific Scope
Each tool defines its own in-scope and out-of-scope boundaries in its `/speckit.specify` output (spec.md). The constitution provides suite-wide guardrails; tool specs provide feature-level boundaries.

## Speckit Governance

### Solo DM Ecosystem
This project follows the Solo DM role model:
- **Delivery Manager (You)**: Product Owner + Delivery Manager + Tester. Makes all scope decisions, runs manual tests, curates the backlog.
- **Speckit**: BA + Architect + QA Lead + Governance. Enforces this constitution, maintains traceability, finds ambiguity.
- **Copilot**: Developer + Test Analyst. Implements code, generates tests, acts on Speckit artifacts.
- **Web Claude**: Business Analyst (sounding board for scope). Strategic thinking, business statements, constitution drafting.

Development constraints and workflow principles (time-boxed iterations, just-in-time architecture, manual testing as primary validation) are maintained in `solo-developer-principles.md` and referenced during `/speckit.specify` — they are NOT part of this constitution to avoid circular reasoning.

### Constitution as Enforcement Point
All specifications, plans, and tasks MUST pass a "Constitution Check" gate before Phase 0 research begins (and re-checked after Phase 1 design in the implementation plan). The following triggers a **constitutional violation**:

- Any requirement introducing a backend service, cloud storage, or external API (except graceful, opt-in integrations explicitly approved in future amendments)
- Multi-user features, authentication, or real-time collaboration in the MVP
- Dependency on third-party libraries without clear simplicity/value justification
- Over-engineering or architectural patterns not maintainable within the Solo DM ecosystem
- A tool that writes data outside the shared JSON project file structure without explicit justification
- A tool that requires another tool's section to be populated in order to function (violates tool independence)
- Tasks without Given/When/Then acceptance criteria (violates Section VII)
- Commits not following Conventional Commits format (violates Section VIII)

### Speckit Workflow Compliance
- **Specs** (`/speckit.specify`): Feature requirements MUST respect scope boundaries and not propose out-of-scope items (collaboration, backend, advanced scheduling). Each tool gets its own spec branch. FRs MUST follow the Specification Structure Principle (FR-USX.N format).
- **Plans** (`/speckit.plan`): Technical approach MUST maintain Simplicity and Offline-First principles; plans introducing complexity require explicit rationale
- **Tasks** (`/speckit.tasks`): Task sizes and phrasing MUST assume the Solo DM ecosystem; no "team collaboration" or "distributed consensus" tasks. Every task MUST include Given/When/Then acceptance criteria.
- **Implementation** (`/speckit.implement`): Code changes must preserve upstream compatibility (for mind-elixir tools) and shared data format stability (for all tools)

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

**Version**: 1.2.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2026-02-22