import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Package } from "lucide-react";
import {
  PackageBrandLogos,
  PackageBrandWorkLogos,
  PackageSportsPhotos,
  packageHeaderKind,
} from "@/components/package-brand-logos";
import { PackageDeviceHeader, type PackageDeviceMode } from "@/components/package-device-header";

export type ProductPackage = {
  name: string;
  price: string;
  featured?: boolean;
  bullets: string[];
  /** Optional intro text shown above bullets in the detail box */
  description?: string;
  /** Symbol shown top-right next to the brown Restadigi panel */
  icon?: LucideIcon;
  /** Replace brown Restadigi panel with portfolio logos (graphic design) */
  headerVisual?: "brandLogos";
  /** Topic photo for the brown header panel (websites / hosting) */
  headerImage?: string;
  /** Up to 4 per-device images (e.g. sports package) */
  headerImages?: string[];
  /** Short blurb under the price on the card (before Tutustu) */
  summary?: string;
  /** Full-bleed device-layout header (website packages) — no icon column */
  deviceLayout?: boolean;
  /** Screen content mode for device header */
  deviceMode?: PackageDeviceMode;
};

type ProductPackageCardsProps = {
  title: string;
  explore: string;
  popular: string;
  requestQuote: string;
  closeLabel: string;
  packages: ProductPackage[];
  footnote?: ReactNode;
  sectionId?: string;
  /** Kun true, ei omaa taustakaistaa — käytetään MarketingBandin sisällä */
  embedded?: boolean;
};

export function RestadigiBrownPanel({
  className = "",
  compact = false,
  image,
}: {
  className?: string;
  compact?: boolean;
  image?: string;
}) {
  if (image) {
    return (
      <div className={"relative overflow-hidden bg-white " + className}>
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className={"relative overflow-hidden rounded-[1.75rem] bg-[#432f24] " + className}>
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span
          className={
            "font-script w-[110%] select-none whitespace-nowrap text-center leading-none tracking-wide text-[#4a3528]/55 " +
            (compact ? "text-[clamp(3.5rem,12vw,6rem)]" : "text-[clamp(4.5rem,14vw,9rem)]")
          }
        >
          Restadigi
        </span>
      </div>
      <div className="relative flex h-full items-center justify-center px-6">
        <p
          className={
            "font-script leading-none text-[#c9a882] " +
            (compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl lg:text-7xl")
          }
        >
          Restadigi
        </p>
      </div>
    </div>
  );
}

export function ProductPackageCards({
  title,
  explore,
  popular,
  requestQuote,
  closeLabel,
  packages,
  footnote,
  sectionId,
  embedded = false,
}: ProductPackageCardsProps) {
  const [openPackage, setOpenPackage] = useState<string | null>(null);
  const selected = packages.find((pkg) => pkg.name === openPackage) ?? null;
  const SelectedIcon = selected?.icon;

  const grid = (
    <>
      <h2
        className={
          embedded
            ? "mb-8 max-w-[16ch] text-[2.35rem] font-extrabold leading-[0.98] tracking-tight sm:mb-10 sm:text-5xl lg:text-[3.75rem]"
            : "mb-8 text-center text-3xl font-bold tracking-tight sm:mb-12 sm:text-4xl"
        }
      >
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 sm:items-stretch">
        {packages.map((pkg, pkgIndex) => {
          const Icon = pkg.icon ?? Package;
          const headerKind =
            pkg.headerVisual === "brandLogos" ? "brandLogos" : packageHeaderKind(pkg.name);
          const deviceMode = pkg.deviceMode ?? "image";
          const deviceLayout = Boolean(
            pkg.deviceLayout &&
            (pkg.headerImage ||
              (pkg.headerImages && pkg.headerImages.length > 0) ||
              (pkg.deviceMode && pkg.deviceMode !== "image")),
          );
          const headerH = deviceLayout
            ? ""
            : headerKind === "sports" || headerKind === "brandLogos"
              ? "h-36 sm:h-40"
              : pkg.headerImage
                ? "h-28 sm:h-32"
                : "h-[5.75rem] sm:h-[6.5rem]";
          return (
            <article
              key={pkg.name}
              className="flex h-full flex-col overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border-2 border-[#432f24] bg-white shadow-[0_16px_48px_-20px_rgba(50,30,20,0.28)]"
            >
              {deviceLayout ? (
                <div className={"relative shrink-0 overflow-hidden bg-white " + headerH}>
                  <PackageDeviceHeader
                    image={pkg.headerImage}
                    images={pkg.headerImages}
                    mode={deviceMode}
                    variant={pkgIndex}
                  />
                </div>
              ) : headerKind === "ai" || headerKind === "google" ? (
                <div
                  className={
                    "flex shrink-0 items-center gap-3 bg-white px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 " +
                    headerH
                  }
                >
                  <div className="min-w-0 flex-1">
                    <PackageBrandLogos kind={headerKind} logosOnly />
                  </div>
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#f3eee8] text-[#432f24] sm:size-16"
                    aria-hidden
                  >
                    <Icon className="size-8 sm:size-9" strokeWidth={1.5} />
                  </div>
                </div>
              ) : headerKind === "sports" ? (
                <PackageSportsPhotos className={"shrink-0 " + headerH} />
              ) : headerKind === "brandLogos" ? (
                <PackageBrandWorkLogos className={"shrink-0 " + headerH} />
              ) : (
                <div className={"grid shrink-0 grid-cols-[1.15fr_0.85fr] items-stretch " + headerH}>
                  <RestadigiBrownPanel
                    className="h-full rounded-none"
                    compact
                    image={pkg.headerImage}
                  />
                  <div
                    className="flex items-center justify-center bg-[#f3eee8] text-[#432f24]"
                    aria-hidden
                  >
                    <Icon className="size-10 sm:size-12" strokeWidth={1.5} />
                  </div>
                </div>
              )}
              <div
                className={
                  deviceLayout
                    ? "flex flex-1 flex-col items-center justify-center gap-3 px-5 py-5 text-center sm:gap-3.5 sm:px-6 sm:py-6"
                    : "flex flex-1 flex-col items-center justify-center gap-4 px-5 py-6 text-center sm:gap-5 sm:px-8 sm:py-8"
                }
              >
                <div className="w-full">
                  <div className="mb-1.5 flex flex-wrap items-center justify-center gap-2">
                    {pkg.icon && (
                      <Icon
                        className={
                          deviceLayout
                            ? "size-5 shrink-0 text-[#432f24] sm:size-6"
                            : "size-6 shrink-0 text-[#432f24] sm:size-7"
                        }
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    )}
                    <h3
                      className={
                        deviceLayout
                          ? "text-lg font-bold leading-tight tracking-tight sm:text-xl"
                          : "max-w-[16ch] text-xl font-bold leading-tight tracking-tight sm:max-w-none sm:text-2xl lg:text-3xl"
                      }
                    >
                      {pkg.name}
                    </h3>
                    {pkg.featured && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-accent-foreground">
                        {popular}
                      </span>
                    )}
                  </div>
                  <p
                    className={
                      deviceLayout
                        ? "font-serif text-xl text-foreground sm:text-2xl"
                        : "font-serif text-2xl text-foreground sm:text-3xl lg:text-4xl"
                    }
                  >
                    {pkg.price}
                  </p>
                  {pkg.summary && (
                    <p
                      className={
                        deviceLayout
                          ? "mx-auto mt-2.5 max-w-[34ch] text-sm leading-relaxed text-foreground/65"
                          : "mx-auto mt-3 max-w-[36ch] text-sm leading-relaxed text-foreground/65 sm:text-base"
                      }
                    >
                      {pkg.summary}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenPackage(pkg.name)}
                  className={
                    deviceLayout
                      ? "inline-flex min-w-[9rem] items-center justify-center rounded-full !bg-[#432f24] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] !text-[#f7f3ee] transition-opacity hover:opacity-90"
                      : "inline-flex min-w-[10rem] items-center justify-center rounded-full !bg-[#432f24] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] !text-[#f7f3ee] transition-opacity hover:opacity-90"
                  }
                >
                  {explore}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {footnote && (
        <div
          className={
            embedded
              ? "mt-8 text-center text-xs text-foreground/55"
              : "mt-10 text-center text-xs text-muted-foreground"
          }
        >
          {footnote}
        </div>
      )}
    </>
  );

  return (
    <>
      {embedded ? (
        <div id={sectionId}>{grid}</div>
      ) : (
        <section id={sectionId} className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">{grid}</div>
        </section>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 backdrop-blur-[2px]"
          onClick={() => setOpenPackage(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-package-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-xl border-2 border-[#432f24] bg-background p-6 shadow-lg sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 text-xs uppercase tracking-[0.2em] text-accent">{title}</div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              {SelectedIcon && (
                <SelectedIcon
                  className="size-6 shrink-0 text-[#432f24]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              )}
              <h3 id="product-package-title" className="text-2xl font-medium tracking-tight">
                {selected.name}
              </h3>
              {selected.featured && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-accent-foreground">
                  {popular}
                </span>
              )}
            </div>
            <p className="mb-4 font-serif text-3xl text-foreground/90">{selected.price}</p>
            {selected.description && (
              <p className="mb-5 text-sm leading-relaxed text-foreground/70">
                {selected.description}
              </p>
            )}
            <ul className="space-y-0 divide-y divide-border/80">
              {selected.bullets.map((bullet) => (
                <li key={bullet} className="py-3.5 first:pt-0 last:pb-0">
                  <p className="text-sm leading-relaxed text-foreground/70">{bullet}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/yhteys"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
              >
                {requestQuote}
              </Link>
              <button
                type="button"
                onClick={() => setOpenPackage(null)}
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {closeLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
