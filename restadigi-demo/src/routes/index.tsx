import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import heroDining from "@/assets/hero-fine-dining.jpg";
import imgKitchen from "@/assets/restaurant-kitchen.jpg";
import imgTable from "@/assets/restaurant-table.jpg";
import imgTerrace from "@/assets/restaurant-terrace.jpg";
import imgInterior from "@/assets/restaurant-interior.jpg";
import imgDining from "@/assets/restaurant-dining.jpg";
import imgCafe from "@/assets/restaurant-cafe.jpg";
import imgDrink from "@/assets/freddos-ice-latte.jpg";
import imgDrink2 from "@/assets/freddos-layered-coffee.jpg";
import imgGroups from "@/assets/mock-ryhmille.jpg";
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
            <img src={heroDining} alt="" className="sa-hero__img" />
            <div className="sa-hero__veil" />
          </div>
          <div className="sa-hero__content">
            <p className="sa-eyebrow">{t.heroEyebrow}</p>
            <h1 className="sa-hero__title">{t.heroTitle}</h1>
            <p className="sa-hero__lead">{t.heroLead}</p>
            <div className="sa-hero__actions">
              <a href="#reserve" className="sa-btn sa-btn--solid">
                {t.heroCta}
              </a>
              <a href="#menu" className="sa-btn sa-btn--ghost">
                {t.nav.menu}
              </a>
            </div>
          </div>
        </section>

        <Reveal as="section" id="experience" className="sa-section sa-intro">
          <div className="sa-wrap sa-intro__inner">
            <p className="sa-eyebrow">{t.experienceTitle}</p>
            <h2 className="sa-heading sa-heading--xl">{t.experienceLead}</h2>
            <p className="sa-body sa-body--lg">{t.experienceBody}</p>
          </div>
        </Reveal>

        <div className="sa-bleed" aria-hidden>
          <img src={imgDining} alt="" />
        </div>

        <Reveal as="section" id="menu" className="sa-section sa-food">
          <div className="sa-wrap">
            <header className="sa-section__head sa-section__head--wide">
              <p className="sa-eyebrow">{t.foodTitle}</p>
              <h2 className="sa-heading">{t.foodLead}</h2>
              <p className="sa-body">{t.foodBody}</p>
            </header>

            <div className="sa-feature-grid">
              <article className="sa-feature sa-feature--tall">
                <img src={imgTable} alt="" loading="lazy" />
                <div className="sa-feature__cap">
                  <span>{t.dishes[0]?.tag}</span>
                  <h3>{t.dishes[0]?.name}</h3>
                  <p>{t.dishes[0]?.desc}</p>
                </div>
              </article>
              <article className="sa-feature">
                <img src={imgKitchen} alt="" loading="lazy" />
                <div className="sa-feature__cap">
                  <span>{t.dishes[1]?.tag}</span>
                  <h3>{t.dishes[1]?.name}</h3>
                  <p>{t.dishes[1]?.desc}</p>
                </div>
              </article>
              <article className="sa-feature">
                <img src={imgCafe} alt="" loading="lazy" />
                <div className="sa-feature__cap">
                  <span>{t.dishes[2]?.tag}</span>
                  <h3>{t.dishes[2]?.name}</h3>
                  <p>{t.dishes[2]?.desc}</p>
                </div>
              </article>
            </div>

            <p className="sa-menu__note">{t.menuNote}</p>
            <p className="sa-menu-label">{t.menuTitle}</p>
          </div>
        </Reveal>

        <Reveal as="section" id="lunch" className="sa-section sa-split">
          <div className="sa-wrap sa-split__grid">
            <div className="sa-split__media">
              <img src={imgTerrace} alt="" loading="lazy" />
            </div>
            <div className="sa-split__copy">
              <p className="sa-eyebrow">{t.lunchTitle}</p>
              <h2 className="sa-heading">{t.lunchLead}</h2>
              <p className="sa-body">{t.lunchBody}</p>
              <ul className="sa-price-list">
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
          </div>
        </Reveal>

        <Reveal as="section" className="sa-section sa-drinks">
          <div className="sa-wrap">
            <header className="sa-section__head sa-section__head--center">
              <p className="sa-eyebrow">{t.drinksTitle}</p>
              <h2 className="sa-heading">{t.drinksLead}</h2>
              <p className="sa-body">{t.drinksBody}</p>
            </header>
            <div className="sa-drink-row">
              <figure>
                <img src={imgDrink} alt="" loading="lazy" />
              </figure>
              <figure>
                <img src={imgDrink2} alt="" loading="lazy" />
              </figure>
              <figure>
                <img src={imgCafe} alt="" loading="lazy" />
              </figure>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="groups" className="sa-section sa-split sa-split--flip">
          <div className="sa-wrap sa-split__grid">
            <div className="sa-split__copy">
              <p className="sa-eyebrow">{t.groupsTitle}</p>
              <h2 className="sa-heading">{t.groupsLead}</h2>
              <p className="sa-body">{t.groupsBody}</p>
              <a href="#contact" className="sa-btn sa-btn--solid">
                {t.groupsCta}
              </a>
            </div>
            <div className="sa-split__media">
              <img src={imgGroups} alt="" loading="lazy" />
            </div>
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

        <Reveal as="section" id="gift" className="sa-section sa-gift">
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
