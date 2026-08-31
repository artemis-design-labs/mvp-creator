# Omni Repo
**Status:** hypothesis-set | **Hook:** Stop translating your knowledge to fit your tool. Store it in the format it lives in — and retrieve it ready to use.

## 1. Foundation Hypothesis
**Universal Problem:** No single tool understands the *format* of what you are storing. Everything gets flattened into a document, so a prompt becomes a paragraph, a financial model becomes a wall of text, and a code snippet loses its syntax. Retrieval is slow, re-use is painful, and nothing is structured for how you will actually use it again.

### Segment 1: Knowledge workers, AI practitioners, and team leads who oper
**Who:** Knowledge workers, AI practitioners, and team leads who operate across 5+ tools daily — Notion, GitHub, Google Sheets, Slack, and various AI platforms — and lose hours each week hunting for the right piece of information in the wrong place.
**Pain Point:** No single tool understands the *format* of what you are storing. Everything gets flattened into a document, so a prompt becomes a paragraph, a financial model becomes a wall of text, and a code snippet loses its syntax. Retrieval is slow, re-use is painful, and nothing is structured for how you will actually use it again.
**Resolution:** A format-aware central repository with specialized modules for each content type: an AI Prompt Library (tags, folders, one-click copy), a Code Snippet Vault (syntax-highlighted, language-tagged), Financial Spreadsheets (in-app grid), Employee and Vendor Profiles, and a universal search that retrieves by type and tag — not just keyword.

**Universal Solution:** A format-aware central repository with specialized modules for each content type: an AI Prompt Library (tags, folders, one-click copy), a Code Snippet Vault (syntax-highlighted, language-tagged), Financial Spreadsheets (in-app grid), Employee and Vendor Profiles, and a universal search that retrieves by type and tag — not just keyword.
**Anti-Customer:** Casual personal note-takers who only need free-text journaling (Obsidian, Apple Notes users). Enterprise orgs with existing IT-approved knowledge management platforms they are locked into.

## 2. Unfair Advantage
**Capability:** Can be built modularly: each content type is its own renderer (Monaco for code, ProseMirror for rich text, Handsontable for spreadsheets, a prompt schema for AI assets). No single dependency owns the architecture.
**Motivation:** Context-switching between 6 tools to find one thing is the highest-friction part of modern knowledge work. Solving it means getting hours back per person per week.
**Insight:** Every competitor (Notion, Coda, Obsidian) treats format as a display concern — they store everything as blocks of text and let the UI dress it up. The insight is that format-awareness at the *data model* level — not just the UI — is what makes retrieval fast and re-use frictionless.

## 3. Principles
- Format-first > Feature-first
- Retrieve in one action > Store in ten steps
- Structure > Search
- Modular depth > Surface breadth

## 4. The Click Test
**Riskiest Assumption:** Users will maintain a dedicated specialized repo instead of defaulting to Notion or a shared Google Drive, because the format-aware experience is meaningfully faster than searching a generic doc.
**Test Method:** Ship the Prompt Library module as a standalone free tool. Measure if AI practitioners (target: prompt engineers, LLM developers) migrate their prompt collections from Notion/docs within 2 weeks of signing up.
**Success Metric:** 40 active users each storing 15+ prompts with tags and folders within 30 days — with a 60% week-2 return rate.
