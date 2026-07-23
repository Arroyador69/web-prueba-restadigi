import type { ReactNode } from "react";
import {
  ClaudeMark,
  CopilotMark,
  GeminiMark,
  GoogleAdsMark,
  GoogleAnalyticsMark,
  GoogleBusinessMark,
  GoogleMark,
  OpenaiMark,
} from "@/components/package-brand-logos";
import barberHero from "@/assets/barber-haircut-hero.jpg";
import hotelHero from "@/assets/hero-hotel-web.jpg";
import diningHero from "@/assets/restaurant-dining.jpg";
import coffeeHero from "@/assets/hero-coffee-panel.jpg";
import fineDiningHero from "@/assets/hero-fine-dining.jpg";
import terraceHero from "@/assets/success-busy-terrace.jpg";
import eventHero from "@/assets/mock-tapahtumat.jpg";
import berryHero from "@/assets/freddos-v2-berry.jpg";
import cafeHero from "@/assets/restaurant-cafe.jpg";
import bookingHero from "@/assets/hero-booking-tables.jpg";
import lobbyHero from "@/assets/hero-hotel-lobby.jpg";
import kitchenHero from "@/assets/restaurant-kitchen.jpg";
import interiorHero from "@/assets/restaurant-interior.jpg";
import guestsHero from "@/assets/success-guests-arriving.jpg";
import groupHero from "@/assets/success-tourist-group.jpg";
import domainhotelliLogo from "@/assets/domainhotelli-logo-white.svg";

export type PackageDeviceMode =
  "image" | "ai-logos" | "google-logos" | "hosting-logos" | "layouts" | "site-layouts" | "sports";

type PackageDeviceHeaderProps = {
  /** Fallback / single image for all screens (websites, hosting) */
  image?: string;
  /** Up to 4 per-device images (sports, photo layouts) */
  images?: string[];
  mode?: PackageDeviceMode;
  /** Pieni vaihtelu asettelussa pakettien välillä */
  variant?: number;
};

const AI_SCREEN_LOGOS = [
  { name: "ChatGPT", Mark: OpenaiMark, tone: "text-[#412524]" },
  { name: "Claude", Mark: ClaudeMark, tone: "text-[#d97757]" },
  { name: "Gemini", Mark: GeminiMark, tone: "text-[#8E75B2]" },
  { name: "Copilot", Mark: CopilotMark, tone: "text-[#0078D4]" },
] as const;

const GOOGLE_SCREEN_LOGOS = [
  { name: "Google", Mark: GoogleMark },
  { name: "Google Ads", Mark: GoogleAdsMark },
  { name: "Analytics", Mark: GoogleAnalyticsMark },
  { name: "Business", Mark: GoogleBusinessMark },
] as const;

function SslMark({ className = "", title }: { className?: string; title: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V6a3 3 0 0 1 3-3zm0 10a1.75 1.75 0 0 1 .75 3.33V18a.75.75 0 0 1-1.5 0v-1.67A1.75 1.75 0 0 1 12 13z"
      />
    </svg>
  );
}

function WebMark({ className = "", title }: { className?: string; title: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c.7 0 2.2 1.6 2.8 5H9.2C9.8 5.6 11.3 4 12 4zm-4.1 7a14 14 0 0 0 0 2h8.2a14 14 0 0 0 0-2H7.9zm1.3 4H14.8c-.6 3.4-2.1 5-2.8 5s-2.2-1.6-2.8-5zM4.7 11c.3-1.4.8-2.7 1.5-3.8A8 8 0 0 0 4.1 11h.6zm0 2h-.6a8 8 0 0 0 2.1 3.8A11 11 0 0 1 4.7 13zm14.6-2h.6a8 8 0 0 0-2.1-3.8c.7 1.1 1.2 2.4 1.5 3.8zm0 2c-.3 1.4-.8 2.7-1.5 3.8a8 8 0 0 0 2.1-3.8h-.6z"
      />
    </svg>
  );
}

function SecurityMark({ className = "", title }: { className?: string; title: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12 2 4 5v6.5c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5V5l-8-3zm0 4.2 4.5 1.7v3.6c0 3.3-2.1 6.3-4.5 7.3-2.4-1-4.5-4-4.5-7.3V7.9L12 6.2z"
      />
    </svg>
  );
}

function LogoScreen({
  name,
  Mark,
  tone = "text-[#432f24]",
  className = "",
}: {
  name: string;
  Mark: (props: { className?: string; title: string }) => ReactNode;
  tone?: string;
  className?: string;
}) {
  return (
    <div className={"pkg-device__screen pkg-device__screen--logo " + className}>
      <div className="pkg-device__logo-panel">
        <Mark title={name} className={"pkg-device__logo-mark " + tone} />
        <span className="pkg-device__logo-name">{name}</span>
      </div>
    </div>
  );
}

function DomainhotelliLogoScreen({ className = "" }: { className?: string }) {
  return (
    <div className={"pkg-device__screen pkg-device__screen--logo " + className}>
      <div className="pkg-device__logo-panel">
        <div className="pkg-device__logo-tile pkg-device__logo-tile--dark">
          <img src={domainhotelliLogo} alt="" aria-hidden className="pkg-device__logo-img" />
        </div>
        <span className="pkg-device__logo-name">Domainhotelli</span>
      </div>
    </div>
  );
}

function HostingLogoScreen({ index, className = "" }: { index: number; className?: string }) {
  if (index === 0) {
    return <LogoScreen name="SSL" Mark={SslMark} tone="text-[#1a7f4b]" className={className} />;
  }
  if (index === 1) {
    return <LogoScreen name="Web" Mark={WebMark} tone="text-[#2563eb]" className={className} />;
  }
  if (index === 2) {
    return (
      <LogoScreen name="Suojaus" Mark={SecurityMark} tone="text-[#432f24]" className={className} />
    );
  }
  return <DomainhotelliLogoScreen className={className} />;
}

function LayoutScreen({ variant, className = "" }: { variant: 0 | 1 | 2 | 3; className?: string }) {
  /* 0 = iPhone */
  if (variant === 0) {
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--coffee">
          <div className="pkg-mini__nav">
            <span className="pkg-mini__brand">Restadigi</span>
            <span className="pkg-mini__menu" />
          </div>
          <div className="pkg-mini__hero-wrap">
            <img src={coffeeHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
          <div className="pkg-mini__cards-row pkg-mini__cards-row--mobile">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  /* 1 = iPad */
  if (variant === 1) {
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--dark">
          <div className="pkg-mini__nav pkg-mini__nav--dark">
            <span className="pkg-mini__brand">Restadigi</span>
            <span className="pkg-mini__links">
              <span>Palvelut</span>
              <span>Yhteys</span>
            </span>
          </div>
          <div className="pkg-mini__hero-wrap">
            <img src={diningHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
          <div className="pkg-mini__strip pkg-mini__strip--three">
            <span>SEO</span>
            <span>Ads</span>
            <span>Maps</span>
          </div>
        </div>
      </div>
    );
  }

  /* 2 = läppäri */
  if (variant === 2) {
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--cafe">
          <div className="pkg-mini__nav">
            <span className="pkg-mini__brand">Restadigi</span>
            <span className="pkg-mini__links">
              <span>Paketit</span>
              <span>Yhteys</span>
            </span>
          </div>
          <div className="pkg-mini__hero-wrap">
            <img src={hotelHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
          <div className="pkg-mini__strip pkg-mini__strip--three">
            <span>Start</span>
            <span>Plus</span>
            <span>Kulta</span>
          </div>
        </div>
      </div>
    );
  }

  /* 3 = ulkoinen näyttö */
  return (
    <div className={"pkg-device__screen " + className}>
      <div className="pkg-mini pkg-mini--dark">
        <div className="pkg-mini__nav pkg-mini__nav--dark">
          <span className="pkg-mini__brand">Restadigi</span>
          <span className="pkg-mini__links">
            <span>AI</span>
            <span>Chat</span>
            <span>Support</span>
          </span>
          <span className="pkg-mini__cta pkg-mini__cta--nav">Demo</span>
        </div>
        <div className="pkg-mini__hero-wrap">
          <img src={barberHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
        </div>
        <div className="pkg-mini__strip">
          <span>Chat</span>
          <span>Phone</span>
          <span>Email</span>
          <span>24/7</span>
        </div>
      </div>
    </div>
  );
}

function SiteLayoutScreen({
  variant,
  theme = 0,
  className = "",
}: {
  variant: 0 | 1 | 2 | 3;
  theme?: number;
  className?: string;
}) {
  const pkg = theme % 4;

  /* ——— Start (theme 0) ——— */
  if (pkg === 0) {
    const heroes = [diningHero, fineDiningHero, hotelHero, coffeeHero] as const;
    const hero = heroes[variant];
    const brands = ["Atelier", "Garden Table", "Lake House", "Nord Cut"] as const;
    const brand = brands[variant];

    if (variant === 0) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--coffee">
            <div className="pkg-mini__nav">
              <span className="pkg-mini__brand">{brand}</span>
              <span className="pkg-mini__menu" />
            </div>
            <div className="pkg-mini__hero-wrap">
              <img src={hero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            </div>
            <div className="pkg-mini__cards-row pkg-mini__cards-row--mobile">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      );
    }

    if (variant === 1) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--dark">
            <div className="pkg-mini__nav pkg-mini__nav--dark">
              <span className="pkg-mini__brand">{brand}</span>
              <span className="pkg-mini__links">
                <span>Menu</span>
                <span>Book</span>
              </span>
            </div>
            <div className="pkg-mini__hero-wrap">
              <img src={hero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            </div>
            <div className="pkg-mini__strip pkg-mini__strip--three">
              <span>Lunch</span>
              <span>Dinner</span>
              <span>Wine</span>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 2) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--cafe">
            <div className="pkg-mini__nav">
              <span className="pkg-mini__brand">{brand}</span>
              <span className="pkg-mini__links">
                <span>Menu</span>
                <span>Reserve</span>
              </span>
            </div>
            <div className="pkg-mini__hero-wrap">
              <img src={hero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            </div>
            <div className="pkg-mini__strip pkg-mini__strip--three">
              <span>Rooms</span>
              <span>Spa</span>
              <span>Book</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--list">
          <div className="pkg-mini__nav">
            <span className="pkg-mini__brand">{brand}</span>
            <span className="pkg-mini__menu" />
          </div>
          <img src={hero} alt="" className="pkg-mini__hero pkg-mini__hero--mid" />
          <div className="pkg-mini__list-items">
            <span>Cut</span>
            <span>Color</span>
            <span>Book</span>
          </div>
        </div>
      </div>
    );
  }

  /* ——— Plus (theme 1) ——— */
  if (pkg === 1) {
    if (variant === 0) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--stack">
            <div className="pkg-mini__nav">
              <span className="pkg-mini__brand">Nord Cut</span>
              <span className="pkg-mini__menu" />
            </div>
            <img src={barberHero} alt="" className="pkg-mini__hero pkg-mini__hero--mid" />
            <div className="pkg-mini__cta-bar">
              <span className="pkg-mini__cta">Varaa</span>
            </div>
          </div>
        </div>
      );
    }
    if (variant === 1) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--cafe-grid">
            <div className="pkg-mini__nav">
              <span className="pkg-mini__brand">Roastery</span>
              <span className="pkg-mini__links">
                <span>Menu</span>
                <span>Visit</span>
              </span>
            </div>
            <div className="pkg-mini__duo">
              <img src={berryHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
              <img src={cafeHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            </div>
            <div className="pkg-mini__strip pkg-mini__strip--three">
              <span>Coffee</span>
              <span>Pastry</span>
              <span>Takeaway</span>
            </div>
          </div>
        </div>
      );
    }
    if (variant === 2) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--hotel-split">
            <div className="pkg-mini__nav">
              <span className="pkg-mini__brand pkg-mini__brand--serif">Lake House</span>
              <span className="pkg-mini__links">
                <span>Rooms</span>
                <span>Spa</span>
              </span>
            </div>
            <div className="pkg-mini__hotel-row">
              <img src={lobbyHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
              <div className="pkg-mini__panel pkg-mini__panel--compact">
                <span className="pkg-mini__cta">Book</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--dark">
          <div className="pkg-mini__nav pkg-mini__nav--dark">
            <span className="pkg-mini__brand">Harbor</span>
            <span className="pkg-mini__links">
              <span>Tables</span>
              <span>Menu</span>
              <span>Contact</span>
            </span>
            <span className="pkg-mini__cta pkg-mini__cta--nav">Reserve</span>
          </div>
          <div className="pkg-mini__hero-wrap">
            <img src={bookingHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
          <div className="pkg-mini__strip pkg-mini__strip--three">
            <span>Tonight</span>
            <span>Weekend</span>
            <span>Groups</span>
          </div>
        </div>
      </div>
    );
  }

  /* ——— Kulta (theme 2) ——— */
  if (pkg === 2) {
    if (variant === 0) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--story">
            <div className="pkg-mini__hero-wrap">
              <img src={eventHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            </div>
            <div className="pkg-mini__cta-bar">
              <span className="pkg-mini__cta">Tickets</span>
            </div>
          </div>
        </div>
      );
    }
    if (variant === 1) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--magazine">
            <div className="pkg-mini__nav">
              <span className="pkg-mini__brand pkg-mini__brand--serif">Terrace</span>
              <span className="pkg-mini__menu" />
            </div>
            <div className="pkg-mini__mag-grid">
              <img src={terraceHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
              <div className="pkg-mini__mag-side">
                <img src={guestsHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
                <div className="pkg-mini__panel pkg-mini__panel--compact">
                  <span className="pkg-mini__cta">Reserve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (variant === 2) {
      return (
        <div className={"pkg-device__screen " + className}>
          <div className="pkg-mini pkg-mini--center">
            <div className="pkg-mini__nav pkg-mini__nav--center">
              <span className="pkg-mini__brand pkg-mini__brand--serif">Atelier</span>
            </div>
            <div className="pkg-mini__center-hero">
              <img src={kitchenHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            </div>
            <div className="pkg-mini__cta-bar">
              <span className="pkg-mini__cta">Menu</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--wide-band">
          <div className="pkg-mini__nav pkg-mini__nav--dark">
            <span className="pkg-mini__brand">Groups</span>
            <span className="pkg-mini__links">
              <span>Private</span>
              <span>Events</span>
              <span>Contact</span>
            </span>
          </div>
          <div className="pkg-mini__wide-hero">
            <img src={groupHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
          <div className="pkg-mini__stats">
            <span>
              <strong>12+</strong> tables
            </span>
            <span>
              <strong>50</strong> seats
            </span>
            <span>
              <strong>24/7</strong> book
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ——— Timantti (theme 3) ——— */
  if (variant === 0) {
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--list">
          <div className="pkg-mini__nav pkg-mini__nav--dark">
            <span className="pkg-mini__brand">Interior</span>
            <span className="pkg-mini__menu" />
          </div>
          <img src={interiorHero} alt="" className="pkg-mini__hero pkg-mini__hero--mid" />
          <div className="pkg-mini__list-items">
            <span>Spaces</span>
            <span>Lighting</span>
            <span>Atmosphere</span>
          </div>
        </div>
      </div>
    );
  }
  if (variant === 1) {
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--mosaic">
          <div className="pkg-mini__nav">
            <span className="pkg-mini__brand">Café Day</span>
            <span className="pkg-mini__links">
              <span>Order</span>
            </span>
          </div>
          <div className="pkg-mini__mosaic-grid">
            <img src={coffeeHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            <img src={berryHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            <img src={cafeHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
            <img src={diningHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
        </div>
      </div>
    );
  }
  if (variant === 2) {
    return (
      <div className={"pkg-device__screen " + className}>
        <div className="pkg-mini pkg-mini--dark">
          <div className="pkg-mini__nav pkg-mini__nav--dark">
            <span className="pkg-mini__brand">Signature</span>
            <span className="pkg-mini__links">
              <span>Menu</span>
              <span>Book</span>
            </span>
          </div>
          <div className="pkg-mini__hero-wrap">
            <img src={fineDiningHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
          </div>
          <div className="pkg-mini__strip pkg-mini__strip--three">
            <span>Tasting</span>
            <span>Wine</span>
            <span>Book</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={"pkg-device__screen " + className}>
      <div className="pkg-mini pkg-mini--cinema">
        <img src={terraceHero} alt="" className="pkg-mini__hero pkg-mini__hero--fill" />
        <div className="pkg-mini__cinema-scrim pkg-mini__cinema-scrim--slim">
          <span className="pkg-mini__brand pkg-mini__brand--serif pkg-mini__brand--light">
            Harbor
          </span>
          <span className="pkg-mini__cta pkg-mini__cta--light">Reserve</span>
        </div>
      </div>
    </div>
  );
}

function PhotoScreen({
  image,
  className = "",
  position = "center",
}: {
  image: string;
  className?: string;
  position?: string;
}) {
  return (
    <div className={"pkg-device__screen " + className}>
      <img
        src={image}
        alt=""
        aria-hidden
        className="pkg-device__shot"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

function renderScreen(
  mode: PackageDeviceMode,
  index: number,
  image?: string,
  images?: string[],
  theme = 0,
) {
  const screenClass = [
    "pkg-device__screen--phone",
    "pkg-device__screen--tablet",
    "pkg-device__screen--laptop",
    "pkg-device__screen--monitor",
  ][index];

  if (mode === "ai-logos") {
    const logo = AI_SCREEN_LOGOS[index];
    return (
      <LogoScreen name={logo.name} Mark={logo.Mark} tone={logo.tone} className={screenClass} />
    );
  }

  if (mode === "google-logos") {
    const logo = GOOGLE_SCREEN_LOGOS[index];
    return <LogoScreen name={logo.name} Mark={logo.Mark} className={screenClass} />;
  }

  if (mode === "hosting-logos") {
    return <HostingLogoScreen index={index} className={screenClass} />;
  }

  if (mode === "layouts") {
    return <LayoutScreen variant={index as 0 | 1 | 2 | 3} className={screenClass} />;
  }

  if (mode === "site-layouts") {
    return (
      <SiteLayoutScreen variant={index as 0 | 1 | 2 | 3} theme={theme} className={screenClass} />
    );
  }

  if (mode === "sports") {
    const src = images?.[index] ?? image ?? "";
    return <PhotoScreen image={src} className={screenClass} position="center" />;
  }

  const src = images?.[index] ?? image ?? "";
  return <PhotoScreen image={src} className={screenClass} />;
}

/** Neljä laitetta valkoisella taustalla pakettikorteille */
export function PackageDeviceHeader({
  image,
  images,
  mode = "image",
  variant = 0,
}: PackageDeviceHeaderProps) {
  const tilt = variant % 4;

  return (
    <div className="pkg-device-header">
      <div className="pkg-device-header__stage" aria-hidden>
        {/* iPhone */}
        <div className="pkg-device pkg-device--phone">
          <div className="pkg-device__bezel pkg-device__bezel--phone">
            <span className="pkg-device__island" />
            {renderScreen(mode, 0, image, images, tilt)}
            <span className="pkg-device__home-bar" />
          </div>
        </div>

        {/* iPad */}
        <div className="pkg-device pkg-device--tablet">
          <div className="pkg-device__bezel pkg-device__bezel--tablet">
            <span className="pkg-device__camera" />
            {renderScreen(mode, 1, image, images, tilt)}
          </div>
        </div>

        {/* Tietokone / läppäri */}
        <div className="pkg-device pkg-device--laptop">
          <div className="pkg-device__lid">
            <div className="pkg-device__bezel pkg-device__bezel--laptop">
              <span className="pkg-device__camera pkg-device__camera--laptop" />
              {renderScreen(mode, 2, image, images, tilt)}
            </div>
          </div>
          <div className="pkg-device__keyboard">
            <span className="pkg-device__trackpad" />
          </div>
        </div>

        {/* Leveä ulkoinen näyttö */}
        <div className="pkg-device pkg-device--monitor">
          <div className="pkg-device__bezel pkg-device__bezel--monitor">
            {renderScreen(mode, 3, image, images, tilt)}
          </div>
          <div className="pkg-device__neck" />
          <div className="pkg-device__foot" />
        </div>
      </div>
    </div>
  );
}
