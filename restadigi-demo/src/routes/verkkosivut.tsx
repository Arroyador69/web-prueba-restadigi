import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Gem, Plus, Sparkles, type LucideIcon } from "lucide-react";
import successTouristGroup from "@/assets/success-tourist-group.jpg";
import mockRyhmille from "@/assets/mock-ryhmille.jpg";
import successGuestsArriving from "@/assets/success-guests-arriving.jpg";
import { ProductPackageCards } from "@/components/product-package-cards";
import { MarketingBand } from "@/components/marketing-band";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { PageMeta } from "@/components/page-meta";
import { useMessages } from "@/i18n";

const PACKAGE_ICONS: Record<string, LucideIcon> = {
  Start: Sparkles,
  Plus: Plus,
  Kulta: Crown,
  Gold: Crown,
  Oro: Crown,
  Timantti: Gem,
  Diamond: Gem,
  Diamante: Gem,
};

/** Näkyvyys → kävijät → varaukset */
const SUCCESS_SCENES = [
  { src: successTouristGroup, alt: "Turisteja retkellä" },
  { src: successGuestsArriving, alt: "Asiakkaita saapumassa" },
  { src: mockRyhmille, alt: "Ryhmäravintolan pöytä" },
] as const;

export const Route = createFileRoute("/verkkosivut")({
  head: () => ({
    meta: [
      { title: "Kotisivut yrityksille — Restadigi" },
      {
        name: "description",
        content:
          "Selkeät ja vaikuttavat kotisivupaketit ja graafiset lisäpalvelut yrityksille ja yhdistyksille.",
      },
      { property: "og:title", content: "Kotisivut yrityksille — Restadigi" },
      {
        property: "og:description",
        content: "Kotisivupaketit ja graafiset lisäpalvelut yrityksesi tarpeisiin.",
      },
    ],
  }),
  component: KotisivutPage,
});

function KotisivutPage() {
  const t = useMessages();
  const w = t.websites;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={w.meta.title}
        description={w.meta.description}
        ogTitle={w.meta.ogTitle}
        ogDescription={w.meta.ogDescription}
      />
      <SiteHeader />

      <PageHero
        devices
        title={
          <>
            {w.hero.titleBefore}
            <span className="font-serif italic text-accent">{w.hero.titleAccent}</span>
            {w.hero.titleAfter}
          </>
        }
        description={w.hero.description}
      />

      <MarketingBand className="!bg-white">
        <article className="relative mb-5">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#432f24] text-white shadow-[0_16px_48px_-20px_rgba(50,30,20,0.28)] sm:rounded-[2rem]">
            <div className="grid items-stretch lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)]">
              <div className="flex items-center px-6 py-8 sm:px-8 sm:py-10 lg:py-8 lg:pl-8 lg:pr-4">
                <div className="min-w-0">
                  <h2 className="max-w-[22ch] text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                    {w.midBanner.title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/88 sm:text-base">
                    {w.midBanner.description}
                  </p>
                </div>
              </div>
              <div className="grid min-h-0 grid-cols-3 gap-0.5 bg-[#432f24]">
                {SUCCESS_SCENES.map((scene) => (
                  <div
                    key={scene.alt}
                    className="relative aspect-[3/4] overflow-hidden bg-white lg:aspect-auto lg:min-h-[13.5rem]"
                  >
                    <img
                      src={scene.src}
                      alt=""
                      aria-hidden
                      className="size-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <a
            href="#verkkosivu-paketit"
            className="page-hero__devices-promo-chip page-hero__devices-promo-chip--banner hidden lg:inline-flex"
            aria-label={w.hero.promo}
          >
            <span className="page-hero__devices-promo-line">{w.hero.promoLine1}</span>
            <span className="page-hero__devices-promo-price">{w.hero.promoLine2}</span>
          </a>
        </article>

        {/* Mobiili: tarjouspallo kokonaan näkyvissä mid-bannerin ja pakettiotsikon välissä */}
        <div className="mb-6 flex justify-center lg:hidden">
          <a
            href="#verkkosivu-paketit"
            className="page-hero__devices-promo-chip page-hero__devices-promo-chip--mobile"
            aria-label={w.hero.promo}
          >
            <span className="page-hero__devices-promo-line">{w.hero.promoLine1}</span>
            <span className="page-hero__devices-promo-price">{w.hero.promoLine2}</span>
          </a>
        </div>

        <ProductPackageCards
          embedded
          sectionId="verkkosivu-paketit"
          title={w.packagesTitle}
          explore={w.explore}
          popular={w.popular}
          requestQuote={w.requestQuote}
          closeLabel={t.widget.sales.closeLabel}
          packages={w.packages.map((pkg) => ({
            name: pkg.name,
            price: pkg.price,
            featured: pkg.featured,
            description: pkg.tagline,
            summary: pkg.summary,
            bullets: pkg.bullets,
            deviceLayout: true,
            deviceMode: "site-layouts" as const,
            icon: PACKAGE_ICONS[pkg.name],
          }))}
          footnote={
            <>
              {w.footnoteBefore}
              <Link to="/yllapito" className="underline underline-offset-2 hover:text-foreground">
                {w.footnoteLink}
              </Link>
              {w.footnoteAfter}
            </>
          }
        />

        <article className="mt-10 overflow-hidden rounded-[1.75rem] bg-[#432f24] text-white shadow-[0_16px_48px_-20px_rgba(50,30,20,0.28)] sm:mt-14 sm:rounded-[2rem]">
          <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <h2 className="max-w-[22ch] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {w.process.title}
            </h2>
            <ol className="mt-8 divide-y divide-white/15 sm:mt-10">
              {w.process.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
                >
                  <span className="font-serif text-3xl italic leading-none text-accent sm:text-4xl">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}
