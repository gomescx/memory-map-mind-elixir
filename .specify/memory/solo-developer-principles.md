# Solo Developer Governance Principles
## Core Constraints
- **Single developer** with no dedicated QA or DevOps team
- **Time-boxed iterations** - aim for shippable increments every 1-2 weeks
- **Just-in-time architecture** - design only what's needed for current MVP
## Quality Standards
- Every feature must have explicit acceptance criteria
- Manual testing is the primary validation method
- Regression scenarios must be maintained for critical paths
## Scope Management
- MVP-first mindset: defer anything not essential for first user value
- "Deferred" tagged items are explicitly postponed, not abandoned
- No speculative features or premature optimization
## Architectural Biases
- Prefer simple, well-understood patterns over novel solutions
- Favor monolithic deployments until scale demands otherwise
- Choose boring technology unless there's a compelling reason not to