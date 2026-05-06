# current_chat — Session Progress Notes

Repo: `c:\GitHub\current_chat` — remote: https://github.com/spiresospires/current_chat
Git identity: spiresospires / oliver.spires@idoxgroup.com

## Project state
Vanilla HTML/CSS/JS chat feature converted to **Ext JS 3.4.1-1** (loaded from cdnjs;
only 3.x version hosted there, backward compatible with target 3.1).

## File structure
- `index.html` — page chrome + `<div id="fl-chat-container">` (Ext renders here) + `<div id="fl-input-area">` (plain HTML, gets moved into right panel at runtime)
- `css/styles.css` — `fl-` prefixed classes on top of Ext blue theme
- `js/app.js` — all `FusionLive.*` Ext.extend components + bootstrap

## Components (in app.js)
- `FusionLive.HistoryPanel` — left history list, `newchat` event, rename/pin/delete via Ext.menu
- `FusionLive.MessagesPanel` — message bubbles + AI response with **doc links list** (not a grid)
- `FusionLive.InputPanel` — defined but UNUSED (kept for reference)
- `FusionLive.DocGrid` — defined but UNUSED
- `FusionLive.RightPanel` (~line 518) — `layout: 'fit'`, contains MessagesPanel; `afterRender` injects `#fl-input-area` DOM into its body
- `FusionLive.ChatPanel` — border layout: west=HistoryPanel (split:true, draggable), center=RightPanel
- Bootstrap `Ext.onReady` — renders ChatPanel into `#fl-chat-container`, wires plain JS events on `#fl-chat-textarea`/`#fl-send-btn`/`#fl-reasoning-cb`

## Key gotchas / fixes
- **Send button rendering**: Ext JS 3.4 CSS resets `<button>` to thin line. Solution: input HTML stays as plain HTML in `index.html`, NOT inside an Ext panel. Tried table layout / !important / div role=button — all failed. Plain HTML outside Ext is the only working approach.
- `Ext.filter` doesn't exist in Ext 3 → use `Ext.each`
- `autoExpandColumn` requires column `id` (e.g. `id: 'col-title'`)
- cdnjs only has Ext JS 3.4.1-1 (no 3.1.x)
- PowerShell heredoc hangs — use temp files + `Get-Content -Raw` / `Set-Content` for file assembly
- **Padding inside Ext panels**: applying `padding` via CSS on the panel's outer element does NOT clip child overflow correctly — Ext panels nest a `.x-panel-body` that is the actual content host. Always apply `padding` (and content `background`) via `bodyStyle` config (or target `.x-panel-body` in CSS), otherwise children overflow past visible bounds and bubbles get chopped at the edge.
- **Border-layout container background**: `.x-border-layout-ct` has its own default background (light blue-grey) that shows through under regions and below the splitter — override it explicitly to match the desired panel colour.
- **Glyph fonts**: Unicode "vertical ellipsis" (`&#8942;`) and "midline horizontal ellipsis" (`&#8943;`) render inconsistently across system fonts (often invisible/missing glyph). Use an inline SVG of three circles for a reliable `⋯` menu button.

## Recent changes

### "Put the prompt panel in the response panel"
Moved `#fl-input-area` from page-level sibling to inside the right panel body so it spans only the right column and resizes with the splitter.

1. `js/app.js` `FusionLive.RightPanel` — added `afterRender` that does:
   ```js
   this.body.setStyle('position', 'relative');
   var inputEl = document.getElementById('fl-input-area');
   if (inputEl && inputEl.parentNode !== this.body.dom) {
       this.body.dom.appendChild(inputEl);
   }
   ```
2. `css/styles.css` — `#fl-chat-container { bottom: 0; }` (was `bottom: 110px`); added `z-index: 5` on `#fl-input-area`
3. `css/styles.css` — `.fl-messages-area` padding bottom changed to `130px` so messages don't hide behind pinned input

### History quick-action menu always visible
- `js/app.js` — replaced text glyph in `.fl-hist-menu-btn` with an inline 3-circle SVG so the ⋯ icon renders reliably regardless of system font.
- `css/styles.css` — menu button is now a 22×22 boxed button with light grey background + border, always visible (no longer hover-only); its bg/border highlight on hover and on the active item.
- `.fl-hist-title` / `.fl-hist-date` got `padding-right: 24px` so the title text never sits under the menu button.

### Thin splitter + history panel padding fix
- `css/styles.css` — added `.fl-chat-panel .x-layout-split-west { width: 4px !important; background: #e0e3eb !important; border: none !important; }` to override Ext's default thick splitbar.
- `js/app.js` `HistoryPanel.initComponent` — moved `padding: 12px 10px` from CSS on the outer panel into `bodyStyle` so it applies to `.x-panel-body`. (Previously items overflowed past the panel because padding was on the wrong element, making the splitter appear thick and obscuring the menu buttons.)

### Consistent grey "chat container" background
- `js/app.js` `FusionLive.RightPanel` — added `cls: 'fl-right-panel'`.
- `css/styles.css` — `.fl-right-panel, .fl-right-panel .x-panel-body, .fl-right-panel .x-panel-bwrap { background: #f8f9fb; }` so the response column has a uniform grey backdrop; only message bubbles, doc-links list, history list, and input box stay white.

### Bubble wrap + responsive layout
- `css/styles.css`
  - `body { background: #fff; }` (was `#f0f2f5`) so the area below the chat blends seamlessly.
  - `.fl-msg { min-width: 0; }` and `.fl-bubble { word-wrap: break-word; overflow-wrap: anywhere; max-width: 100%; }` so long prompts wrap inside the right panel instead of being clipped at the edge.
- `js/app.js` `FusionLive.MessagesPanel.initComponent` — moved padding into `bodyStyle: 'padding:24px 28px 130px;background:#f8f9fb;'`. Apply padding via panel body, not the outer panel, otherwise the bubble extends past the visible right edge.

### Border-layout container background override
- `css/styles.css` — `.fl-chat-panel .x-border-layout-ct { background: #fff !important; }` to remove the default light blue-grey strip Ext renders below the regions/splitter.



### Administration view (Workspace AI Indexing Configuration)

Brand-new top-level view shown when the **Administration** nav-tab is clicked. Lives alongside (not inside) the Chat view; nav-tab handler swaps containers.

**HTML — `index.html`**
- Added `<div id="fl-admin-container" style="display:none;">` next to `#fl-chat-container`.
- Added small workspace indexing pill inside `#fl-input-area` (top-right): `Indexing 1,487 / 1,750 · Hinkley Point C` — non-intrusive live counter for the current workspace.

**JS — `js/app.js` new components**
- `FusionLive.AdminSideMenu` (west, 230px) — accordion of admin sections; "Company Information" expanded by default with icon-tile sub-items in a 2-col grid; "AI Indexing" tile is `.fl-active`. Click section header toggles `.fl-open`; click tile fires `tileclick` and updates active state.
- `FusionLive.AiIndexingPanel` (center) — border layout: white header strip ("AI Indexing Configuration") north + content center. Content has `tbar` (title block + Priority Controls card with ▲ ▼ ↻) and `bbar` (page label + CSV link + record count).
- `FusionLive.AdminPanel` — wraps the two in a border layout with a 4px splitter.
- Bootstrap `Ext.onReady` rewired: `showChat()` / `showAdmin()` swap container visibility; admin panel is lazy-rendered on first visit; chat input area is reparented into the chat container while admin is visible so it doesn't bleed through.

**Grid — `FusionLive.AiIndexingPanel`**
- Columns: Select (CheckboxSelectionModel) | RANK (blue, dimmed when excluded) | WORKSPACE NAME (with green/grey status dot) | MEMBERSHIP (italic) | INDEX FOR AI CHAT (toggle switch) | QUEUE STATUS.
- 20 mock workspaces.
- Toggle interaction: clicking flips `indexed` and re-categorises queue state (`excluded` ↔ `queued`/`progress`).
- Priority controls: select rows then ▲/▼ to reorder; ↻ rebuilds rank numbers.

**Queue Status column (replaces former progress bar)**
- Mock data fields: `processedCount`, `queueTotal`, `queueState` (`done` | `progress` | `queued` | `excluded`).
- Renders as text counter `1,487 / 1,750` — first number bold navy 14px, slash muted, total smaller (12px) muted grey.
- Status chip beside the counter: **Indexing** (navy chip), **Organised** (green chip + ✔) when complete, **Initialised** (amber chip + ◷) when queued. Excluded rows show italic "Excluded from index".
- British English labels throughout (Indexing, Initialised, Organised).

**Chat-side indexing pill (`#fl-index-status`)**
- Small rounded pill anchored top-right of input area; pulsing navy dot + label + counter + workspace name.
- IIFE in `Ext.onReady` increments `processedCount` every 900ms (`+1.5%` of remaining each tick); on completion the dot turns green, animation stops, label flips to **Organised**.

**CSS — `css/styles.css`**
- `#fl-admin-container { position: absolute; top: 115px; ... }` — same chrome offset as chat container.
- `.fl-admin-side` accordion + 2-col tile grid styles; navy hover/active.
- `.fl-ai-header` — clean **white** strip with navy text + bottom border (rejected the original purple-blue `#4a5cd0` background).
- `.fl-ai-grid` — restyled to match the chat response doc-list card: 6px radius, soft `#dde2ef` border, alt-row `#f7f8fc`, hover `#eef2ff`, selected `#e3ebff`, no vertical cell borders, tight 10×8 padding.
- `.fl-prio-card` — bordered pill with three ▲ ▼ ↻ icon-buttons.
- `.fl-toggle` — 38×20 pill switch; navy `#1a237e` when on (unified with brand colour, was `#4a5cd0`).
- `.fl-q-*` — Queue Status text styles (replaces removed `.fl-prog-*` progress-bar styles); chip colours per state.
- `.fl-index-status` — chat-side pill with `@keyframes fl-index-pulse` ring animation; `.fl-done` modifier swaps to green non-animated.

## Key gotchas (this round)
- **Ext 3 grid renderers** can read sibling fields via `rec.get('fieldName')` — used to drive renderer output from `queueState` while the column's `dataIndex` is `processedCount`.
- **Header strip colour**: the first `#4a5cd0` purple-blue felt out-of-palette next to the existing navy `#1a237e` / `#002060`. Resolved by making the header white with navy text and a single `border-bottom`. Same swap unified the toggle-on and (former) progress-bar colours to `#1a237e`.
- **Container swap**: hiding `#fl-chat-container` is not enough — `#fl-input-area` is `position:absolute` to the page, so it must be reparented into the chat container before showing admin, otherwise it floats over the admin grid.
