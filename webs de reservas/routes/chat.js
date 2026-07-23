const express = require('express');
const router = express.Router();
const publicDemo = require('../lib/public-demo');
const chatbot = require('../lib/chatbot-booking');

// Estado de chat en memoria por sessionId (demo; se pierde al reiniciar)
const chatStates = new Map();

router.get('/api/demo/status', async (req, res) => {
  try {
    if (!publicDemo.isEnabled()) {
      return res.json({ publicDemo: false });
    }
    const demo = await publicDemo.ensureReady();
    res.json({
      publicDemo: true,
      slug: demo.slug,
      landingPath: '/',
      dashboardPath: '/dashboard'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/api/chat', async (req, res) => {
  try {
    if (!publicDemo.isEnabled()) {
      return res.status(404).json({ error: 'Chat solo disponible en demo pública' });
    }
    const demo = await publicDemo.ensureReady();
    const { locale, messages, sessionId } = req.body || {};
    const sid = String(sessionId || req.sessionID || 'anon');
    const prev = chatStates.get(sid) || {};
    const result = await chatbot.handleChat({
      locale,
      messages,
      state: prev,
      negocioId: demo.negocioId
    });
    chatStates.set(sid, result.state || {});
    res.json({
      message: result.message,
      sessionId: sid,
      booked: !!result.booked,
      openai: !!process.env.OPENAI_API_KEY
    });
  } catch (err) {
    console.error('api/chat:', err);
    res.status(500).json({ error: err.message || 'Error en el chat' });
  }
});

router.get('/api/chat/welcome', (req, res) => {
  const lang = chatbot.detectLang(req.query.lang || req.query.locale);
  res.json({ message: { role: 'assistant', content: chatbot.welcome(lang) } });
});

module.exports = router;
