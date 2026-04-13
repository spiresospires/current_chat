document.addEventListener('DOMContentLoaded', () => {

  // ── Auto-resize textarea ──────────────────────────────────────
  const chatInput = document.querySelector('.chat-input');
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  // ── Send on Enter (Shift+Enter for newline) ───────────────────
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  document.querySelector('.send-btn').addEventListener('click', sendMessage);

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Simulate a brief "thinking" delay then show a placeholder response
    setTimeout(() => appendBotThinking(), 400);
  }

  function appendUserMessage(text) {
    const area = document.querySelector('.messages-area');
    const msg = document.createElement('div');
    msg.className = 'msg user';
    msg.innerHTML = `
      <div class="msg-label">You</div>
      <div class="bubble">${escapeHtml(text)}</div>`;
    area.appendChild(msg);
    area.scrollTop = area.scrollHeight;
  }

  function appendBotThinking() {
    const area = document.querySelector('.messages-area');
    const msg = document.createElement('div');
    msg.className = 'msg bot';
    msg.id = 'thinking-msg';

    const useReasoning = document.getElementById('reasoningCheck').checked;
    msg.innerHTML = `
      <div class="msg-label">FusionLive AI</div>
      <div class="bubble" style="color:#aaa;font-style:italic;">
        ${useReasoning ? '<span class="reasoning-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Reasoning…</span><br>' : ''}
        Searching documents and metadata…
      </div>`;
    area.appendChild(msg);
    area.scrollTop = area.scrollHeight;
  }

  // ── History item click – highlight active ─────────────────────
  document.querySelectorAll('.hist-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.hist-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ── New Chat button – clear messages area ─────────────────────
  document.querySelector('.new-chat-btn').addEventListener('click', () => {
    document.querySelectorAll('.hist-item').forEach(i => i.classList.remove('active'));
    const area = document.querySelector('.messages-area');
    area.innerHTML = '';
    chatInput.focus();
  });

  // ── Nav tab switching ─────────────────────────────────────────
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ── Helpers ───────────────────────────────────────────────────
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Conversation item actions ─────────────────────────────────
  const PIN_SVG    = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L8 8H2l5 4-2 8 7-4 7 4-2-8 5-4h-6L12 2z"/></svg>`;
  const RENAME_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  const DELETE_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;

  function setupHistItemActions() {
    document.querySelectorAll('.hist-item').forEach(addItemActions);
  }

  function addItemActions(item) {
    // Avoid double-initialising
    if (item.querySelector('.hist-menu-btn')) return;

    // Three-dot button
    const menuBtn = document.createElement('button');
    menuBtn.className = 'hist-menu-btn';
    menuBtn.setAttribute('aria-label', 'Options');
    menuBtn.innerHTML = '&#8942;';
    item.appendChild(menuBtn);

    // Pin badge (visible when pinned, hidden on hover)
    const pinBadge = document.createElement('span');
    pinBadge.className = 'pin-badge';
    pinBadge.title = 'Pinned';
    pinBadge.innerHTML = PIN_SVG;
    item.appendChild(pinBadge);

    // Dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'hist-dropdown';
    dropdown.innerHTML = `
      <button data-action="rename">${RENAME_SVG} Rename</button>
      <button data-action="pin">${PIN_SVG} Pin to top</button>
      <hr class="hist-dropdown-divider">
      <button data-action="delete" class="danger">${DELETE_SVG} Delete</button>`;
    item.appendChild(dropdown);

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add('open');
        menuBtn.classList.add('open');
      }
    });

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      closeAllDropdowns();
      const action = btn.dataset.action;
      if (action === 'rename') renameItem(item);
      else if (action === 'pin')    togglePin(item);
      else if (action === 'delete') deleteItem(item);
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.hist-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.hist-menu-btn.open').forEach(b => b.classList.remove('open'));
  }

  function renameItem(item) {
    const titleEl = item.querySelector('.hist-title');
    const current = titleEl.dataset.name || titleEl.textContent.trim();
    const input = document.createElement('input');
    input.className = 'hist-edit';
    input.value = current;
    titleEl.textContent = '';
    titleEl.appendChild(input);
    input.focus();
    input.select();

    function save() {
      const newName = input.value.trim() || current;
      titleEl.dataset.name = newName;
      titleEl.textContent = newName;
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
      if (e.key === 'Escape') { input.value = current; input.blur(); }
    });
    input.addEventListener('blur', save, { once: true });
  }

  function togglePin(item) {
    const pinnedLabel  = document.getElementById('pinned-label');
    const recentLabel  = document.querySelector('.section-label:not(#pinned-label)');
    const pinBtn       = item.querySelector('[data-action="pin"]');
    const isPinned     = item.classList.contains('pinned');

    if (isPinned) {
      item.classList.remove('pinned');
      pinBtn.innerHTML = `${PIN_SVG} Pin to top`;
      // Return to top of Recent section
      recentLabel.after(item);
    } else {
      item.classList.add('pinned');
      pinBtn.innerHTML = `${PIN_SVG} Unpin`;
      // Insert after the last currently-pinned item, or right after the pinned label
      const lastPinned = [...document.querySelectorAll('.hist-item.pinned')].filter(i => i !== item).pop();
      if (lastPinned) lastPinned.after(item);
      else            pinnedLabel.after(item);
      pinnedLabel.style.display = '';
    }

    // Hide pinned label if no pinned items remain
    if (!document.querySelector('.hist-item.pinned')) {
      pinnedLabel.style.display = 'none';
    }
  }

  function deleteItem(item) {
    item.remove();
    if (!document.querySelector('.hist-item.pinned')) {
      document.getElementById('pinned-label').style.display = 'none';
    }
  }

  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', closeAllDropdowns);

  setupHistItemActions();

});
