import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dashboardUrl, useLocale } from "@/i18n";
import { readDemoTheme, subscribeDemoTheme } from "@/lib/demo-theme";
import type { PublicRestaurantSettings } from "@/lib/restaurant-settings-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Restadigi Demo — Book a table" },
      {
        name: "description",
        content: "Public Restadigi demo landing. Book a table and explore the dashboard without login.",
      },
    ],
  }),
  component: DemoLandingPage,
});

const COPY = {
  fi: {
    banner: "Julkinen Restadigi-demo · varaa pöytä tai avaa paneeli — ei kirjautumista",
    openDash: "Avaa demo-paneeli",
    heroTitle: "Demo-ravintola",
    heroSub:
      "Kokeile pöytävarausta lomakkeella tai chatilla. Hallitse värejä ja asetuksia dashboardissa — ilman käyttäjää.",
    aboutTitle: "Tästä demosta",
    aboutText:
      "Tämä on Restadigin julkinen esittely. Dashboardissa näkyvät vain meidän esimerkkidatamme. Kaikki mitä kirjoitat (varaukset, chat, asetukset) toimii demona mutta ei tallennu tietokantaan. Älä syötä oikeita henkilötietoja.",
    bookTitle: "Varaa pöytä",
    bookIntro: "Täytä lomake tai käytä chattia oikeassa alakulmassa. Demo ei tallenna vierailijan tietoja.",
    name: "Nimi",
    email: "Sähköposti",
    phone: "Puhelin",
    date: "Päivä",
    time: "Kellonaika",
    party: "Henkilömäärä",
    submit: "Vahvista varaus",
    sending: "Lähetetään…",
    ok: "Demo OK — varausta ei tallennettu. Dashboardissa näet vain esimerkkivaraukset.",
    lang: "Kieli",
  },
  en: {
    banner: "Restadigi public demo · book a table or open the panel — no login",
    openDash: "Open demo panel",
    heroTitle: "Demo restaurant",
    heroSub:
      "Try booking with the form or chat. Edit colours and settings in the dashboard — no account needed.",
    aboutTitle: "About this demo",
    aboutText:
      "This is Restadigi’s public showcase. The dashboard only shows our curated sample data. Anything you type (bookings, chat, settings) works as a demo but is never saved to the database. Don’t enter real personal data.",
    bookTitle: "Book a table",
    bookIntro: "Fill the form or use the chat in the bottom-right corner. Visitor data is not stored.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Date",
    time: "Time",
    party: "Guests",
    submit: "Confirm booking",
    sending: "Sending…",
    ok: "Demo OK — booking was not saved. The dashboard only shows sample reservations.",
    lang: "Language",
  },
  es: {
    banner: "Demo pública Restadigi · reserva mesa o abre el panel — sin login",
    openDash: "Abrir panel demo",
    heroTitle: "Restaurante demo",
    heroSub:
      "Prueba la reserva con el formulario o el chat. Edita colores y ajustes en el panel — sin cuenta.",
    aboutTitle: "Sobre esta demo",
    aboutText:
      "Es la muestra pública de Restadigi. En el panel solo verás nuestros datos de ejemplo. Todo lo que escribas (reservas, chat, ajustes) funciona como demo pero no se guarda en la base de datos. No introduzcas datos personales reales.",
    bookTitle: "Reservar mesa",
    bookIntro: "Rellena el formulario o usa el chat de la esquina inferior derecha. Los datos de visitantes no se guardan.",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    date: "Fecha",
    time: "Hora",
    party: "Comensales",
    submit: "Confirmar reserva",
    sending: "Enviando…",
    ok: "Demo OK — la reserva no se ha guardado. En el panel solo verás las de ejemplo.",
    lang: "Idioma",
  },
} as const;

function DemoLandingPage() {
  const { locale, setLocale } = useLocale();
  const copy = COPY[locale] || COPY.fi;
  const [settings, setSettings] = useState<PublicRestaurantSettings | null>(null);
  const [liveAccent, setLiveAccent] = useState<string | null>(() => readDemoTheme()?.accentColor ?? null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:00",
    partySize: "2",
  });

  const accent = liveAccent || settings?.accentColor || "#c46a32";
  const name = settings?.restaurantName || copy.heroTitle;
  const description = copy.heroSub;

  useEffect(() => {
    return subscribeDemoTheme((theme) => {
      if (theme.accentColor) setLiveAccent(theme.accentColor);
    });
  }, []);

  useEffect(() => {
    void fetch("/api/restaurant/settings")
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data: { settings?: PublicRestaurantSettings } | null) => {
        if (data?.settings) {
          setSettings(data.settings);
          if (!readDemoTheme()?.accentColor && data.settings.accentColor) {
            setLiveAccent(data.settings.accentColor);
          }
        }
      })
      .catch(() => undefined);
  }, []);

  const cssVars = useMemo(
    () =>
      ({
        ["--demo-accent" as string]: accent,
      }) as React.CSSProperties,
    [accent],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/restaurant/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: form.name,
          guestEmail: form.email || undefined,
          guestPhone: form.phone,
          partySize: Number(form.partySize),
          reservationDate: form.date,
          reservationTime: form.time,
          locale,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Error");
      setMessage(copy.ok);
      setForm((f) => ({ ...f, name: "", email: "", phone: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="demo-landing min-h-screen bg-slate-50 text-slate-800" style={cssVars}>
      <div className="border-b border-amber-200 bg-amber-50 text-amber-950">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
          <p className="font-medium leading-snug">{copy.banner}</p>
          <a
            href={dashboardUrl("/dashboard", locale)}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#432f24] px-4 text-sm font-semibold text-white sm:w-auto sm:min-h-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:text-[#432f24] sm:underline"
          >
            {copy.openDash}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-4">
          <h1 className="min-w-0 truncate text-base font-bold sm:text-xl" style={{ color: "#432f24" }}>
            {name}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            <label className="sr-only">{copy.lang}</label>
            <select
              className="min-h-10 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm"
              value={locale}
              onChange={(e) => setLocale(e.target.value as "fi" | "en" | "es")}
            >
              <option value="fi">FI</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>
        </div>
      </header>

      <main className="pb-[5.5rem] sm:pb-8">
        <section className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 sm:py-16">
          <h2
            className="mb-3 text-[1.75rem] font-bold leading-tight sm:text-4xl"
            style={{ color: "#432f24" }}
          >
            {name}
          </h2>
          <p className="mx-auto max-w-2xl whitespace-pre-line text-[0.95rem] leading-relaxed text-slate-600 sm:text-lg">
            {description}
          </p>
          <a
            href="#reservar"
            className="mt-6 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl px-6 font-semibold text-white sm:mt-8 sm:w-auto"
            style={{ background: accent }}
          >
            {copy.bookTitle}
          </a>
        </section>

        <section className="bg-white py-8 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:gap-8 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="mb-2 text-xl font-bold sm:mb-3 sm:text-2xl" style={{ color: "#432f24" }}>
                {copy.aboutTitle}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-slate-600 sm:text-base">{copy.aboutText}</p>
            </div>
            <div
              className="flex min-h-28 items-center justify-center rounded-2xl border border-slate-100 p-6 text-center text-sm text-slate-500 sm:min-h-48 sm:p-8"
              style={{ background: `${accent}14` }}
            >
              Restadigi · public demo
            </div>
          </div>
        </section>

        <section id="reservar" className="mx-auto max-w-2xl scroll-mt-20 px-4 py-8 sm:scroll-mt-8 sm:px-6 sm:py-16">
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-8">
            <h3 className="mb-1 text-xl font-bold sm:text-2xl" style={{ color: "#432f24" }}>
              {copy.bookTitle}
            </h3>
            <p className="mb-5 text-sm text-slate-600 sm:mb-6 sm:text-base">{copy.bookIntro}</p>
            <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
              <div className="space-y-2">
                <Label htmlFor="name">{copy.name}</Label>
                <Input
                  id="name"
                  required
                  className="min-h-11"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">{copy.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    className="min-h-11"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{copy.phone}</Label>
                  <Input
                    id="phone"
                    required
                    className="min-h-11"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">{copy.date}</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    className="min-h-11"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{copy.time}</Label>
                  <Input
                    id="time"
                    type="time"
                    required
                    className="min-h-11"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="party">{copy.party}</Label>
                  <Input
                    id="party"
                    type="number"
                    min={1}
                    max={80}
                    required
                    className="min-h-11"
                    inputMode="numeric"
                    value={form.partySize}
                    onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                  />
                </div>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
              <Button
                type="submit"
                disabled={busy}
                className="min-h-12 w-full text-base text-white"
                style={{ background: accent }}
              >
                {busy ? copy.sending : copy.submit}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
