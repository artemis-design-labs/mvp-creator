# NYCEPAS
**Status:** active | **Hook:** One intelligent case file that moves with the member — across Legal, Finance, Medical, and Client Services, from application to first pension check.

## 1. Foundation Hypothesis
**Universal Problem:** NYCERS staff across Legal, Finance, Medical, and Client Services administer the retirement benefits of over 350,000 members on top of decades-old mainframe systems, paper case files, and siloed unit-specific tools. A single retirement, disability, or death-benefit case is handed off between units with no shared view of its status; tier determination and final-average-salary math is done by hand against a dense, frequently-amended pension code; and members wait months for answers. Errors are expensive and legally consequential, and the institutional knowledge that makes the system work lives in the heads of a retiring workforce.

### Segment 1: Client Services — Retirement Benefits Specialists
**Who:** Front-line examiners and counselors who receive member applications (service and disability retirement, loans, buy-backs, death benefits), verify eligibility, run estimates, and shepherd cases to payment. They are the highest-volume workflow users and the member's primary point of contact.
**Pain Point:** They juggle a green-screen mainframe, scanned PDFs, spreadsheets, and phone calls to other units to move a single case. Tier determination and final-average-salary calculations are manual and error-prone, and they cannot tell a waiting member where the case actually stands.
**Resolution:** A unified case file that auto-classifies incoming documents, pre-computes tier and eligibility, flags missing items, and shows exactly which unit holds the case and what it needs next — so specialists resolve more cases correctly and answer members with confidence.

### Segment 2: Legal, Finance & Medical reviewers
**Who:** Attorneys handling QDROs, disability appeals, and pension-code interpretation; Finance analysts validating benefit calculations and payroll; and Medical Board staff reviewing disability retirement evidence. They receive cases from Client Services and must apply specialized judgment under statutory and audit constraints.
**Pain Point:** Cases arrive with incomplete context and no linked history, forcing re-work and duplicate requests to members. There is no shared audit trail, so decisions are hard to defend and slow to reproduce when challenged.
**Resolution:** Each reviewer gets the full case with AI-surfaced relevant statute, prior determinations, and a complete audit trail — so specialized review is faster, consistent, and defensible.

**Universal Solution:** NYCEPAS (New York City Employees Pension Administration System) is a mission-critical, AI-powered workflow management system that unifies pension administration across every NYCERS business unit into one intelligent case surface. It ingests member documents, determines tier and eligibility against a codified rules engine, assists benefit calculations, routes and tracks cases across Legal, Finance, Medical, and Client Services, and answers policy questions in natural language — turning a fragmented legacy process into a transparent, auditable, high-efficiency workflow.
**Anti-Customer:** Small private-sector 401(k)/defined-contribution administrators whose plans lack the tiered statutory complexity of a public defined-benefit system, and pension funds already running a modern integrated pension administration platform (PAS) where the workflow and rules layer is not the bottleneck.

## 2. Unfair Advantage
**Capability:** NYCEPAS encodes NYCERS' tiered pension rules (Tiers 1–6), service-credit and final-average-salary logic, and cross-unit workflow into a single governed rules-and-routing engine — then layers AI document intake, calculation assistance, and natural-language policy retrieval on top. It is purpose-built for a statutory public defined-benefit system, not a generic case tool bent to fit one.
**Motivation:** In public pension administration, a wrong number is not an SLA miss — it is a benefit paid incorrectly for a retiree's lifetime, a legal exposure, and a headline. NYCERS needs speed and correctness simultaneously, with an audit trail that holds up under review, as its most experienced staff retire.
**Insight:** The knowledge that makes pension administration correct already exists — in the pension code, in decades of determinations, and in the workflow between units. It was just never made queryable, enforceable, or visible end-to-end. NYCEPAS turns tacit institutional expertise into an explicit, auditable system.

## 3. Principles
- Correctness is non-negotiable — every calculation is explainable, sourced to statute, and auditable
- One case, every unit — Legal, Finance, Medical, and Client Services share a single case file and status
- AI assists, humans decide — the system recommends and surfaces evidence; a specialist always approves
- Members deserve to know where they stand — status is transparent, not a black box
- Boring reliability > flashy features
- Outcome > Output

## 4. The Click Test
**Riskiest Assumption:** Experienced NYCERS specialists across units will trust AI-assisted tier determination, eligibility, and benefit calculations enough to adopt NYCEPAS as the system of record — rather than re-checking every result against the legacy mainframe, which would erase the efficiency gain.
**Test Method:** Run one high-volume workflow — service retirement application processing — through NYCEPAS in parallel with the legacy process for a cohort of real cases across Client Services, Finance, and Legal over eight weeks. Log every AI recommendation, every specialist override, and time-to-completion per case, with specialists approving each step.
**Success Metric:** NYCEPAS matches or corrects the legacy determination in the vast majority of cases, cuts average case cycle time meaningfully, and specialists accept its recommendations without re-checking the mainframe in most cases by the end of the pilot.
