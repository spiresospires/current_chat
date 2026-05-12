# AI Mode Model

## 🎯 Job Story
When asking questions,
I want to choose between fast answers and deeper analysis,
so that I can balance speed and detail.

---

# ✅ Functional Requirements

## FR1 — Available Modes
The system shall provide:
- Quick Answer
- Deep Analysis

---

## FR2 — Conversation Scope
The selected mode shall:
- apply per conversation

---

## FR3 — Persistence
The selected mode shall:
- persist with conversation state

---

# ✅ Acceptance Criteria

## AC1 — Mode Selection
Given Chat is open
When the user changes mode
Then future responses use the selected mode

---

## AC2 — Persistence
Given a mode is selected
When the conversation is reopened
Then the selected mode remains active
