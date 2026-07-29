import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import heroHotel from "@/assets/hero-hotel-lobby.jpg";
import { StayBookingWidget } from "@/components/stay-booking-widget";
import { dashboardUrl, useLocale, useMessages, type Locale } from "@/i18n";

export const Route = createFileRoute("/hotel")({
  head: () => ({
    meta: [
      { title: "Hotel Aava — Restabooking showcase" },
      {
        name: "description",
        content: "Restabooking hotel booking showcase by Restadigi. Reserve a room — demo website.",
      },
    ],
  }),
  component: HotelShowcasePage,
});

const COPY = {
  fi: {
    ribbon: "Restadigi Restabooking · majoitusvarauksen esittelysivusto",
    openPanel: "Avaa hallintapaneeli",
    lang: "Kieli",
    navBook: "Varaa",
    eyebrow: "Helsinki · boutique hotel",
    title: "Yö, joka tuntuu kotoisalta",
    lead: "Hotelli Aava on Restadigin keksitty demokohde. Varaa huone alla — sama widgetti toimii oikealla majoitussivustolla.",
    cta: "Varaa huone",
    aboutTitle: "Talomme",
    aboutBody:
      "Katajanokan rantamaisemissa: pehmeä valaistus, skandinaavinen rauha ja palvelu joka muistaa nimesi. Tämä sivu näyttää, miltä Restabooking näyttää asiakkaan silmissä.",
  },
  en: {
    ribbon: "Restadigi Restabooking · lodging booking showcase",
    openPanel: "Open dashboard",
    lang: "Language",
    navBook: "Book",
    eyebrow: "Helsinki · boutique hotel",
    title: "A night that feels like home",
    lead: "Hotel Aava is Restadigi’s fictional demo property. Book a room below — the same widget runs on a real lodging site.",
    cta: "Book a room",
    aboutTitle: "Our house",
    aboutBody:
      "By the Katajanokka waterfront: soft light, Scandinavian calm and service that remembers your name. This page shows how Restabooking looks to your guests.",
  },
  es: {
    ribbon: "Restadigi Restabooking · muestra de reserva de alojamiento",
    openPanel: "Abrir panel",
    lang: "Idioma",
    navBook: "Reservar",
    eyebrow: "Helsinki · boutique hotel",
    title: "Una noche que se siente como en casa",
    lead: "Hotel Aava es el alojamiento de demo de Restadigi. Reserva abajo — el mismo widget funciona en una web real de alojamiento.",
    cta: "Reservar habitación",
    aboutTitle: "Nuestra casa",
    aboutBody:
      "Junto al puerto de Katajanokka: luz suave, calma nórdica y un servicio que recuerda tu nombre. Esta página muestra cómo ve Restabooking el huésped.",
  },
} as const;

function HotelShowcasePage() {
  const { locale, setLocale } = useLocale();
  const bookingDemo = useMessages().stayBooking.demo;
  const t = COPY[locale] ?? COPY.fi;
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    document.title =
      locale === "es"
        ? "Hotel Aava — muestra Restabooking"
        : locale === "en"
          ? "Hotel Aava — Restabooking showcase"
          : "Hotelli Aava — Restabooking-esittely";
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hotel-showcase min-h-screen bg-[#12100e] text-[#f3eee6]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c4a574]/35 bg-[#1c1814] px-4 py-2.5 text-xs text-[#e8dfd4] sm:px-6">
        <p>{t.ribbon}</p>
        <a
          href={dashboardUrl("/dashboard/stay-booking-widget", locale)}
          className="font-semibold text-[#c4a574] underline-offset-2 hover:underline"
        >
          {t.openPanel}
        </a>
      </div>

      <header
        className={`sticky top-0 z-30 border-b transition ${
          navSolid
            ? "border-white/10 bg-[#12100e]/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="font-serif text-xl tracking-tight">
            Hotel Aava
          </a>
          <div className="flex items-center gap-2">
            <a
              href="#reserve"
              className="hidden rounded-full border border-[#c4a574]/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c4a574] sm:inline-flex"
            >
              {t.navBook}
            </a>
            <label className="sr-only">{t.lang}</label>
            <select
              className="min-h-10 rounded-lg border border-white/15 bg-transparent px-2 py-2 text-sm"
              value={locale}
              aria-label={t.lang}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              <option value="fi" className="text-[#12100e]">
                FI
              </option>
              <option value="en" className="text-[#12100e]">
                EN
              </option>
              <option value="es" className="text-[#12100e]">
                ES
              </option>
            </select>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[70vh] overflow-hidden">
          <img
            src={heroHotel}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/45 to-[#12100e]/25" />
          <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c4a574]">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#d9d0c4] sm:text-lg">
              {t.lead}
            </p>
            <a
              href="#reserve"
              className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-[#c4a574] px-6 text-sm font-semibold uppercase tracking-wider text-[#12100e]"
            >
              {t.cta}
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c4a574]">
            {t.aboutTitle}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#cfc6ba]">{t.aboutBody}</p>
        </section>

        <section id="reserve" className="bg-[#1a1613] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <header className="mx-auto mb-8 max-w-2xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c4a574]">
                {bookingDemo.sectionEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
                {bookingDemo.sectionTitleBefore}
                <span className="text-[#c4a574]">{bookingDemo.sectionTitleAccent}</span>
                {bookingDemo.sectionTitleAfter}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#b8aea2]">
                {bookingDemo.sectionBody}
              </p>
            </header>
            <StayBookingWidget />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-10 text-sm text-[#9a9186] sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4">
          <p>Hotel Aava · Restabooking demo</p>
          <a
            href={dashboardUrl("/dashboard/stay-booking-widget", locale)}
            className="text-[#c4a574] hover:underline"
          >
            {t.openPanel}
          </a>
        </div>
      </footer>
    </div>
  );
}
