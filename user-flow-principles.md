# User Flow Design Principles

These principles govern how user flows are structured, generated, and evaluated in MVP Creator.

---

## 1. Anchor Flows in User Personas and Mental Models

**Focus on Personas Over Screens.** Every flow is built around a specific user persona — their motivations, mental model, and goal — not around a sequence of UI screens. The persona field is required before generation runs.

**Define Explicit Boundaries.** Every flow must declare:
- `entryPoint` — the triggering event or context that brings the user into the flow (e.g. "receives Slack notification", "lands on empty dashboard for the first time")
- `exitPoint` — the observable outcome that marks goal completion (e.g. "first token sync succeeds and diff is reviewed")

---

## 2. Differentiate Decision Types and Branching Logic

**Separate User and System Nodes.** Each flow step carries one of four types:
- `user-action` — the user performs a deliberate action (tap, input, confirm)
- `system-action` — the system responds without requiring user input (load, validate, sync)
- `user-decision` — the user chooses a branch (e.g. "review diff" vs "skip")
- `system-decision` — the system routes based on a condition (e.g. auth check, error state)

**Account for Branching.** Decision nodes include a `branches` array describing each conditional path and its label. Flows are never forced to be linear — real user paths fork.

---

## 3. Explicitly Map System Behaviors, Edge Cases, and AI States

**Cover All System States.** Every step where the system responds must declare a `systemState`:
- `idle` — waiting for user input
- `loading` — async operation in progress
- `success` — operation completed successfully
- `error` — operation failed; recovery path required
- `empty` — no data exists yet; onboarding prompt shown

**Integrate AI Interaction Loops.** Steps involving AI or automation must describe the full loop: input → processing → output → feedback. This includes:
- Confidence indicators (e.g. "42 violations detected with high confidence")
- Explainability affordances (e.g. "Why is this flagged?")
- Failure states and recovery mechanisms (e.g. "Scan timed out — retry with smaller scope")

**errorPath field.** Any step with `systemState: error` must include a non-empty `errorPath` describing the recovery route.

---

## 4. Explore Divergent Flow Concepts

During ideation, at least 2–3 divergent flow variations should be explored before committing to a single version. The `generatedAt` field tracks when a flow was last generated, signaling staleness. Regeneration produces a new flow concept — old ones should be saved for comparison.

---

## 5. Minimize Friction and Prevent Errors

**Friction field.** Each step records its `friction` — the pain, cognitive load, or delay a user experiences. This surfaces bottlenecks for optimization.

**Forcing functions.** Decision steps must include at least one branch that represents the error or fallback path. Flows without error branches are flagged as incomplete.

**Design toward direct selection.** Steps that currently require manual text input should be marked as optimization candidates when a direct-selection alternative exists.

---

## 6. Maintain Alignment with Information Architecture

**Navigation context.** Each step includes a `navContext` field — the location in the product's IA where the step occurs (e.g. "Plugin panel → Value Hunter tab", "Settings → Integrations → GitHub"). This ensures the flow maps to real navigable screens, not abstract interactions.

**Orientation markers.** Steps that represent a page or context transition should be labeled clearly so a reader can reconstruct the breadcrumb trail through the product.

---

## Step Type Reference

| Type | Color | When to use |
|---|---|---|
| `user-action` | Purple | User clicks, inputs, submits |
| `system-action` | Blue | System loads, validates, syncs |
| `user-decision` | Amber | User chooses a branch |
| `system-decision` | Teal | System routes conditionally |

## System State Reference

| State | Meaning |
|---|---|
| `idle` | Waiting for user |
| `loading` | Async op in progress |
| `success` | Op completed |
| `error` | Op failed — needs errorPath |
| `empty` | No data; onboarding context |
