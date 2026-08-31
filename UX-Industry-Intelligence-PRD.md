# UX Industry Intelligence — Product Requirements Document

**Version:** 1.0  
**Status:** MVP Definition  
**Last Updated:** 2026-07-15  
**Project ID:** ec5c8a4d-4a34-45ed-be4e-a520d7a1fcee

---

## 1. Problem Statement

UX designers are navigating one of the most uncertain periods in the history of the profession. AI tools are reshaping workflows, companies are restructuring design teams, and the skills the market valued two years ago may not be what it values today.

The problem is not the change — it is the absence of reliable data about the change. Designers are piecing together market signals from LinkedIn feeds, Glassdoor reviews, Reddit threads, and opinion-heavy design blogs. None of these sources provide:

- A clear view of what skills companies are actively hiring for right now
- How AI adoption is reflected in real job descriptions
- How salaries are shifting by role, seniority, tool stack, or geography
- Whether remote UX roles are growing or contracting
- What the actual ratio of in-house to agency to contractor demand looks like

The anxiety is informational, not existential. Solve the information gap and you solve the anxiety.

---

## 2. Product Vision

**UX Industry Intelligence** is a web application that aggregates, structures, and visualises live hiring and market data specifically for UX designers. It surfaces the signals that matter — skill demand, salary benchmarks, AI adoption rates, tool trends, and company hiring patterns — in a single, always-current dashboard.

**Hook:** See exactly what the market pays for, what skills are dying, and what to learn next — all in one dashboard, updated weekly.

---

## 3. Target User

### Primary Persona — The Anxious Mid-Career Designer

- **Experience:** 3–8 years in UX/product design
- **Context:** Working in-house at a tech company or agency, watching AI tools proliferate around them
- **Core anxiety:** "Am I learning the right things? Is my role safe? What do companies actually want?"
- **Current behaviour:** Reads design newsletters, follows thought leaders on LinkedIn, checks Glassdoor occasionally — but finds no aggregated, data-driven answer to their questions
- **Willingness to pay:** Yes, if the data is clearly more reliable and comprehensive than what they can find for free
- **Session behaviour:** Weekly check-in (not daily), filters by role and geography, saves or exports specific insights

### Anti-Persona (explicitly out of scope for MVP)

- Junior designers still in education — not yet navigating the live market
- Design hiring managers — they need candidate pipeline tools, not personal market intelligence
- Non-UX roles (product managers, developers) — out of scope for data coverage

---

## 4. Design Principles

These govern every product and feature decision:

1. **Data > Opinion** — Every claim shown in the app must be backed by a source and a number. No editorialising.
2. **Actionable > Comprehensive** — "What to learn next" is more valuable than a complete map of everything. Prioritise utility over completeness.
3. **Current > Historical** — A 30-day trend is more valuable than a 3-year retrospective. Data must feel fresh or it loses credibility.

---

## 5. Core Data Signals (MVP Scope)

The MVP tracks the following eight signals, derived from parsing UX job postings:

| Signal | Description | Update Frequency |
|---|---|---|
| Skill Frequency | Which skills appear most often in JDs (e.g. Figma, AI prompting, research, systems thinking) | Weekly |
| Tool Demand | Which tools are explicitly required vs. nice-to-have (Figma, Maze, Dovetail, Sprig, etc.) | Weekly |
| AI Mention Rate | % of job postings that mention AI, machine learning, or LLMs in any capacity | Weekly |
| Salary Range by Role | Min/max/median salary for UX Designer, Senior UX, Lead, Head of Design | Weekly |
| Remote vs. Onsite Ratio | % of postings that are fully remote, hybrid, or fully onsite | Weekly |
| Seniority Distribution | Ratio of junior / mid / senior / lead / head roles being posted | Weekly |
| Company Type Split | In-house product company vs. agency vs. consultancy vs. startup | Weekly |
| Geographic Demand | Top hiring cities/countries for UX roles | Weekly |

---

## 6. Features

### 6.1 Dashboard (Home)

The main landing surface after login. Shows a high-level summary of the current market state.

**Components:**
- **Market Pulse Bar** — A single-line summary auto-generated from the latest data (e.g. "Figma is required in 84% of postings. AI skills jumped 31% in 30 days. Remote roles down 12%.")
- **Top 10 In-Demand Skills** — Horizontal bar chart, ranked by frequency in current job postings. Colour-coded by 30-day trend (up/down/flat).
- **AI Adoption Meter** — A prominent metric showing the % of job postings that mention AI, with a 90-day sparkline trend.
- **Salary Snapshot** — Cards for 4 seniority levels showing median salary + 30-day delta.
- **Quick Filters** — Role type (UX Designer / Product Designer / UX Researcher / Design Lead), Geography (Global / US / UK / EU / APAC), Company type (In-house / Agency / Startup).
- **Last Updated** — Timestamp showing when data was last refreshed.

### 6.2 Skills Explorer

Deep dive into skill demand across the market.

**Components:**
- Full ranked list of all tracked skills with frequency % and 30/60/90-day trend lines
- Filter by: seniority level, company type, geography
- Skill detail card (click any skill): shows which companies are requiring it, example job posting excerpts, salary impact
- "Rising" and "Declining" tags on skills with significant momentum (>15% change in 30 days)

### 6.3 Salary Intelligence

**Components:**
- Salary table by role × seniority × geography
- Filter by: tool stack (does requiring Figma vs. not impact salary?), company type, remote vs. onsite
- Percentile breakdown (25th / median / 75th) not just averages
- "Salary vs. Skills" scatter — shows correlation between number of required skills and salary range

### 6.4 Company Tracker

Shows which companies are actively hiring UX roles and what they are looking for.

**Components:**
- List of companies with active UX postings in the last 30 days
- Per-company card: number of open roles, role types, required skills, salary range, remote policy
- Filter by: company size, industry, geography
- "Hiring velocity" indicator — companies ramping up vs. winding down UX hiring

### 6.5 AI Impact Report

A dedicated view for the AI signal — the most anxiety-producing topic for the user.

**Components:**
- AI mention rate over time (90-day chart)
- Breakdown of how AI is mentioned: required skill vs. tool familiarity vs. AI-adjacent role vs. AI-first company
- "AI-safe skills" — skills that appear in both high-AI-mention and low-AI-mention postings (i.e. always in demand regardless of AI adoption)
- "AI-accelerating skills" — skills whose demand is growing fastest in high-AI-mention postings
- Example job posting excerpts showing how AI is described in real JDs

### 6.6 Weekly Digest (Email)

An automated weekly email sent to registered users summarising the biggest changes from the past 7 days.

**Components:**
- 3 biggest skill movements (up or down)
- Salary change if any
- AI adoption rate update
- One "action item" recommendation derived from the data

### 6.7 Export

- Download current dashboard view as PDF
- Export any chart as PNG
- Copy data table as CSV (premium feature, post-MVP)

---

## 7. User Flows

### Flow 1 — New Visitor to Email Signup (Pre-Login)

```
Landing Page
  → sees Market Pulse headline + blurred dashboard preview
  → clicks "See Full Dashboard" or "Get Free Weekly Report"
  → Email capture modal
  → Confirmation email sent
  → Redirected to full dashboard (authenticated by magic link)
```

### Flow 2 — Weekly Active User Session

```
Email digest received
  → clicks "View Full Data" CTA in email
  → Magic link opens dashboard
  → Reviews Market Pulse bar (what changed this week)
  → Drills into Skills Explorer (filters by their geography)
  → Clicks a rising skill to see detail card
  → Exports the skills chart as PNG
  → Session ends
```

### Flow 3 — Deep Research Session

```
Dashboard
  → navigates to Salary Intelligence
  → filters by: Senior UX Designer / San Francisco / In-house / Remote
  → sees percentile breakdown
  → navigates to AI Impact Report
  → reviews "AI-safe skills" list
  → downloads PDF of current report
```

---

## 8. Data Architecture

### 8.1 Data Sources (MVP)

The MVP uses a combination of sources, ordered by legal safety:

| Source | Method | Data Available |
|---|---|---|
| Adzuna API | Public API (free tier) | Job postings, salary ranges, location, company |
| The Muse API | Public API | Job postings, company culture data |
| RemoteOK API | Public JSON endpoint | Remote-first job postings |
| Greenhouse / Lever | Public job board JSON | Structured postings from companies using these ATSs |
| Manual seed data | Curated CSV | Baseline dataset for launch (200–500 roles) |

> LinkedIn and Indeed are explicitly excluded from the MVP data pipeline due to ToS restrictions on scraping.

### 8.2 Data Pipeline

```
[Data Sources] 
    → Raw job postings (JSON)
    → LLM Extraction Layer (Claude API)
        - Extract: skills, tools, seniority, salary, remote policy, AI mentions
        - Classify: company type, role type, geography normalisation
    → Structured Job Record (Postgres)
    → Aggregation Layer (scheduled job, weekly)
        - Compute signal scores
        - Detect trends (delta vs. prior period)
    → API Layer (served to frontend)
```

### 8.3 Data Schema (Core)

**job_postings**
```
id, source, company_name, company_type, role_title, role_seniority,
salary_min, salary_max, salary_currency, location_city, location_country,
is_remote, is_hybrid, posted_at, raw_text, processed_at
```

**job_skills**
```
id, job_id, skill_name, skill_category, is_required, is_nice_to_have
```

**job_ai_signals**
```
id, job_id, mentions_ai (bool), ai_context (required_skill | tool_familiarity | ai_adjacent | ai_first),
ai_excerpt (text)
```

**weekly_snapshots**
```
id, week_start, signal_key, signal_value, delta_7d, delta_30d, delta_90d
```

---

## 9. Technical Stack (Recommended)

These are recommendations for vibe-coding the MVP. Swap where you have strong preferences.

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js (App Router) | SSR for SEO on landing page, RSC for dashboard |
| Styling | Tailwind CSS + shadcn/ui | Fast to build, consistent components |
| Charts | Recharts or Tremor | React-native, easy to customise |
| Auth | Resend + magic link (no password) | Reduces friction for the email-first signup flow |
| Database | Supabase (Postgres) | Managed Postgres + realtime + Row-Level Security |
| ORM | Prisma | Type-safe schema management |
| Data Pipeline | Node.js cron job or Inngest | Scheduled weekly fetch + LLM extraction |
| LLM Extraction | Claude API (claude-sonnet-4-6) | Structured extraction from raw job posting text |
| Email | Resend | Transactional + digest emails |
| Hosting | Vercel | Zero-config Next.js deployment |
| File exports | react-pdf or html2canvas | PDF/PNG export |

---

## 10. Page Structure

```
/                       Landing page (public)
/dashboard              Main dashboard (auth required)
/dashboard/skills       Skills Explorer
/dashboard/salaries     Salary Intelligence
/dashboard/companies    Company Tracker
/dashboard/ai-impact    AI Impact Report
/account                Email preferences, export history
```

---

## 11. MVP Scope vs. Post-MVP

### In MVP
- Landing page with email capture
- Dashboard with Market Pulse, top skills chart, AI meter, salary snapshot
- Skills Explorer with filters
- Salary Intelligence table
- AI Impact Report
- Weekly digest email (automated)
- PDF export of dashboard

### Post-MVP (do not build now)
- Company Tracker (requires more data volume to be useful)
- CSV export / data downloads
- User-customisable alerts ("notify me when Figma demand drops below X%")
- Salary negotiation calculator
- Job board integration / apply directly
- Team/agency accounts
- API access tier

---

## 12. Success Metrics

| Metric | Target | Timeframe |
|---|---|---|
| Email signups (static report phase) | 500 | 30 days post-launch |
| Email open rate | 25%+ | First 3 issues |
| Willingness-to-pay signal | 50+ survey respondents say yes | 30 days post-launch |
| Dashboard weekly active users | 200 | 60 days post-launch |
| PDF export rate | 15% of active users | 60 days post-launch |

### Kill Criterion
Fewer than 500 signups on the static report within 30 days.

### Pivot Criterion
500+ signups but fewer than 10% express willingness to pay — shift to a free weekly newsletter with a sponsorship model (design tools companies as sponsors).

---

## 13. Launch Sequence

1. **Week 1–2:** Seed the database with 200–500 manually curated UX job postings. Run LLM extraction. Validate data quality.
2. **Week 3:** Build and publish the static "State of UX Hiring" snapshot page. No auth, no database queries — just a rendered report with email gate.
3. **Week 4:** Drive traffic via Figma Community, ADPList, Designer Hangout, LinkedIn, Reddit (r/userexperience, r/IxD).
4. **Week 5:** Analyse signup and survey data. Go/no-go decision on full dashboard build.
5. **Week 6–8:** Build live dashboard MVP if green light. Connect to live data pipeline. Soft launch to email list.
6. **Week 9:** Public launch.

---

## 14. Open Questions

- What is the minimum viable data volume before the dashboard feels credible? (Hypothesis: 300+ job postings per weekly snapshot)
- Should salary data be shown when the sample size is small? (Recommendation: require n≥10 before showing a salary figure — show "insufficient data" otherwise)
- Free vs. paid model at launch: full dashboard free with email, or gate some features behind a paid tier from day one?
- Should the AI Impact Report be the hero feature on the landing page, given it is the most emotionally resonant signal for the target user?
