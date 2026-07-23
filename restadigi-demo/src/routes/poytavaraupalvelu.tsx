import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, CalendarDays, Clock3, LayoutGrid, Link2 } from "lucide-react";
import heroBooking from "@/assets/hero-booking-tables.jpg";
import { BookingChatbotButton } from "@/components/chatbot-widget";
import { FloorPlanDevicePreviews } from "@/components/floor-plan-device-previews";
import { ReservationsDevicePreviews } from "@/components/reservations-device-previews";
import { ServiceSplitHero } from "@/components/service-split-hero";
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

const FEATURE_ICONS = [Clock3, BellRing, LayoutGrid, Link2] as const;

export const Route = createFileRoute("/poytavaraupalvelu")({
  head: () => ({
    meta: [
      { title: "Pöytävarauspalvelu — Restadigi" },
      {
        name: "description",
        content:
          "Moderni pöytävarauspalvelu ravintoloille — asiakkaat varaavat pöydän suoraan verkkosivuiltasi ympäri vuorokauden.",
      },
      { property: "og:title", content: "Pöytävarauspalvelu — Restadigi" },
      {
        property: "og:description",
        content: "Sujuvat pöytävaraukset suoraan ravintolasi verkkosivuilta.",
      },
    ],
  }),
  component: PotyvarausPage,
});

function PotyvarausPage() {
  const t = useMessages();
  const b = t.booking;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={b.meta.title}
        description={b.meta.description}
        ogTitle={b.meta.ogTitle}
        ogDescription={b.meta.ogDescription}
      />
      <SiteHeader />

      <ServiceSplitHero
        image={heroBooking}
        imageClassName="object-[center_58%] sm:object-center"
        icon={CalendarDays}
        overlayTitle={
          <>
            <span className="font-serif italic text-accent">{b.hero.titleAccent}</span>
            {b.hero.titleAfter}
          </>
        }
        overlayDescription={b.hero.description}
        headlineLine1={b.hero.headlineLine1}
        headlineLine2={b.hero.headlineLine2}
        subtitle={b.hero.subtitle}
        actions={<BookingChatbotButton />}
      />

      <MarketingBand>
        <MarketingHeading>
          {b.dashboard.titleBefore}
          {b.dashboard.titleAccent}
          {b.dashboard.titleAfter}
        </MarketingHeading>

        <MarketingBox tone="white" justify="start" className="mb-4 sm:mb-5">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">
            {b.dashboard.eyebrow}
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-foreground/70 sm:text-base">
            {b.dashboard.body}
          </p>
          <div className="mt-8">
            <ReservationsDevicePreviews />
          </div>
        </MarketingBox>

        <MarketingHeading className="mt-10 sm:mt-12">
          {b.floorPlan.titleBefore}
          {b.floorPlan.titleAccent}
          {b.floorPlan.titleAfter}
        </MarketingHeading>

        <MarketingBox tone="dark" justify="start" className="mb-4 sm:mb-5">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent">
            {b.floorPlan.eyebrow}
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            {b.floorPlan.body}
          </p>
          <div className="mt-8">
            <FloorPlanDevicePreviews />
          </div>
        </MarketingBox>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {b.features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i] ?? Clock3;
            return (
              <MarketingBox
                key={feature.title}
                tone="white"
                justify="start"
                className="min-h-[14rem]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#432f24] text-white">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/65">{feature.body}</p>
              </MarketingBox>
            );
          })}
        </div>

        <MarketingCtaBox
          className="mt-4 sm:mt-5"
          title={
            <>
              {b.cta.titleBefore}
              {b.cta.titleAccent}
              {b.cta.titleAfter}
            </>
          }
        >
          <p className="mb-2 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
            <span className="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
              {b.cta.price}
            </span>
            <span className="text-sm text-white/55">{b.cta.priceNote}</span>
          </p>
          <Link
            to="/yhteys"
            className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-accent-foreground transition-opacity hover:opacity-90"
          >
            {b.cta.button}
          </Link>
        </MarketingCtaBox>
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}
