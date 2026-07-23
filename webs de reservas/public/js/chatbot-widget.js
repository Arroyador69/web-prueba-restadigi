/**
 * Widget flotante: reserva de mesa por chat (demo pública).
 */
(function () {
  function el(tag, attrs, html) {
    const n = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') n.className = v;
      else if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v);
    });
    if (html != null) n.innerHTML = html;
    return n;
  }

  function t(key) {
    try {
      return window.I18n && window.I18n.t ? window.I18n.t(key) : key;
    } catch (_) {
      return key;
    }
  }

  function lang() {
    try {
      return (window.I18n && window.I18n.getLang && window.I18n.getLang()) || 'fi';
    } catch (_) {
      return 'fi';
    }
  }

  function mount() {
    if (document.getElementById('rd-chat-root')) return;

    const style = el('style', null, `
      #rd-chat-root { position: fixed; z-index: 9999; right: 16px; bottom: 16px; font-family: inherit; }
      #rd-chat-fab {
        width: 56px; height: 56px; border-radius: 999px; border: none; cursor: pointer;
        background: var(--primary-color, #c46a32); color: #fff; font-size: 22px;
        box-shadow: 0 8px 24px rgba(0,0,0,.18);
      }
      #rd-chat-panel {
        display: none; width: min(360px, calc(100vw - 24px)); height: 460px;
        background: #fff; border-radius: 16px; overflow: hidden;
        box-shadow: 0 16px 40px rgba(0,0,0,.2); margin-bottom: 12px;
        border: 1px solid #e5e7eb; flex-direction: column;
      }
      #rd-chat-root.open #rd-chat-panel { display: flex; }
      #rd-chat-head {
        padding: 12px 14px; background: var(--secondary-color, #432f24); color: #fff;
        display: flex; justify-content: space-between; align-items: center; gap: 8px;
      }
      #rd-chat-head strong { font-size: 14px; }
      #rd-chat-head button { background: transparent; border: none; color: #fff; font-size: 18px; cursor: pointer; }
      #rd-chat-msgs { flex: 1; overflow-y: auto; padding: 12px; background: #f8fafc; }
      .rd-msg { max-width: 90%; margin: 0 0 8px; padding: 8px 10px; border-radius: 12px; font-size: 13px; line-height: 1.4; white-space: pre-wrap; }
      .rd-msg.bot { background: #fff; border: 1px solid #e5e7eb; }
      .rd-msg.user { background: var(--primary-color, #c46a32); color: #fff; margin-left: auto; }
      #rd-chat-form { display: flex; gap: 6px; padding: 10px; border-top: 1px solid #e5e7eb; background: #fff; }
      #rd-chat-input {
        flex: 1; min-height: 42px; border: 1px solid #d1d5db; border-radius: 10px;
        padding: 8px 10px; font-size: 16px; resize: none;
      }
      #rd-chat-send {
        border: none; border-radius: 10px; padding: 0 14px; cursor: pointer;
        background: var(--primary-color, #c46a32); color: #fff; font-weight: 600;
      }
      #rd-chat-send:disabled { opacity: .6; }
    `);
    document.head.appendChild(style);

    const root = el('div', { id: 'rd-chat-root' });
    const panel = el('div', { id: 'rd-chat-panel' });
    const head = el('div', { id: 'rd-chat-head' });
    const title = el('strong', { text: t('chat_title') });
    const closeBtn = el('button', { type: 'button', 'aria-label': 'close', text: '×' });
    head.appendChild(title);
    head.appendChild(closeBtn);
    const msgs = el('div', { id: 'rd-chat-msgs' });
    const form = el('form', { id: 'rd-chat-form' });
    const input = el('textarea', { id: 'rd-chat-input', rows: '1', placeholder: t('chat_placeholder') });
    const send = el('button', { id: 'rd-chat-send', type: 'submit', text: t('chat_send') });
    form.appendChild(input);
    form.appendChild(send);
    panel.appendChild(head);
    panel.appendChild(msgs);
    panel.appendChild(form);
    const fab = el('button', { id: 'rd-chat-fab', type: 'button', 'aria-label': 'chat', text: '💬' });
    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);

    let sessionId = null;
    const history = [];

    function addMsg(role, content) {
      const bubble = el('div', { className: 'rd-msg ' + (role === 'user' ? 'user' : 'bot'), text: content });
      msgs.appendChild(bubble);
      msgs.scrollTop = msgs.scrollHeight;
    }

    async function loadWelcome() {
      try {
        const r = await fetch('/api/chat/welcome?lang=' + encodeURIComponent(lang()));
        const data = await r.json();
        const content = data.message?.content || t('chat_welcome');
        history.length = 0;
        history.push({ role: 'assistant', content });
        msgs.innerHTML = '';
        addMsg('assistant', content);
      } catch (_) {
        const content = t('chat_welcome');
        history.length = 0;
        history.push({ role: 'assistant', content });
        msgs.innerHTML = '';
        addMsg('assistant', content);
      }
    }

    fab.addEventListener('click', () => {
      root.classList.add('open');
      if (!msgs.childElementCount) loadWelcome();
      input.focus();
    });
    closeBtn.addEventListener('click', () => root.classList.remove('open'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      history.push({ role: 'user', content: text });
      addMsg('user', text);
      send.disabled = true;
      try {
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ locale: lang(), sessionId, messages: history })
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Error');
        if (data.sessionId) sessionId = data.sessionId;
        const reply = data.message?.content || t('chat_error');
        history.push({ role: 'assistant', content: reply });
        addMsg('assistant', reply);
      } catch (err) {
        addMsg('assistant', t('chat_error'));
      } finally {
        send.disabled = false;
      }
    });

    window.addEventListener('app-lang-changed', () => {
      title.textContent = t('chat_title');
      input.placeholder = t('chat_placeholder');
      send.textContent = t('chat_send');
      if (root.classList.contains('open')) loadWelcome();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
