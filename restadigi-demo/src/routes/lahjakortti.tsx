import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { useLocale } from "@/i18n";
import { getShowcaseCopy, SHOWCASE_BRAND } from "@/i18n/showcase-landing";

export const Route = createFileRoute("/lahjakortti")({
  head: () => ({
    meta: [
      { title: "Lahjakortti — Maison Aurelia" },
      {
        name: "description",
        content: "Osta digitaalinen lahjakortti Maison Aureliaan — demoesimerkki.",
      },
    ],
  }),
  component: GiftCardPage,
});

function GiftCardPage() {
  const { locale } = useLocale();
  const t = getShowcaseCopy(locale);
  const g = t.giftPage;
  const [amount, setAmount] = useState(g.amounts[1]?.value ?? 100);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = g.metaTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", g.metaDescription);
  }, [g.metaTitle, g.metaDescription]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="showcase-landing sa-gift-page">
      <div className="sa-ribbon">
        <p>{t.demoRibbon}</p>
      </div>

      <header className="sa-nav sa-nav--solid">
        <div className="sa-nav__inner">
          <Link to="/" className="sa-brand">
            <span className="sa-brand__mark">MA</span>
            <span className="sa-brand__name">{SHOWCASE_BRAND}</span>
          </Link>
          <nav className="sa-nav__links" aria-label="Main">
            <Link to="/">{g.backHome}</Link>
          </nav>
        </div>
      </header>

      <main className="sa-gift-page__main">
        <div className="sa-wrap sa-gift-page__layout">
          <div className="sa-gift-page__intro">
            <p className="sa-eyebrow">{g.eyebrow}</p>
            <h1 className="sa-heading">{g.title}</h1>
            <p className="sa-body sa-body--lg">{g.intro}</p>
            <div className="sa-gift-card" aria-hidden>
              <p className="sa-gift-card__brand">{SHOWCASE_BRAND}</p>
              <p className="sa-gift-card__label">{t.giftTitle}</p>
              <p className="sa-gift-card__amount">{amount} €</p>
            </div>
          </div>

          <div className="sa-gift-page__panel">
            {done ? (
              <div className="sa-gift-success">
                <h2 className="sa-heading sa-heading--sm">{g.successTitle}</h2>
                <p className="sa-body">{g.successBody}</p>
                <div className="sa-gift-success__actions">
                  <button
                    type="button"
                    className="sa-btn sa-btn--solid"
                    onClick={() => setDone(false)}
                  >
                    {g.buyAnother}
                  </button>
                  <Link to="/" className="sa-btn sa-btn--outline">
                    {g.backHome}
                  </Link>
                </div>
              </div>
            ) : (
              <form className="sa-gift-form" onSubmit={onSubmit}>
                <fieldset>
                  <legend>{g.amountsLabel}</legend>
                  <div className="sa-gift-amounts" role="radiogroup" aria-label={g.amountsLabel}>
                    {g.amounts.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={amount === opt.value}
                        className={
                          "sa-gift-amount" + (amount === opt.value ? " is-active" : "")
                        }
                        onClick={() => setAmount(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label>
                  <span>{g.recipientLabel}</span>
                  <input
                    name="recipient"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={g.recipientPlaceholder}
                  />
                </label>

                <label>
                  <span>{g.emailLabel}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={g.emailPlaceholder}
                  />
                </label>

                <label>
                  <span>{g.messageLabel}</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder={g.messagePlaceholder}
                  />
                </label>

                <button type="submit" className="sa-btn sa-btn--solid sa-gift-form__submit">
                  {g.submit}
                </button>
                <p className="sa-gift-form__note">{g.demoNote}</p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
