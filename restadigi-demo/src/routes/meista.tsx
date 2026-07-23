import { createFileRoute, Link } from "@tanstack/react-router";
import restaurantKitchen from "@/assets/restaurant-kitchen.jpg";
import {
  MarketingBand,
  MarketingBox,
  MarketingCtaBox,
  MarketingHeading,
} from "@/components/marketing-band";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMeta } from "@/components/page-meta";
import { useMessages } from "@/i18n";

export const Route = createFileRoute("/meista")({
  head: () => ({
    meta: [
      { title: "Meistä — Restadigi" },
      {
        name: "description",
        content:
          "Restadigi on pieni studio, joka rakentaa kotisivuja ja vahvistaa yritysten diginäkyvyyttä. Tutustu tapaamme tehdä työtä.",
      },
      { property: "og:title", content: "Meistä — Restadigi" },
      {
        property: "og:description",
        content:
          "Pieni studio, iso vastuu. Kotisivuja ja diginäkyvyyttä suomalaisille yrityksille.",
      },
      { property: "og:image", content: restaurantKitchen },
    ],
  }),
  component: MeistaPage,
});

function MeistaPage() {
  const t = useMessages();
  const a = t.about;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={a.meta.title}
        description={a.meta.description}
        ogTitle={a.meta.ogTitle}
        ogDescription={a.meta.ogDescription}
      />
      <SiteHeader />

      <header className="pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-xs uppercase tracking-[0.2em] text-accent">{a.eyebrow}</div>
          <h1 className="mb-8 max-w-[16ch] text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-6xl">
            {a.titleBefore}
            <span className="font-serif italic text-accent">{a.titleAccent}</span>
            {a.titleAfter}
          </h1>
          <div className="grid gap-8 md:grid-cols-12">
            <p className="text-base leading-relaxed text-foreground/70 sm:text-lg md:col-span-7">
              {a.lead}
            </p>
            <p className="text-base leading-relaxed text-foreground/60 md:col-span-5">
              {a.secondary}
            </p>
          </div>
        </div>
      </header>

      <section className="px-6 pb-10 sm:pb-14">
        <div className="mx-auto max-w-6xl">
          <img
            src={restaurantKitchen}
            alt={a.imageAlt}
            width={1600}
            height={900}
            className="aspect-[16/9] w-full rounded-sm object-cover"
          />
        </div>
      </section>

      <MarketingBand>
        <MarketingHeading>
          {a.process.titleBefore}
          {a.process.titleAccent}
          {a.process.titleAfter}
        </MarketingHeading>

        <div className="mb-4 grid gap-4 sm:mb-5 sm:grid-cols-3 sm:gap-5">
          {a.values.map((v) => (
            <MarketingBox key={v.titleAccent + v.titleRest} tone="white" justify="start">
              <h3 className="mb-3 text-xl font-bold tracking-tight">
                {v.titleAccent} {v.titleRest}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/65">{v.body}</p>
            </MarketingBox>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {a.process.steps.map((s) => (
            <MarketingBox key={s.n} tone="dark" justify="start">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {s.n}
              </span>
              <h3 className="mb-2 text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/80">{s.body}</p>
            </MarketingBox>
          ))}
        </div>

        <MarketingCtaBox
          className="mt-4 sm:mt-5"
          title={
            <>
              {a.cta.titleBefore}
              {a.cta.titleAccent}
              {a.cta.titleAfter}
            </>
          }
        >
          <Link
            to="/yhteys"
            className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-accent-foreground transition-opacity hover:opacity-90"
          >
            {a.cta.button}
          </Link>
        </MarketingCtaBox>
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}
