# Unified Component Registry
**Status:** hypothesis-set | **Hook:** Stop rebuilding what already exists. Find it, own it, ship it.

## 1. Foundation Hypothesis
**Universal Problem:** When an engineer needs a UI pattern, they have no fast way to know whether a production-ready component already exists, who owns it, whether it handles all required states (loading, error, empty, partial, permission-denied), or whether it is actively maintained. The result is the 'archaeology' phase: searching Storybook, Slack, GitHub, and Figma separately before concluding — wrongly — that the component doesn't exist and rebuilding it from scratch. The 'ownership vacuum' compounds this: components exist but nobody is accountable, so they drift out of spec, break quietly, and accumulate technical debt.

### Segment 1: Frontend engineers, design systems leads, and engineering ma
**Who:** Frontend engineers, design systems leads, and engineering managers at mid-to-large product companies (50–500+ engineers) who maintain a component library but lose hours every sprint to duplication, ownership confusion, and production-readiness uncertainty.
**Pain Point:** When an engineer needs a UI pattern, they have no fast way to know whether a production-ready component already exists, who owns it, whether it handles all required states (loading, error, empty, partial, permission-denied), or whether it is actively maintained. The result is the 'archaeology' phase: searching Storybook, Slack, GitHub, and Figma separately before concluding — wrongly — that the component doesn't exist and rebuilding it from scratch. The 'ownership vacuum' compounds this: components exist but nobody is accountable, so they drift out of spec, break quietly, and accumulate technical debt.
**Resolution:** A centralized component registry dashboard that serves as the single source of truth for every governed UI component in the codebase. CatalogX surfaces each component with: named ownership status (or a flagged vacuum), a production state coverage score across loading / error / empty / partial / permission-denied, recent usage analytics showing which teams are consuming it, and direct deep-links to Storybook, Figma, and source. Engineers search once and know immediately whether to use, adapt, or build.

**Universal Solution:** A centralized component registry dashboard that serves as the single source of truth for every governed UI component in the codebase. CatalogX surfaces each component with: named ownership status (or a flagged vacuum), a production state coverage score across loading / error / empty / partial / permission-denied, recent usage analytics showing which teams are consuming it, and direct deep-links to Storybook, Figma, and source. Engineers search once and know immediately whether to use, adapt, or build.
**Anti-Customer:** Solo developers or small teams (under 10 engineers) with no shared component library. Teams whose entire component system lives in a single file with no governance model. Organizations already fully committed to a vendor-locked design system platform (e.g. Salesforce Lightning) that surfaces this natively.

## 2. Unfair Advantage
**Capability:** CatalogX can be built as a thin metadata layer over existing infrastructure — Storybook, Figma, GitHub, and npm — without requiring teams to migrate their tooling. The registry ingests data from these systems via APIs and webhooks, meaning the source of truth stays where engineers already work. The production state coverage score is the core proprietary signal: no existing tool surfaces this automatically.
**Motivation:** Every hour an engineer spends on archaeology or rebuilding a duplicate component is an hour not spent on product. At 50 engineers rebuilding one medium-complexity component per sprint, the annual waste exceeds $300K in engineering time. The ownership vacuum creates a compounding problem: ungoverned components become liabilities that slow every team that touches them.
**Insight:** The bottleneck isn't component creation — it's component discovery and trust. Engineers don't reuse existing components because they can't quickly verify that the component handles their specific edge case and won't break when their PM adds a permission-gated feature next sprint. The production state coverage score solves the trust problem; the ownership field solves the accountability problem. Together they make reuse the path of least resistance.

## 3. Principles
- Discovery before creation — make finding a component faster than building one
- Trust is earned, not assumed — every component must prove its production state coverage
- Ownership is non-negotiable — every component has a named owner or is flagged as a vacuum
- Zero migration cost — work with existing Storybook, Figma, and GitHub setups
- Analytics over anecdote — usage data replaces 'I think this is used' guesswork

## 4. The Click Test
**Riskiest Assumption:** Engineers will trust CatalogX's production state coverage score enough to use an unfamiliar component without verifying it manually in source code — because if they still feel the need to open GitHub to verify, the tool hasn't solved the archaeology problem.
**Test Method:** Give 8 frontend engineers a task: 'Find a component for a permission-denied empty state and use it in a PR.' Half get Storybook only, half get CatalogX. Measure time-to-decision and whether the chosen component was actually production-ready.
**Success Metric:** CatalogX users pick a production-ready component in under 3 minutes with no GitHub archaeology. Storybook-only users average 12+ minutes or build their own. At least 6 of 8 CatalogX users say they would use the tool daily.
