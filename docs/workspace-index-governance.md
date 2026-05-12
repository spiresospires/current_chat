# AI Index Governance

## 🎯 Job Story
When administering AI indexing,
I want to control which workspaces are indexed,
so that I can manage governance, privacy, and indexing priority.

---

# 🧾 Description

AI Index Governance is managed via:

Administration → Company Information → AI Indexing

This area controls:
- workspace inclusion
- indexing priority
- queue visibility

---

# ✅ Functional Requirements

## FR1 — Workspace Inclusion
Administrators shall be able to:
- enable indexing
- disable indexing

using the `AI CHAT` toggle control.

---

## FR2 — Inclusion Behaviour
When enabled:
- workspace is included in indexing
- if previously paused, indexing **resumes from the last processed position** (never restarts from scratch)
- if never previously indexed, indexing is initialised

When disabled:
- in-progress indexing for the workspace stops
- already-processed index data is **preserved**, not discarded
- the workspace is marked as `Paused`

---

## FR2a — Pause / Resume Persistence
While a workspace is in the `Paused` state, the system shall retain:
- processed document count
- total queued count
- prior indexing rank

On re-enable, the resumed state is determined from the retained counts:
- `processed >= total` → `Indexed`
- `0 < processed < total` → `Partial`
- `processed == 0` → `Initialised`

---

## FR3 — Priority Management
Administrators shall be able to:
- move to top
- move up
- move down
- move to bottom

within the indexing queue.

The controls shall be presented as **icon-only buttons** (no labels, no manual refresh button). Rank rebuilding is automatic — see FR4.

---

## FR4 — Automatic Rank Updates
The system shall:
- automatically recalculate ranking
- avoid requiring manual refresh

---

## FR5 — Index Status
The system shall display:
- processed count
- total count
- indexing state

---

## FR6 — Status Representation
Status shall be represented using:
- status chips
- text counters

not progress bars.

Distinct queue states shall be visually represented:
- `Partial` — in-progress (navy chip)
- `Initialised` — queued, not yet started (amber chip)
- `Indexed` — complete (green chip with tick)
- `Paused` — administrator-disabled, progress retained (grey chip with pause glyph)
- `Excluded from index` — never indexed (italic muted text)

---

## FR7 — Admin View Layout
The AI Indexing administration view shall follow the standard FusionLive admin pattern, consistent with views such as *Manage Company Workspaces*:
- a small **Administration** tab in the brand navy colour, flush left
- a bold **AI Indexing Configuration** sub-heading directly below the tab
- the workspace grid below the sub-heading

No custom coloured header strip is used.

---

# ✅ Acceptance Criteria

## AC1 — Enable Indexing
Given indexing is disabled
When the admin enables indexing
Then the workspace becomes indexable

---

## AC2 — Disable Indexing
Given indexing is enabled and partially processed
When the admin disables indexing
Then future indexing is stopped
And already-processed index data is retained
And the workspace is shown as `Paused`

---

## AC2a — Resume Indexing
Given a workspace is `Paused` with N documents already processed
When the admin re-enables indexing
Then indexing resumes from document N + 1
And no previously processed work is repeated

---

## AC3 — Reorder Priority
Given multiple indexed workspaces
When the admin changes order
Then ranking updates automatically

---

## AC4 — Index Status
Given indexing is active
Then status counters and chips are visible

---

## AC5 — Column and Toggle Labels
Given the AI indexing grid is visible
Then the toggle column header reads `AI CHAT`
And the status column header reads `INDEX STATUS`

---

# 🔒 Non-Functional Requirements

## Security
- Only authorised admins may manage indexing

## Stability
- Queue reorder actions must not corrupt ranking state
