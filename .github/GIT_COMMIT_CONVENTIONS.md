---
role: LN
bloom: 2. Analyse
kolb: AC
next_move: Distill Atomic Notes (Evaluate/Create)
source:
created: 2025-12-26
---

# 🧠 Git Commit Conventions

## Concept summary
%% explanation in my own words %% 
### The standard most teams follow (explicitly or implicitly)
It’s called **Conventional Commits**. Not a law, but a very widely adopted convention.
Canonical form:
```
<type>(optional scope): short description
```
The **type** answers one question:
> _What kind of change is this from the consumer’s point of view?_
Not “what files changed”, but **what meaning the change has**.
***
### What the common types actually mean
#### `feat:` Adds or changes _user-visible functionality_
Example:
- new command
- new behavior
- new capability
You used this correctly for Phase 1 / Phase 2 implementation.
***
#### `fix:` Fixes a **bug** in existing behavior
Key test:
- Was something _supposed_ to work before, but didn’t?
Your earlier commit:
```
fix(storage): ensure database directory exists before opening sqlite connection
```
Perfect use of `fix:` — that was a real defect revealed by testing.
***
#### `docs:` Changes that affect **documentation, evidence, or guidance**, not runtime behavior
This includes:
- README updates
- specs
- verification evidence
- architectural docs
- smoke test records
- **automated tests do not belong here**
Crucially:
> **`docs:` is about intent, explanation, and proof — not code execution**
***
#### `chore:`  Maintenance work that doesn’t change behavior or meaning
Examples:
- formatting
- dependency bumps
- build config
- repo hygiene
Often overused. You’ve avoided that — good.
***
#### `refactor:` Code changes that **do not change behavior**
Example:
- renaming
- reorganizing
- extracting functions
If behavior doesn’t change, it’s not a `fix:` or `feat:`.
***
#### `test:` Adds or modifies automated tests
Important:
- This is **for `/tests` code**, not manual verification evidence
- **smoke test does not belong here** a `test:` commit — it’s docs.
***
### Why this matters (even solo)
Using these types gives you:
- a readable project history
- clean separation between _implementation_, _fixes_, and _evidence_
- the ability to later answer:
    - “when did this behavior change?”
    - “when did we verify this phase?”
- compatibility with tools that generate changelogs or releases
Even as a Solo DM, you’re future-proofing yourself.
***
### A simple mental shortcut (keep this)
Ask yourself:
- **Did behavior change?**
    - yes → `feat:` or `fix:`
- **Did we explain, prove, or record something?**
    - yes → `docs:`
- **Did we just clean up?**
    - yes → `chore:` or `refactor:`

## Core argument / evidence

There's a very detailed [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) 
The Conventional Commits specification is inspired by, and based heavily on, the [Angular Commit Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).
The first draft of this specification has been written in collaboration with some of the folks contributing to the repos below to name a few:
- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog): a set of tools for parsing Conventional Commits messages from git histories.
- [parse-commit-message](https://npmjs.com/package/parse-commit-message): Extensible utilities for parsing, stringify and validating Conventional Commit messages.

This is solid and quite widely used. Much better than a cowboy definition.
## My interpretation / analysis


## Relations to other ideas
### Supports / contradicts: 
%% [[other LN or RN]] %%
- 
### Expands:
 %% [[MOC / Theme Tag]] %%
- 
## Applications (AE prep)
%% Possible use in practice %%
 

## Promotion check
- [ ] I can explain it clearly (Understand)
- [ ] I compared/linked (Analyze)
- [ ] I have an idea to apply or test (AE)

---
*Next → extract 1–n Atomic Notes (AN).*
