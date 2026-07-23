import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import restadigiLogo from "@/assets/restadigi-logo.png";
import { LocaleFlag, useLocale, useMessages, type Locale } from "@/i18n";

type MenuKey = "palvelut" | "toimialat" | "kielet" | "yhteys" | null;

const SERVICE_PATHS = [
  "/verkkosivut",
  "/nakyvyys-ja-suunnittelu",
  "/ai-asiakaspalvelu",
  "/poytavaraupalvelu",
  "/yllapito",
] as const;

type ServicePath = (typeof SERVICE_PATHS)[number];

function isServicePath(to: string): to is ServicePath {
  return (SERVICE_PATHS as readonly string[]).includes(to);
}

export function SiteHeader() {
  const t = useMessages();
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<MenuKey>(null);
  const [mobileSection, setMobileSection] = useState<MenuKey>(null);
  const navRef = useRef<HTMLElement>(null);
  const baseId = useId();

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!navRef.current?.contains(e.target as Node)) {
        setDesktopMenu(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDesktopMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggleDesktop(key: Exclude<MenuKey, null>) {
    setDesktopMenu((cur) => (cur === key ? null : key));
  }

  function toggleMobileSection(key: Exclude<MenuKey, null>) {
    setMobileSection((cur) => (cur === key ? null : key));
  }

  function pickLanguage(code: Locale) {
    setLocale(code);
    setDesktopMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }

  const triggerClass =
    "inline-flex items-center gap-1.5 whitespace-nowrap text-xs tracking-[0.12em] uppercase text-foreground/70 transition-colors hover:text-foreground xl:text-sm";

  return (
    <nav ref={navRef} className="relative z-30 pt-4 pb-3 sm:pt-6 sm:pb-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 pl-2 pr-6 sm:pl-3 lg:pl-1">
        <Link
          to="/"
          className="site-header__brand shrink-0"
          onClick={() => {
            setMobileOpen(false);
            setDesktopMenu(null);
          }}
          aria-label={t.header.homeAria}
        >
          <img
            src={restadigiLogo}
            alt={t.header.logoAlt}
            width={640}
            height={172}
            className="site-header__logo"
          />
        </Link>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          <div className="relative">
            <button
              type="button"
              className={triggerClass}
              aria-expanded={desktopMenu === "palvelut"}
              aria-controls={`${baseId}-palvelut`}
              onClick={() => toggleDesktop("palvelut")}
            >
              {t.header.services}
              <Chevron open={desktopMenu === "palvelut"} />
            </button>
            {desktopMenu === "palvelut" && (
              <div
                id={`${baseId}-palvelut`}
                className="absolute left-0 top-full z-40 mt-3 min-w-[16rem] rounded-xl border border-border bg-background p-2 shadow-lg"
              >
                {t.header.servicesList.map((item) =>
                  isServicePath(item.to) ? (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDesktopMenu(null)}
                      className="block rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                      activeProps={{ className: "bg-muted text-foreground" }}
                    >
                      {item.label}
                    </Link>
                  ) : null,
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className={triggerClass}
              aria-expanded={desktopMenu === "toimialat"}
              aria-controls={`${baseId}-toimialat`}
              onClick={() => toggleDesktop("toimialat")}
            >
              {t.header.industries}
              <Chevron open={desktopMenu === "toimialat"} />
            </button>
            {desktopMenu === "toimialat" && (
              <div
                id={`${baseId}-toimialat`}
                className="fixed left-1/2 top-1/2 z-40 w-[min(42rem,calc(100vw-3rem))] max-h-[min(80vh,36rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl xl:w-[44rem]"
              >
                <div className="mb-1 text-xs uppercase tracking-[0.2em] text-accent">
                  {t.header.industries}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-foreground/55">
                  {t.header.industriesIntro}
                </p>
                <ul className="space-y-0 divide-y divide-border/80">
                  {t.header.industriesList.map((item) => (
                    <li key={item.title} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="text-sm font-medium tracking-tight text-foreground">
                        {item.title}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link
            to="/hinnasto"
            className={triggerClass}
            onClick={() => setDesktopMenu(null)}
            activeProps={{ className: "text-foreground" }}
          >
            {t.header.pricing}
          </Link>

          <div className="relative">
            <button
              type="button"
              className={`${triggerClass} gap-2`}
              aria-expanded={desktopMenu === "kielet"}
              aria-controls={`${baseId}-kielet`}
              onClick={() => toggleDesktop("kielet")}
              aria-label={t.header.languages}
            >
              <LocaleFlag locale={locale} className="size-4 rounded-[2px] ring-1 ring-border/60" />
              <span className="uppercase tracking-[0.12em]">{locale}</span>
              <Chevron open={desktopMenu === "kielet"} />
            </button>
            {desktopMenu === "kielet" && (
              <div
                id={`${baseId}-kielet`}
                className="absolute right-0 top-full z-40 mt-3 min-w-[11rem] rounded-xl border border-border bg-background p-2 shadow-lg"
              >
                {t.header.languagesList.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => pickLanguage(item.code)}
                    className={
                      locale === item.code
                        ? "flex w-full items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5 text-left text-sm text-foreground"
                        : "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    }
                  >
                    <LocaleFlag
                      locale={item.code}
                      className="size-5 rounded-[2px] ring-1 ring-border/50"
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className={triggerClass}
              aria-expanded={desktopMenu === "yhteys"}
              aria-controls={`${baseId}-yhteys`}
              onClick={() => toggleDesktop("yhteys")}
            >
              {t.header.contact}
              <Chevron open={desktopMenu === "yhteys"} />
            </button>
            {desktopMenu === "yhteys" && (
              <div
                id={`${baseId}-yhteys`}
                className="absolute right-0 top-full z-40 mt-3 w-[min(20rem,calc(100vw-3rem))] rounded-xl border border-border bg-background p-5 shadow-lg"
              >
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  {t.header.contactPanel.company}
                </div>
                <p className="mt-1 text-sm text-foreground/70">{t.header.contactPanel.person}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {t.header.contactPanel.address}
                </p>
                <div className="mt-4 space-y-2 border-t border-border/70 pt-4">
                  <a
                    href={`mailto:${t.header.contactPanel.email}`}
                    className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <span className="text-foreground/45">{t.header.contactPanel.emailLabel}: </span>
                    {t.header.contactPanel.email}
                  </a>
                  <a
                    href={`tel:${t.header.contactPanel.phoneTel}`}
                    className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <span className="text-foreground/45">{t.header.contactPanel.phoneLabel}: </span>
                    {t.header.contactPanel.phoneDisplay}
                  </a>
                  <a
                    href={`https://wa.me/${t.header.contactPanel.phoneTel.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <span className="text-foreground/45">
                      {t.header.contactPanel.whatsappLabel}:{" "}
                    </span>
                    {t.header.contactPanel.whatsappDisplay}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={t.header.menu}
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen((o) => !o);
            setDesktopMenu(null);
          }}
          className="lg:hidden inline-flex items-center justify-center size-9 -mr-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-6"
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden absolute inset-x-0 top-full z-40 border-t border-border bg-background shadow-md">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 py-4 pl-2 pr-6 sm:pl-3">
            <MobileSection
              label={t.header.services}
              open={mobileSection === "palvelut"}
              onToggle={() => toggleMobileSection("palvelut")}
            >
              {t.header.servicesList.map((item) =>
                isServicePath(item.to) ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileSection(null);
                    }}
                    className="block py-2 text-base text-foreground/80 hover:text-foreground"
                    activeProps={{ className: "text-accent" }}
                  >
                    {item.label}
                  </Link>
                ) : null,
              )}
            </MobileSection>

            <MobileSection
              label={t.header.industries}
              open={mobileSection === "toimialat"}
              onToggle={() => toggleMobileSection("toimialat")}
            >
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-accent">
                  {t.header.industries}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-foreground/55">
                  {t.header.industriesIntro}
                </p>
                <ul className="space-y-0 divide-y divide-border/70">
                  {t.header.industriesList.map((item) => (
                    <li key={item.title} className="py-3 first:pt-0 last:pb-0">
                      <div className="text-sm font-medium text-foreground">{item.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/60">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </MobileSection>

            <Link
              to="/hinnasto"
              onClick={() => {
                setMobileOpen(false);
                setMobileSection(null);
              }}
              className="border-b border-border/60 py-4 text-lg text-foreground"
              activeProps={{ className: "text-accent" }}
            >
              {t.header.pricing}
            </Link>

            <MobileSection
              label={t.header.languages}
              open={mobileSection === "kielet"}
              onToggle={() => toggleMobileSection("kielet")}
            >
              {t.header.languagesList.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => pickLanguage(item.code)}
                  className={
                    locale === item.code
                      ? "flex w-full items-center gap-2.5 py-2 text-left text-base text-accent"
                      : "flex w-full items-center gap-2.5 py-2 text-left text-base text-foreground/80 hover:text-foreground"
                  }
                >
                  <LocaleFlag
                    locale={item.code}
                    className="size-5 rounded-[2px] ring-1 ring-border/50"
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </MobileSection>

            <MobileSection
              label={t.header.contact}
              open={mobileSection === "yhteys"}
              onToggle={() => toggleMobileSection("yhteys")}
            >
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="text-sm font-semibold text-foreground">
                  {t.header.contactPanel.company}
                </div>
                <p className="mt-1 text-sm text-foreground/70">{t.header.contactPanel.person}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {t.header.contactPanel.address}
                </p>
                <div className="mt-4 space-y-2 border-t border-border/70 pt-4">
                  <a
                    href={`mailto:${t.header.contactPanel.email}`}
                    className="block text-sm text-foreground/80 hover:text-foreground"
                  >
                    <span className="text-foreground/45">{t.header.contactPanel.emailLabel}: </span>
                    {t.header.contactPanel.email}
                  </a>
                  <a
                    href={`tel:${t.header.contactPanel.phoneTel}`}
                    className="block text-sm text-foreground/80 hover:text-foreground"
                  >
                    <span className="text-foreground/45">{t.header.contactPanel.phoneLabel}: </span>
                    {t.header.contactPanel.phoneDisplay}
                  </a>
                  <a
                    href={`https://wa.me/${t.header.contactPanel.phoneTel.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-foreground/80 hover:text-foreground"
                  >
                    <span className="text-foreground/45">
                      {t.header.contactPanel.whatsappLabel}:{" "}
                    </span>
                    {t.header.contactPanel.whatsappDisplay}
                  </a>
                </div>
              </div>
            </MobileSection>
          </div>
        </div>
      )}
    </nav>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function MobileSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border/60 py-2 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-2 text-left text-lg text-foreground"
      >
        {label}
        <Chevron open={open} />
      </button>
      {open && <div className="pb-3 pl-1">{children}</div>}
    </div>
  );
}
