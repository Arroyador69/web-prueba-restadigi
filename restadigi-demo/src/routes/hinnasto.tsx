import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingBand, MarketingBox } from "@/components/marketing-band";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMeta } from "@/components/page-meta";
import { useMessages } from "@/i18n";
import laskuttamoLogo from "@/assets/laskuttamo-logo-white.png";

export const Route = createFileRoute("/hinnasto")({
  head: () => ({
    meta: [
      { title: "Hinnasto — Restadigi" },
      {
        name: "description",
        content:
          "Restadigin palveluiden hinnasto: verkkosivut, diginäkyvyys, graafinen suunnittelu ja hosting.",
      },
      { property: "og:title", content: "Hinnasto — Restadigi" },
      {
        property: "og:description",
        content:
          "Selkeät pakettihinnat verkkosivuille, näkyvyydelle, graafiselle suunnittelulle ja hostingille.",
      },
    ],
  }),
  component: HinnastoPage,
});

type PriceRow = {
  name: string;
  price: string;
  note?: string;
};

function HinnastoPage() {
  const t = useMessages();
  const p = t.pricing;
  const b = t.visibility.branding.billing;

  const websiteRows: PriceRow[] = t.websites.packages.map((pkg) => ({
    name: pkg.name,
    price: pkg.price,
    note: pkg.tagline,
  }));

  const visibilityRows: PriceRow[] = t.visibility.packages.slice(0, 3).map((pkg) => ({
    name: pkg.name,
    price: pkg.price,
    note: pkg.tagline,
  }));

  const brandingRows: PriceRow[] = t.visibility.branding.products.map((pkg) => ({
    name: pkg.name,
    price: pkg.price,
    note: pkg.description,
  }));

  const hostingRows: PriceRow[] = t.hosting.packages.map((pkg) => ({
    name: pkg.name,
    price: pkg.price,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={p.meta.title}
        description={p.meta.description}
        ogTitle={p.meta.ogTitle}
        ogDescription={p.meta.ogDescription}
      />
      <SiteHeader />

      <header className="pt-10 pb-12 sm:pt-16 sm:pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-xs uppercase tracking-[0.2em] text-accent">{p.eyebrow}</div>
          <h1 className="mb-6 max-w-[18ch] text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-6xl">
            {p.titleBefore}
            <span className="font-serif italic text-accent">{p.titleAccent}</span>
            {p.titleAfter}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
            {p.lead}
          </p>
          <p className="mt-4 text-sm text-foreground/50">{p.vatNote}</p>
        </div>
      </header>

      <MarketingBand className="!bg-white pt-0">
        <PriceSection
          title={p.sections.websites}
          href="/verkkosivut"
          seeMore={p.seeMore}
          rows={websiteRows}
        />
        <PriceSection
          title={p.sections.visibility}
          href="/nakyvyys-ja-suunnittelu"
          seeMore={p.seeMore}
          rows={visibilityRows}
        />
        <PriceSection
          title={p.sections.branding}
          href="/nakyvyys-ja-suunnittelu"
          seeMore={p.seeMore}
          rows={brandingRows}
        />
        <PriceSection
          title={p.sections.hosting}
          href="/yllapito"
          seeMore={p.seeMore}
          rows={hostingRows}
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-2">
          <MarketingBox tone="dark" justify="start" className="min-h-0">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{b.title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {b.intro}
            </p>
            <div className="mt-8 space-y-3 border-t border-white/15 pt-6 text-sm text-white/85 sm:text-base">
              <p>{b.providerLead}</p>
              <a
                href={b.providerSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1"
                aria-label={b.providerName}
              >
                <img
                  src={laskuttamoLogo}
                  alt={b.providerName}
                  className="h-7 w-auto sm:h-8"
                  width={180}
                  height={32}
                />
              </a>
              <p>
                <a
                  href={`mailto:${b.providerEmail}`}
                  className="underline underline-offset-2 hover:text-white"
                >
                  {b.providerEmail}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${b.providerPhone.replace(/\s/g, "")}`}
                  className="underline underline-offset-2 hover:text-white"
                >
                  {b.providerPhone}
                </a>
                <span className="text-white/55"> · {b.providerHours}</span>
              </p>
              <p>
                <a
                  href={b.providerSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white"
                >
                  {b.providerSiteLabel}
                </a>
              </p>
              <p className="text-white/60">{b.providerAddressNote}</p>
            </div>
          </MarketingBox>

          <MarketingBox tone="white" justify="start" className="min-h-0">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-foreground/45">
              {b.groundsTitle}
            </p>
            <div className="max-w-3xl space-y-4">
              {b.groundsBody.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-foreground/70 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </MarketingBox>
        </div>
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}

function PriceSection({
  title,
  href,
  seeMore,
  rows,
}: {
  title: string;
  href: "/verkkosivut" | "/nakyvyys-ja-suunnittelu" | "/yllapito";
  seeMore: string;
  rows: PriceRow[];
}) {
  return (
    <section className="mb-10 border-b border-border/70 pb-10 last:mb-0 last:border-0 last:pb-0 sm:mb-12 sm:pb-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <Link
          to={href}
          className="text-sm font-semibold uppercase tracking-[0.08em] text-accent underline-offset-4 hover:underline"
        >
          {seeMore}
        </Link>
      </div>
      <ul className="divide-y divide-border/80">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
          >
            <div className="min-w-0">
              <div className="text-base font-medium tracking-tight text-foreground sm:text-lg">
                {row.name}
              </div>
              {row.note ? (
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-foreground/55">
                  {row.note}
                </p>
              ) : null}
            </div>
            <div className="shrink-0 text-base font-bold tracking-tight text-foreground sm:text-right sm:text-lg">
              {row.price}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
