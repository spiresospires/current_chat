# Conversation Management

## 🎯 Job Story
When I use Chat repeatedly,
I want to organise and manage conversations,
so that I can quickly return to previous discussions.

---

# ✅ Functional Requirements

## FR1 — Conversation Persistence
The system shall:
- automatically save conversations

---

## FR2 — Conversation List
The system shall:
- display conversations in the left panel

---

## FR3 — Conversation Actions
Users shall be able to:
- rename conversations
- delete conversations
- pin conversations

---

## FR4 — Interaction Model
Conversation actions shall:
- use Ext.menu style interaction
- not use inline editing

---

## FR5 — Conversation Search
The system shall:
- search full conversation content
- automatically execute after delay

---

# ✅ Acceptance Criteria

## AC1 — Persistence
Given a conversation exists
When the user returns later
Then the conversation remains available

---

## AC2 — Rename
Given a conversation exists
When rename is selected
Then the conversation title updates

---

## AC3 — Pin
Given a conversation exists
When pin is selected
Then it moves to the top of the list

---

## AC4 — Search Delay
Given the user types in search
When typing stops for ~2 seconds
Then search executes automatically
