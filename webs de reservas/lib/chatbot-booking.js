/**
 * Chatbot de reserva de mesa (demo pública).
 * Si hay OPENAI_API_KEY usa GPT; si no, flujo guiado por reglas.
 */
const citasService = require('./citas');
const pacientesService = require('./pacientes');
const publicDemo = require('./public-demo');

const SYSTEM_PROMPTS = {
  es: `Eres el asistente de reservas de un restaurante demo de Restadigi.
Ayuda a reservar mesa. Pregunta: fecha, hora, número de comensales, nombre y teléfono.
Sé breve, amable y en español. Esto es una DEMOSTRACIÓN pública: no pidas datos bancarios.
Cuando tengas todos los datos, confirma la reserva claramente.`,
  en: `You are the table-booking assistant for a Restadigi demo restaurant.
Help book a table. Ask for: date, time, party size, name and phone.
Be brief and friendly in English. This is a PUBLIC DEMO: never ask for payment details.
When you have everything, clearly confirm the booking.`,
  fi: `Olet Restadigi-demon ravintolan pöytävarausassistentti.
Auta varaamaan pöytä. Kysy: päivä, kellonaika, henkilömäärä, nimi ja puhelin.
Ole lyhyt ja ystävällinen suomeksi. Tämä on JULKINEN DEMO: älä kysy maksutietoja.
Kun sinulla on kaikki tiedot, vahvista varaus selkeästi.`
};

function welcome(lang) {
  const map = {
    es: '¡Hola! Soy el asistente de reservas (demo). ¿Para qué día y hora quieres mesa, y para cuántas personas?',
    en: 'Hi! I’m the booking assistant (demo). What day and time would you like a table, and for how many guests?',
    fi: 'Hei! Olen varausassistentti (demo). Minä päivänä ja mihin kellonaikaan haluaisit pöydän, ja kuinka monelle?'
  };
  return map[lang] || map.fi;
}

function detectLang(locale) {
  const l = String(locale || 'fi').toLowerCase().slice(0, 2);
  return l === 'es' || l === 'en' || l === 'fi' ? l : 'fi';
}

function extractBooking(text) {
  const raw = String(text || '');
  const lower = raw.toLowerCase();
  const party =
    (lower.match(/(\d+)\s*(pers|henkil|guest|people|comensal|pax|hlö)/i) ||
      lower.match(/para\s+(\d+)/i) ||
      lower.match(/for\s+(\d+)/i) ||
      [])[1] || null;

  const isoDate = (raw.match(/\b(20\d{2}-\d{2}-\d{2})\b/) || [])[1];
  const dmy = raw.match(/\b(\d{1,2})[./](\d{1,2})(?:[./](20\d{2}))?\b/);
  let date = isoDate || null;
  if (!date && dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3] || String(new Date().getFullYear());
    date = `${year}-${month}-${day}`;
  }

  const time = (raw.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/) || [])[0];
  const phone = (raw.match(/(\+?\d[\d\s-]{7,}\d)/) || [])[1];
  const email = (raw.match(/[\w.+-]+@[\w.-]+\.\w{2,}/) || [])[0];

  // Nombre muy heurístico: "me llamo X" / "nimeni on X" / "my name is X"
  let name = null;
  const nameMatch =
    raw.match(/(?:me llamo|soy|nimeni on|olen|my name is|i'?m)\s+([A-Za-zÀ-ÿÄÖÅäöå\- ]{2,40})/i) ||
    raw.match(/nombre[:\s]+([A-Za-zÀ-ÿÄÖÅäöå\- ]{2,40})/i);
  if (nameMatch) name = nameMatch[1].trim().replace(/[.,!?].*$/, '');

  return {
    party: party ? parseInt(party, 10) : null,
    date,
    time: time ? time.replace('.', ':') : null,
    phone: phone ? phone.replace(/\s+/g, '') : null,
    email: email || null,
    name
  };
}

function mergeState(prev, next) {
  return {
    party: next.party || prev.party || null,
    date: next.date || prev.date || null,
    time: next.time || prev.time || null,
    phone: next.phone || prev.phone || null,
    email: next.email || prev.email || null,
    name: next.name || prev.name || null
  };
}

function missingPrompt(state, lang) {
  const miss = [];
  if (!state.date) miss.push(lang === 'es' ? 'fecha' : lang === 'en' ? 'date' : 'päivä');
  if (!state.time) miss.push(lang === 'es' ? 'hora' : lang === 'en' ? 'time' : 'kellonaika');
  if (!state.party) miss.push(lang === 'es' ? 'comensales' : lang === 'en' ? 'guests' : 'henkilömäärä');
  if (!state.name) miss.push(lang === 'es' ? 'nombre' : lang === 'en' ? 'name' : 'nimi');
  if (!state.phone) miss.push(lang === 'es' ? 'teléfono' : lang === 'en' ? 'phone' : 'puhelin');
  if (!miss.length) return null;
  const map = {
    es: `Perfecto. Aún me falta: ${miss.join(', ')}. ¿Me lo indicas?`,
    en: `Great. I still need: ${miss.join(', ')}. Can you share that?`,
    fi: `Hyvä. Tarvitsen vielä: ${miss.join(', ')}. Voitko kertoa?`
  };
  return map[lang] || map.fi;
}

async function createReservation(negocioId, state) {
  const time = String(state.time).replace('.', ':').slice(0, 5);
  const [h, m] = time.split(':').map(Number);
  const endMin = h * 60 + (m || 0) + 90;
  const hora_fin = `${String(Math.floor(endMin / 60) % 24).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
  const paciente = await pacientesService.getOrCreateByEmail(negocioId, {
    nombre: state.name,
    email: state.email || `demo+${Date.now()}@restadigi.public`,
    telefono: state.phone
  });
  const cita = await citasService.create(negocioId, {
    paciente_id: paciente.id,
    fecha: state.date,
    hora_inicio: time,
    hora_fin,
    estado: 'confirmada',
    notas: `Demo chat · ${state.party} pax`
  });
  return { paciente, cita };
}

async function replyWithOpenAI(lang, messages) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      messages: [{ role: 'system', content: SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.fi }, ...messages]
    })
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

async function handleChat({ locale, messages, state: prevState, negocioId }) {
  const lang = detectLang(locale);
  const history = Array.isArray(messages) ? messages : [];
  const lastUser = [...history].reverse().find((m) => m.role === 'user');
  let state = mergeState(prevState || {}, extractBooking(lastUser?.content || ''));

  // Intentar completar reserva si ya hay datos
  if (state.date && state.time && state.party && state.name && state.phone) {
    try {
      const nid = negocioId || (await publicDemo.ensureReady()).negocioId;
      await createReservation(nid, state);
      const conf = {
        es: `✅ Reserva demo confirmada para ${state.name}: ${state.date} a las ${state.time}, ${state.party} personas. (Demostración pública — puedes verla en el panel.)`,
        en: `✅ Demo booking confirmed for ${state.name}: ${state.date} at ${state.time}, ${state.party} guests. (Public demo — check the dashboard.)`,
        fi: `✅ Demovaraus vahvistettu: ${state.name}, ${state.date} klo ${state.time}, ${state.party} hlö. (Julkinen demo — näet sen hallintapaneelissa.)`
      };
      return {
        message: { role: 'assistant', content: conf[lang] || conf.fi },
        state: {},
        booked: true
      };
    } catch (err) {
      console.error('chat book:', err);
      const fail = {
        es: `No pude guardar la reserva (${err.message}). Prueba otra hora dentro del horario o revisa fecha/hora.`,
        en: `Couldn’t save the booking (${err.message}). Try another time within opening hours.`,
        fi: `Varausta ei voitu tallentaa (${err.message}). Kokeile toista aikaa aukioloaikojen sisällä.`
      };
      return {
        message: { role: 'assistant', content: fail[lang] || fail.fi },
        state,
        booked: false
      };
    }
  }

  // OpenAI si hay clave; si no, reglas
  try {
    const ai = await replyWithOpenAI(
      lang,
      history
        .filter((m) => m && m.content)
        .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content) }))
        .slice(-12)
    );
    if (ai) {
      // Aún así recordar datos extraídos
      const need = missingPrompt(state, lang);
      const content = need && !/confirm|vahvist|listo|done|valmis/i.test(ai) ? `${ai}\n\n(${need})` : ai;
      return { message: { role: 'assistant', content }, state, booked: false };
    }
  } catch (err) {
    console.warn('OpenAI chat fallback:', err.message);
  }

  const need = missingPrompt(state, lang);
  if (need) {
    return { message: { role: 'assistant', content: need }, state, booked: false };
  }

  return {
    message: {
      role: 'assistant',
      content:
        lang === 'es'
          ? 'Dime fecha (AAAA-MM-DD), hora (HH:MM), comensales, nombre y teléfono.'
          : lang === 'en'
            ? 'Please share date (YYYY-MM-DD), time (HH:MM), guests, name and phone.'
            : 'Kerro päivä (VVVV-KK-PP), kellonaika (TT:MM), henkilömäärä, nimi ja puhelin.'
    },
    state,
    booked: false
  };
}

module.exports = {
  welcome,
  handleChat,
  detectLang
};
