# FL Chat Harness — Product Requirements (Implementation Aligned)

## 🎯 Job Story
When I need to find and understand information within my project,
I want to use a conversational interface that returns clear answers and direct links to relevant documents,
so that I can make faster, more informed decisions.

---

# 🧾 Description

The FL Chat Harness introduces an AI-powered conversational interface into FusionLive.

The MVP implementation is aligned with the existing Ext JS FusionLive architecture and focuses on:
- Workspace-scoped conversational retrieval
- AI-assisted document discovery
- Hybrid responses (answer + document references)
- Conversation persistence
- AI indexing governance

Enterprise Chat has been deferred until the future Flux UI phase.

---

# 🧠 MVP Scope

## Included
- Workspace Chat
- AI indexing administration
- Conversation persistence
- AI mode switching
- Inline result rendering
- Document Details navigation

## Excluded
- Enterprise Chat
- Cross-workspace querying
- Streaming responses
- AI-generated actions/workflows
- Conversation sharing

---

# ⚠️ Confirmed Constraints

## UI Technology
- Ext JS implementation
- Existing FusionLive shell integration

## Rendering
- Non-streaming response rendering
- Structured layouts only

## Input Rendering
- Plain HTML injected into Ext container

---

# 🔗 Dependencies

- AI indexing service
- Workspace APIs
- Document Details APIs
- Authentication/session management
- Permission enforcement layer

---

# 🔒 Non-Functional Requirements

## Performance
- Chat load ≤ 2 seconds target
- Response render ≤ 5 seconds target

## Security
- Results must respect FusionLive permissions
- Non-indexed workspaces must never appear

## Scalability
- Must support 10k+ documents per workspace
