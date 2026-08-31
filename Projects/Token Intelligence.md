# Token Intelligence
**Status:** testing | **Hook:** One plugin to manage, sync, and enforce your token system — so your design and code are always speaking the same language, automatically.

## 1. Foundation Hypothesis
**Universal Problem:** Design tokens live in three disconnected places — Figma Variables, a design-tokens.json file, and framework configs (Tailwind, Storybook). Any change in one doesn't propagate automatically. Syncs are manual and error-prone, hardcoded values creep back in after every AI-assisted dev sprint, and nobody has visibility into which components are drifting from the token system. The result: the design system is technically maintained but practically ignored by engineers under deadline.

### Segment 1: Design systems leads and senior frontend engineers at mid-to
**Who:** Design systems leads and senior frontend engineers at mid-to-large product companies (50–500+ engineers) managing a Figma design system alongside a Tailwind/CSS-in-JS/Storybook codebase. They own the token system but spend hours each sprint manually syncing it and hunting down hardcoded values that slipped through.
**Pain Point:** Design tokens live in three disconnected places — Figma Variables, a design-tokens.json file, and framework configs (Tailwind, Storybook). Any change in one doesn't propagate automatically. Syncs are manual and error-prone, hardcoded values creep back in after every AI-assisted dev sprint, and nobody has visibility into which components are drifting from the token system. The result: the design system is technically maintained but practically ignored by engineers under deadline.
**Resolution:** A single Figma plugin with three integrated panels: (1) Token Manager — organize and govern Figma Variables with bulk operations and naming convention enforcement; (2) Token Sync — bidirectional sync between Figma Variables, design-tokens.json, Tailwind config, and Storybook themes; (3) Value Hunter — scans the Figma file for every hardcoded color, spacing value, and typography style and replaces them with the correct token in one pass.

**Universal Solution:** A single Figma plugin with three integrated panels: (1) Token Manager — organize and govern Figma Variables with bulk operations and naming convention enforcement; (2) Token Sync — bidirectional sync between Figma Variables, design-tokens.json, Tailwind config, and Storybook themes; (3) Value Hunter — scans the Figma file for every hardcoded color, spacing value, and typography style and replaces them with the correct token in one pass.
**Anti-Customer:** Solo designers with no codebase or component library. Teams on Figma Starter (no Variables access). Teams already deeply committed to Tokens Studio who are unwilling to change their export pipeline.

## 2. Unfair Advantage
**Capability:** All three token workflows share the same underlying Figma Variables API and the same token data model — making a unified plugin viable without building three separate products. The sync layer requires a lightweight companion CLI, which is a known pattern (Tokens Studio proved the market exists).
**Motivation:** Token drift is the single biggest source of design-dev inconsistency. Every hardcoded value that escapes into production is a future refactor. Closing that loop at the source — inside Figma, before handoff — has compounding impact on delivery velocity.
**Insight:** Tokens Studio and Style Dictionary each solve one part of the pipeline in isolation. The gap no tool closes is the enforcement loop: teams sync once, then drift silently for months. The Value Hunter is the feature that closes this loop — and it is the demo that will sell the entire plugin, because every DS lead who sees it run on their own file immediately sees 40+ violations they didn't know existed.

## 3. Principles
- Enforce > Document (tokens should propagate themselves, not be manually documented)
- One source of truth > Multiple independent exports
- Catch drift at handoff > Clean up drift in production
- Value Hunter first > Full platform later

## 4. The Click Test
**Riskiest Assumption:** Design system leads will adopt a new plugin even if they already use Tokens Studio or Style Dictionary — because the end-to-end enforcement loop (specifically the Value Hunter) is compelling enough to switch or add a tool.
**Test Method:** Live demo the Value Hunter to 5 DS leads — run it on their own Figma file, unannounced, and show it surfacing hardcoded values in under 60 seconds. Measure same-session install rate. Do not pitch the sync features until after the Value Hunter lands.
**Success Metric:** 3 of 5 DS leads install the plugin and run the Value Hunter on their own file within 7 days of the demo. At least 1 requests access to the Token Sync beta.
