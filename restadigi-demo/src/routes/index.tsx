import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import heroDish from "@/assets/restaurant-dining.jpg";
import imgDish from "@/assets/mock-erikoismenut.jpg";
import imgWine from "@/assets/restaurant-dining.jpg";
import imgGuests from "@/assets/success-guests-arriving.jpg";
import { TableBookingWidget } from "@/components/table-booking-widget";
import { dashboardUrl, useLocale, useMessages, type Locale } from "@/i18n";
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

function WineMark() {
  return (
    <svg className="sa-wine-mark" viewBox="0 0 120 140" aria-hidden>
      <path
        d="M48 18h12c2 0 4 2 4 5v28c0 14-8 24-10 36h0c-2 12-2 18-2 28h6v8H50v-8h6c0-10 0-16-2-28C52 75 44 65 44 51V23c0-3 2-5 4-5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M72 42c14 2 24 14 24 30 0 18-12 30-28 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path d="M68 104h28" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="82" cy="78" rx="11" ry="16" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

function ShowcaseLandingPage() {
  const { locale, setLocale } = useLocale();
  const t = getShowcaseCopy(locale);
  const bookingDemo = useMessages().booking.demo;
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = t.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.metaDescription);
  }, [t.metaTitle, t.metaDescription]);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinks = [
    { href: "#experience", label: t.nav.about },
    { href: "#menu", label: t.nav.menu },
    { href: "#lunch", label: t.nav.lunch },
    { href: "#groups", label: t.nav.groups },
    { href: "#contact", label: t.nav.contact },
  ] as const;

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
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#gift" className="sa-nav__cta sa-nav__cta--ghost">
              {t.nav.gift}
            </a>
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
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a href="#gift" onClick={closeMenu}>
              {t.nav.gift}
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
            <img src={heroDish} alt="" className="sa-hero__img" />
            <div className="sa-hero__veil" />
          </div>
          <h1 className="sa-hero__brand">
            <span>Maison</span>
            <span>Aurelia</span>
          </h1>
        </section>

        <section id="gift" className="sa-gift">
          <div className="sa-wrap sa-gift__inner">
            <div>
              <p className="sa-eyebrow">{t.giftTitle}</p>
              <h2 className="sa-heading sa-heading--sm">{t.giftLead}</h2>
              <p className="sa-body">{t.giftBody}</p>
            </div>
            <a href="#reserve" className="sa-btn sa-btn--solid">
              {t.giftCta}
            </a>
          </div>
        </section>

        <Reveal as="section" id="experience" className="sa-section sa-intro">
          <div className="sa-wrap sa-intro__inner">
            <p className="sa-eyebrow">{t.experienceTitle}</p>
            <h2 className="sa-heading sa-heading--xl">{t.experienceLead}</h2>
            <p className="sa-body sa-body--lg">{t.experienceBody}</p>
          </div>
        </Reveal>

        <Reveal as="section" id="menu" className="sa-panel">
          <div className="sa-panel__media">
            <img src={imgDish} alt="" loading="lazy" />
          </div>
          <div className="sa-panel__copy">
            <h2 className="sa-panel__title">{t.foodTitle}</h2>
            <p className="sa-panel__text">{t.foodBody}</p>
            <div className="sa-panel__links">
              <a href="#menu">{t.menuLink}</a>
              <a href="#lunch">{t.lunchLink}</a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="lunch" className="sa-section sa-lunch">
          <div className="sa-wrap sa-lunch__inner">
            <h2 className="sa-panel__title">{t.lunchTitle}</h2>
            <p className="sa-panel__text">{t.lunchBody}</p>
            <ul className="sa-price-list sa-price-list--center">
              {t.lunchItems.map((item) => (
                <li key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.desc}</span>
                  </div>
                  <em>{item.price}</em>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal as="section" id="drinks" className="sa-panel sa-panel--flip">
          <div className="sa-panel__copy">
            <h2 className="sa-panel__title">{t.drinksTitle}</h2>
            <p className="sa-panel__text">{t.drinksBody}</p>
            <WineMark />
          </div>
          <div className="sa-panel__media">
            <img src={imgWine} alt="" loading="lazy" />
          </div>
        </Reveal>

        <Reveal as="section" id="groups" className="sa-panel">
          <div className="sa-panel__media">
            <img src={imgGuests} alt="" loading="lazy" />
          </div>
          <div className="sa-panel__copy">
            <h2 className="sa-panel__title">{t.groupsTitle}</h2>
            <p className="sa-panel__text">{t.groupsBody}</p>
            <a href="#reserve" className="sa-btn sa-btn--outline">
              {t.groupsCta}
            </a>
          </div>
        </Reveal>

        <Reveal as="section" id="contact" className="sa-section sa-info">
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
          <div className="sa-wrap">
            <header
              className="sa-section__head sa-section__head--center"
              style={{ maxWidth: "40rem", marginInline: "auto" }}
            >
              <p className="sa-eyebrow">{bookingDemo.sectionEyebrow}</p>
              <h2 className="sa-heading">
                {bookingDemo.sectionTitleBefore}
                <span className="sa-accent">{bookingDemo.sectionTitleAccent}</span>
                {bookingDemo.sectionTitleAfter}
              </h2>
              <p className="sa-body" style={{ marginInline: "auto" }}>
                {bookingDemo.sectionBody}
              </p>
            </header>
            <TableBookingWidget />
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
    </div>
  );
}
