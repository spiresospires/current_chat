# Context Model

## 🎯 Job Story
When I use Workspace Chat,
I want the system to automatically understand my current workspace,
so that I can ask questions immediately without additional setup.

---

# 🧾 Description

Defines how workspace context and indexing visibility operate within the Workspace Chat MVP.

Enterprise Chat context selection is deferred until Phase 2.

---

# ✅ Functional Requirements

## FR1 — Workspace Context
The system shall:
- automatically use the active workspace as context

---

## FR2 — Context Scope
Workspace Chat shall:
- only query the active workspace

---

## FR3 — Context Visibility
The active workspace context shall be visually represented within the Chat UI.

---

## FR4 — Index Status Visibility
The system shall display:
- indexing status
- processed counts
- status chip

using an inline pill model.

---

## FR5 — Incomplete Index Handling
If indexing is incomplete:
- available indexed data may still be queried
- the system shall not block the user

---

# ✅ Acceptance Criteria

## AC1 — Active Workspace
Given Workspace Chat is opened
Then the current workspace becomes the active context

---

## AC2 — Workspace Restriction
Given Workspace Chat is active
Then results only come from the active workspace

---

## AC3 — Status Visibility
Given indexing is in progress
Then the inline indexing pill displays status information

---

## AC4 — Partial Indexing
Given indexing is incomplete
When a query is executed
Then indexed content may still be returned

---

# 🚧 Future Scope

## Enterprise Chat
Future Enterprise Chat will:
- require explicit workspace selection
- support multi-workspace querying
- introduce expanded governance controls
