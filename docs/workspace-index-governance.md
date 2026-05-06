# Index Governance

Managed via the **Administration** nav-tab → **Company Information** → **AI Indexing** tile.

## Admin content header

Shown above the AI Indexing grid, matching the standard FusionLive admin
heading pattern used elsewhere (e.g. *Manage Company Workspaces*):

- **Administration** tab — small navy (`#1a237e`) tab on a white background,
  bold white text, no border-radius, sits flush against the left edge.
- **AI Indexing Configuration** sub-heading — bold dark text on a white
  strip directly below the tab, separated from the tab by a thin divider
  and from the content below by a 1px border.

Implemented as a north-region `Ext.Panel` with class `fl-admin-content-hd`
inside `FusionLive.AiIndexingPanel`'s border layout. There is no panel
title and no custom dark blue header bar.

## Priority controls

The Priority Controls card (top-right of the toolbar) contains **four**
icon-only buttons in this order:

1. **Move to top** — solid bar above ▲
2. **Move up** — ▲
3. **Move down** — ▼
4. **Move to bottom** — solid bar below ▼

Buttons share the `.fl-prio-btn` class (28×28, white, 1px border, navy
hover). The bar in the edge buttons is drawn with a `::before` /
`::after` pseudo-element pinned to the top/bottom of the button so the
triangle stays vertically centred and the bar stays horizontally aligned
with the triangle's optical centre (the ▲ and ▼ glyphs sit slightly
differently in their cells, so each bar has its own `left` offset).

Behaviour:

- **Move to top / bottom** — `moveToEdge('top'|'bot')` removes selected
  rows in document order (reversed for `bot`) and re-inserts them at the
  start/end of the store, then calls `refreshRanks`.
- **Move up / down** — `moveSelected('up'|'down')` shifts each selected
  row by one position, then calls `refreshRanks`.
- The previous **refresh** (↻) button has been removed; rank rebuilding
  happens automatically after every move.
