# Indexing Triggers

## 🎯 Principle
Any event that changes what a user can search, read, or understand should trigger indexing.

---

# 🧾 Description

Defines the FusionLive events that trigger indexing updates after initial workspace indexing completes.

---

# ✅ Trigger Categories

## FL Core
- document upload
- document revision
- metadata update
- document title/reference change
- folder move
- permission change

---

## Workflow & Deliverables
- review status changes
- workflow transitions
- overdue state changes
- approval status changes
- rejection state changes

---

## Relationships
- attachment added
- uncontrolled attachment added
- linked document changes

---

## Derived State
- computed workflow values
- late review calculations
- bottleneck indicators

---

# ✅ Behaviour

## FR1 — Incremental Indexing
The system shall:
- incrementally update changed content

---

## FR2 — Async Processing
Indexing shall:
- execute asynchronously

---

## FR3 — Trigger Deduplication
Rapid repeated events shall:
- be debounced/batched where appropriate

---

## FR4 — Failure Handling
Failed indexing events shall:
- retry asynchronously
- not block user workflows

---

# 🚧 Future Scope

Future phases may introduce:
- full re-index operations
- analytics indexing
- richer derived-state intelligence
