import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

import heroDining from "@/assets/hero-fine-dining.jpg";
import imgKitchen from "@/assets/restaurant-kitchen.jpg";
import imgTable from "@/assets/restaurant-table.jpg";
import imgTerrace from "@/assets/restaurant-terrace.jpg";
import imgInterior from "@/assets/restaurant-interior.jpg";
import imgDining from "@/assets/restaurant-dining.jpg";
import { dashboardUrl, useLocale, type Locale } from "@/i18n";
import { getShowcaseCopy, SHOWCASE_BRAND } from "@/i18n/showcase-landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Aurelia — Restadigi showcase" },
      {
        name: "description",
        content: "Maison Aurelia fine dining showcase by Restadigi. Reserve a table — demo website.",
      },
    ],
  }),
  component: ShowcaseLandingPage,
});

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
  id?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as never} id={id} className={`sa-reveal ${className}`}>
      {children}
    </Tag>
  );
}

function ShowcaseLandingPage() {
  const { locale, setLocale } = useLocale();
  const t = getShowcaseCopy(locale);
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "19:30",
    partySize: "2",
    notes: "",
  });

  useEffect(() => {
    document.title = t.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.metaDescription);
  }, [t.metaTitle, t.metaDescription]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!successOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [successOpen]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
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
          notes: form.notes || undefined,
          locale,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || t.errorGeneric);
      setSuccessOpen(true);
      setForm((f) => ({ ...f, name: "", email: "", phone: "", notes: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setBusy(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="showcase-landing">
      <div className="sa-ribbon">
        <p>{t.demoRibbon}</p>
        <a href={dashboardUrl("/dashboard", locale)}>{t.openPanel}</a>
      </div>

      <header className={`sa-nav ${navSolid ? "sa-nav--solid" : ""}`}>
        <div className="sa-nav__inner">
          <a href="#top" className="sa-brand" onClick={closeMenu}>
            <span className="sa-brand__mark">MA</span>
            <span className="sa-brand__name">{SHOWCASE_BRAND}</span>
          </a>

          <nav className="sa-nav__links" aria-label="Main">
            <a href="#experience">{t.nav.experience}</a>
            <a href="#menu">{t.nav.menu}</a>
            <a href="#atmosphere">{t.nav.atmosphere}</a>
            <a href="#reserve" className="sa-nav__cta">
              {t.nav.reserve}
            </a>
          </nav>

          <div className="sa-nav__tools">
            <label className="sa-lang">
              <span className="sr-only">{t.lang}</span>
              <select
                value={locale}
                aria-label={t.lang}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                <option value="fi">FI</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </label>
            <button
              type="button"
              className="sa-nav__burger"
              aria-expanded={menuOpen}
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="sa-nav__drawer">
            <a href="#experience" onClick={closeMenu}>
              {t.nav.experience}
            </a>
            <a href="#menu" onClick={closeMenu}>
              {t.nav.menu}
            </a>
            <a href="#atmosphere" onClick={closeMenu}>
              {t.nav.atmosphere}
            </a>
            <a href="#reserve" className="sa-nav__cta" onClick={closeMenu}>
              {t.nav.reserve}
            </a>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="sa-hero">
          <div className="sa-hero__media" aria-hidden>
            <img src={heroDining} alt="" className="sa-hero__img" />
            <div className="sa-hero__veil" />
          </div>
          <div className="sa-hero__content">
            <p className="sa-eyebrow">{t.heroEyebrow}</p>
            <h1 className="sa-hero__title">{t.heroTitle}</h1>
            <p className="sa-hero__lead">{t.heroLead}</p>
            <div className="sa-hero__actions">
              <a href="#reserve" className="sa-btn sa-btn--gold">
                {t.heroCta}
              </a>
              <a href="#experience" className="sa-btn sa-btn--ghost">
                {t.heroScroll}
              </a>
            </div>
          </div>
        </section>

        <Reveal as="section" id="experience" className="sa-section sa-experience">
          <div className="sa-wrap sa-experience__grid">
            <div>
              <p className="sa-eyebrow">{t.experienceTitle}</p>
              <h2 className="sa-heading">{t.experienceLead}</h2>
              <p className="sa-body">{t.experienceBody}</p>
            </div>
            <div className="sa-pillars">
              {t.pillars.map((p) => (
                <article key={p.title} className="sa-pillar">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="menu" className="sa-section sa-menu">
          <div className="sa-wrap">
            <header className="sa-section__head">
              <p className="sa-eyebrow">{t.menuTitle}</p>
              <h2 className="sa-heading">{t.menuLead}</h2>
            </header>
            <div className="sa-dishes">
              {t.dishes.map((dish, i) => (
                <article key={dish.name} className="sa-dish">
                  <div className="sa-dish__photo">
                    <img
                      src={[imgTable, imgKitchen, imgDining][i] ?? imgTable}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="sa-dish__body">
                    <span className="sa-dish__tag">{dish.tag}</span>
                    <h3>{dish.name}</h3>
                    <p>{dish.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="sa-menu__note">{t.menuNote}</p>
          </div>
        </Reveal>

        <Reveal as="section" id="atmosphere" className="sa-section sa-atmosphere">
          <div className="sa-wrap">
            <header className="sa-section__head sa-section__head--center">
              <p className="sa-eyebrow">{t.atmosphereTitle}</p>
              <h2 className="sa-heading">{t.atmosphereLead}</h2>
            </header>
            <div className="sa-gallery">
              <figure className="sa-gallery__item sa-gallery__item--wide">
                <img src={imgInterior} alt="" loading="lazy" />
              </figure>
              <figure className="sa-gallery__item">
                <img src={imgTerrace} alt="" loading="lazy" />
              </figure>
              <figure className="sa-gallery__item">
                <img src={imgDining} alt="" loading="lazy" />
              </figure>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="sa-section sa-info">
          <div className="sa-wrap sa-info__grid">
            <div>
              <h2 className="sa-heading sa-heading--sm">{t.hoursTitle}</h2>
              <ul className="sa-hours">
                {t.hours.map((h) => (
                  <li key={h.day}>
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="sa-info__label">{t.addressLabel}</p>
              <p className="sa-info__value">{t.address}</p>
              <p className="sa-info__label">{t.phoneLabel}</p>
              <a className="sa-info__value sa-info__link" href={`tel:${t.phone.replace(/\s/g, "")}`}>
                {t.phone}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="reserve" className="sa-section sa-reserve">
          <div className="sa-wrap sa-reserve__panel">
            <header className="sa-section__head">
              <p className="sa-eyebrow">{t.nav.reserve}</p>
              <h2 className="sa-heading">{t.reserveTitle}</h2>
              <p className="sa-body">{t.reserveLead}</p>
            </header>

            <form className="sa-form" onSubmit={(e) => void onSubmit(e)}>
              <div className="sa-form__row">
                <label>
                  <span>{t.fields.name}</span>
                  <input
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
              </div>
              <div className="sa-form__row sa-form__row--2">
                <label>
                  <span>{t.fields.email}</span>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label>
                  <span>{t.fields.phone}</span>
                  <input
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
              </div>
              <div className="sa-form__row sa-form__row--3">
                <label>
                  <span>{t.fields.date}</span>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </label>
                <label>
                  <span>{t.fields.time}</span>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </label>
                <label>
                  <span>{t.fields.party}</span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    inputMode="numeric"
                    value={form.partySize}
                    onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                  />
                </label>
              </div>
              <div className="sa-form__row">
                <label>
                  <span>{t.fields.notes}</span>
                  <textarea
                    rows={3}
                    placeholder={t.fields.notesPlaceholder}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </label>
              </div>
              {error ? <p className="sa-form__error">{error}</p> : null}
              <button type="submit" className="sa-btn sa-btn--gold sa-btn--block" disabled={busy}>
                {busy ? t.sending : t.submit}
              </button>
            </form>
          </div>
        </Reveal>
      </main>

      <footer className="sa-footer">
        <div className="sa-wrap sa-footer__inner">
          <div>
            <p className="sa-brand__name">{SHOWCASE_BRAND}</p>
            <p className="sa-footer__muted">{t.footerDemo}</p>
          </div>
          <div className="sa-footer__right">
            <p>{t.footerCredit}</p>
            <a href={dashboardUrl("/dashboard", locale)}>{t.openPanel}</a>
          </div>
        </div>
      </footer>

      {successOpen ? (
        <div
          className="sa-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sa-success-title"
          onClick={() => setSuccessOpen(false)}
        >
          <div className="sa-modal__card" onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal__check" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 id="sa-success-title">{t.successTitle}</h3>
            <p>{t.successBody}</p>
            <button type="button" className="sa-btn sa-btn--gold" onClick={() => setSuccessOpen(false)}>
              {t.successClose}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
