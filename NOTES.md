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

## Latest change
**"Put the prompt panel in the response panel"** — moved `#fl-input-area` from page-level sibling to inside the right panel body so it spans only the right column and resizes with the splitter.

Edits made:
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
