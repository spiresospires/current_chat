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

});
