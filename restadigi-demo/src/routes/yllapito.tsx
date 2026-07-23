import { Link, createFileRoute } from "@tanstack/react-router";
import { ProductPackageCards } from "@/components/product-package-cards";
import { MarketingBand } from "@/components/marketing-band";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMeta } from "@/components/page-meta";
import { useMessages } from "@/i18n";

export const Route = createFileRoute("/yllapito")({
  head: () => ({
    meta: [
      { title: "Ylläpito — Restadigi" },
      {
        name: "description",
        content:
          "Hosting- ja ylläpitopaketit yrityksille — nopea hosting Suomessa, domain, SSL ja jatkuva tuki.",
      },
      { property: "og:title", content: "Ylläpito — Restadigi" },
      {
        property: "og:description",
        content: "Hosting- ja ylläpitopaketit: Basic ja Pro Business.",
      },
    ],
  }),
  component: YllapitoPage,
});

function YllapitoPage() {
  const t = useMessages();
  const h = t.hosting;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={h.meta.title}
        description={h.meta.description}
        ogTitle={h.meta.ogTitle}
        ogDescription={h.meta.ogDescription}
      />
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-[#432f24] text-white">
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
          <div className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-xl lg:pl-6 xl:pl-10">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[3.35rem]">
              {h.hero.titleBefore}
              <span className="font-serif italic text-accent">{h.hero.titleAccent}</span>
              {h.hero.titleAfter}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-white/80 sm:text-base">
              {h.hero.description}
            </p>
            <ul className="mt-7 space-y-2.5 text-sm text-white/90 sm:text-[0.95rem]">
              {h.hero.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/yhteys"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-accent-foreground transition-opacity hover:opacity-90"
            >
              {h.hero.askCta}
            </Link>
          </div>
        </div>
      </section>

      <MarketingBand className="!bg-white">
        <ProductPackageCards
          embedded
          sectionId="hosting-paketit"
          title={h.packagesTitle}
          explore={h.explore}
          popular={h.popular}
          requestQuote={h.requestQuote}
          closeLabel={t.widget.sales.closeLabel}
          packages={h.packages.map((pkg) => ({
            ...pkg,
            deviceLayout: true,
            deviceMode: "hosting-logos" as const,
          }))}
          footnote={h.footnote}
        />
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}
