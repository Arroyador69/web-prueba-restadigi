import { createFileRoute } from "@tanstack/react-router";
import { Bot, Clock, MessageSquare, Sparkles, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

import heroChat from "@/assets/hero-ai-chat-service.jpg";
import { OPEN_SALES_CHAT_EVENT } from "@/components/chatbot-widget";
import { dashboardUrl, useLocale, type Locale } from "@/i18n";

export const Route = createFileRoute("/restachat")({
  head: () => ({
    meta: [
      { title: "Restachat — Restadigi showcase" },
      {
        name: "description",
        content:
          "Restachat customer-service chatbot showcase by Restadigi. Try the AI assistant — demo website.",
      },
    ],
  }),
  component: RestachatShowcasePage,
});

const COPY = {
  fi: {
    ribbon: "Restadigi Restachat · AI-asiakaspalvelun esittelysivusto",
    openPanel: "Avaa hallintapaneeli",
    lang: "Kieli",
    eyebrow: "Restachat · 24/7",
    title: "Yrityksesi edullisin työntekijä on tässä.",
    lead: "Älykäs chatbot verkkosivuillesi: vastaa kysymyksiin, kerää liidejä ja vapauttaa henkilökunnan — kokeile alla olevaa demoa.",
    cta: "Kokeile bottia",
    featuresTitle: "Miksi Restachat",
    features: [
      {
        icon: Clock,
        title: "Asiakaspalvelu 24/7",
        body: "Botti vastaa heti — myös öisin, kun tiimisi on vapaalla.",
      },
      {
        icon: Users,
        title: "Liidien keruu",
        body: "Ohjaa vierailija eteenpäin ja tallentaa yhteystiedot hallintapaneeliin.",
      },
      {
        icon: TrendingUp,
        title: "Parempi konversio",
        body: "Matala kynnys keskustella kasvattaa yhteydenottoja ja myyntiä.",
      },
      {
        icon: Sparkles,
        title: "Personoitava",
        body: "Sävyt, ohjeet ja kielet mukautuvat brändiisi. OpenAI-avain kytketään tuotannossa.",
      },
    ],
    demoTitle: "Kokeile live-demoa",
    demoBody:
      "Avaa chat oikeasta alakulmasta. Tämä on Restadigi-demo: keskustelut ovat esimerkkejä eivätkä korvaa oikeaa asennusta.",
    panelHint: "Hallintapaneelissa näet liidit ja keskustelut demodatalla.",
  },
  en: {
    ribbon: "Restadigi Restachat · AI customer-service showcase",
    openPanel: "Open dashboard",
    lang: "Language",
    eyebrow: "Restachat · 24/7",
    title: "Your most affordable teammate is right here.",
    lead: "A smart chatbot for your website: answers questions, captures leads and frees your staff — try the demo below.",
    cta: "Try the bot",
    featuresTitle: "Why Restachat",
    features: [
      {
        icon: Clock,
        title: "Support 24/7",
        body: "The bot replies instantly — even at night when your team is off.",
      },
      {
        icon: Users,
        title: "Lead capture",
        body: "Guides visitors forward and stores contacts in the admin panel.",
      },
      {
        icon: TrendingUp,
        title: "Higher conversion",
        body: "A low barrier to chat turns more visits into conversations and sales.",
      },
      {
        icon: Sparkles,
        title: "Fully tailored",
        body: "Tone, instructions and languages match your brand. Add an OpenAI key in production.",
      },
    ],
    demoTitle: "Try the live demo",
    demoBody:
      "Open the chat in the bottom-right corner. This is a Restadigi demo: chats are examples, not a full production install.",
    panelHint: "In the dashboard you can explore leads and conversations with sample data.",
  },
  es: {
    ribbon: "Restadigi Restachat · muestra de atención al cliente con IA",
    openPanel: "Abrir panel",
    lang: "Idioma",
    eyebrow: "Restachat · 24/7",
    title: "El empleado más asequible de tu empresa está aquí.",
    lead: "Un chatbot inteligente para tu web: responde, captura leads y libera al equipo — prueba la demo abajo.",
    cta: "Probar el bot",
    featuresTitle: "Por qué Restachat",
    features: [
      {
        icon: Clock,
        title: "Atención 24/7",
        body: "El bot responde al instante — también de noche, cuando tu equipo descansa.",
      },
      {
        icon: Users,
        title: "Captura de leads",
        body: "Guía al visitante y guarda contactos en el panel de administración.",
      },
      {
        icon: TrendingUp,
        title: "Más conversión",
        body: "Hablar es fácil: más visitas se convierten en conversaciones y ventas.",
      },
      {
        icon: Sparkles,
        title: "Personalizable",
        body: "Tono, instrucciones e idiomas a tu marca. La API key de OpenAI se conecta en producción.",
      },
    ],
    demoTitle: "Prueba la demo en vivo",
    demoBody:
      "Abre el chat abajo a la derecha. Es una demo Restadigi: las conversaciones son de ejemplo, no una instalación completa.",
    panelHint: "En el panel verás leads y conversaciones con datos de muestra.",
  },
} as const;

function openChat() {
  window.dispatchEvent(new Event(OPEN_SALES_CHAT_EVENT));
}

function RestachatShowcasePage() {
  const { locale, setLocale } = useLocale();
  const t = COPY[locale] ?? COPY.fi;
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    document.title =
      locale === "es"
        ? "Restachat — muestra Restadigi"
        : locale === "en"
          ? "Restachat — Restadigi showcase"
          : "Restachat — Restadigi-esittely";
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="chat-showcase min-h-screen bg-[#0f1412] text-[#eef3ef]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/25 bg-[#14201a] px-4 py-2.5 text-xs text-emerald-50/90 sm:px-6">
        <p>{t.ribbon}</p>
        <a
          href={dashboardUrl("/dashboard/conversations", locale)}
          className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
        >
          {t.openPanel}
        </a>
      </div>

      <header
        className={`sticky top-0 z-30 border-b transition ${
          navSolid
            ? "border-white/10 bg-[#0f1412]/92 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
              <Bot className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">Restachat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openChat}
              className="hidden min-h-10 items-center rounded-full bg-emerald-500 px-4 text-xs font-semibold uppercase tracking-wider text-[#0b1210] sm:inline-flex"
            >
              {t.cta}
            </button>
            <label className="sr-only">{t.lang}</label>
            <select
              className="min-h-10 rounded-lg border border-white/15 bg-transparent px-2 py-2 text-sm"
              value={locale}
              aria-label={t.lang}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              <option value="fi" className="text-[#0f1412]">
                FI
              </option>
              <option value="en" className="text-[#0f1412]">
                EN
              </option>
              <option value="es" className="text-[#0f1412]">
                ES
              </option>
            </select>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <img
            src={heroChat}
            alt=""
            className="absolute inset-0 size-full object-cover object-[center_30%] opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1412] via-[#0f1412]/85 to-[#0f1412]/35" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                {t.eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-emerald-50/75 sm:text-lg">
                {t.lead}
              </p>
              <button
                type="button"
                onClick={openChat}
                className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-[#0b1210]"
              >
                <MessageSquare className="size-4" />
                {t.cta}
              </button>
            </div>
            <div className="rounded-[1.75rem] border border-emerald-400/20 bg-[#14201a]/80 p-6 shadow-2xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {t.demoTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/75">{t.demoBody}</p>
              <p className="mt-4 text-sm text-emerald-200/80">{t.panelHint}</p>
              <button
                type="button"
                onClick={openChat}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-500/90 text-sm font-semibold text-[#0b1210]"
              >
                {t.cta}
              </button>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#101816] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl tracking-tight">{t.featuresTitle}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.features.map((f) => {
                const Icon = f.icon;
                return (
                  <article
                    key={f.title}
                    className="rounded-2xl border border-white/8 bg-[#0f1412] p-5"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-50/65">{f.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-10 text-sm text-emerald-50/50 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4">
          <p>Restachat · Restadigi demo</p>
          <a
            href={dashboardUrl("/dashboard/leads", locale)}
            className="text-emerald-300 hover:underline"
          >
            {t.openPanel}
          </a>
        </div>
      </footer>
    </div>
  );
}
