import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  Clock,
  Database,
  KeyRound,
  LineChart,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import heroAiChat from "@/assets/hero-ai-chat-service.jpg";
import { openSalesChatbot } from "@/components/chatbot-widget";
import { DashboardMonitorPreview } from "@/components/dashboard-monitor-preview";
import {
  MarketingBand,
  MarketingBox,
  MarketingCtaBox,
  MarketingHeading,
} from "@/components/marketing-band";
import { ServiceSplitHero } from "@/components/service-split-hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageMeta } from "@/components/page-meta";
import { useMessages } from "@/i18n";

export const Route = createFileRoute("/ai-asiakaspalvelu")({
  head: () => ({
    meta: [
      { title: "AI-asiakaspalvelu — Restadigi" },
      {
        name: "description",
        content:
          "Älykäs chatbot verkkosivustollesi — palvelee asiakkaita 24/7, vastaa kysymyksiin, kerää liidejä ja vapauttaa henkilökunnan.",
      },
      { property: "og:title", content: "AI-asiakaspalvelu — Restadigi" },
      {
        property: "og:description",
        content: "Chatbot verkkosivuille — ympärivuorokautinen myynti ja asiakaspalvelu.",
      },
    ],
  }),
  component: ChatbotPage,
});

const FEATURE_ICONS: LucideIcon[] = [
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Database,
  LineChart,
  KeyRound,
];

function ChatbotPage() {
  const t = useMessages();
  const cb = t.chatbot;
  const bot = cb.chatbot;
  const featureBoxes = [...bot.benefits, ...bot.monthly];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={cb.meta.title}
        description={cb.meta.description}
        ogTitle={cb.meta.ogTitle}
        ogDescription={cb.meta.ogDescription}
      />
      <SiteHeader />

      <ServiceSplitHero
        image={heroAiChat}
        imageClassName="object-[center_28%] sm:object-[center_35%]"
        icon={Bot}
        overlayTitle={
          <>
            {cb.hero.titleBefore}
            <span className="font-serif italic text-accent">{cb.hero.titleAccent}</span>
            {cb.hero.titleAfter}
          </>
        }
        overlayDescription={cb.hero.description}
        headlineLine1={cb.hero.headlineLine1}
        headlineLine2={cb.hero.headlineLine2}
        subtitle={cb.hero.subtitle}
        actions={
          <button
            type="button"
            onClick={() => openSalesChatbot()}
            className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
          >
            {cb.hero.cta}
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
              />
            </svg>
          </button>
        }
      />

      <MarketingBand>
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <MarketingBox tone="dark" justify="start" className="min-h-[22rem]">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">{bot.eyebrow}</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.15rem]">
              {bot.titleBefore}
              {bot.titleAccent}
              {bot.titleAfter}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">{bot.intro}</p>
            <p className="mt-6 text-sm leading-relaxed text-white/75">{cb.hero.description}</p>
          </MarketingBox>

          <MarketingBox
            tone="white"
            justify="center"
            align="center"
            className="min-h-[22rem] !p-4 sm:!p-6"
          >
            <DashboardMonitorPreview />
          </MarketingBox>
        </div>

        <MarketingHeading className="mt-14 sm:mt-16">
          {bot.safeTitleBefore}
          {bot.safeTitleAccent}
          {bot.safeTitleAfter}
        </MarketingHeading>

        <MarketingBox
          tone="white"
          justify="start"
          className="mb-4 min-h-[10rem] sm:mb-5 sm:min-h-[11rem]"
        >
          <p className="text-base leading-relaxed text-foreground/75 sm:text-lg sm:leading-[1.65]">
            {bot.safeBody}
          </p>
        </MarketingBox>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {featureBoxes.map((item, i) => {
            const Icon = FEATURE_ICONS[i] ?? Sparkles;
            return (
              <MarketingBox key={item.title} tone="white" justify="start" className="min-h-[14rem]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#432f24] text-white">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/65">{item.body}</p>
              </MarketingBox>
            );
          })}
        </div>

        <MarketingCtaBox
          className="mt-4 sm:mt-5"
          title={
            <>
              {cb.cta.titleBefore}
              {cb.cta.titleAccent}
            </>
          }
        >
          <div className="flex w-full max-w-2xl flex-col items-center gap-6">
            <p className="text-sm leading-relaxed text-white/80 sm:text-base">{cb.cta.body}</p>
            <ul className="w-full space-y-2 text-left text-sm text-white/75">
              {cb.cta.questions.map((q) => (
                <li key={q} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {q}
                </li>
              ))}
            </ul>
            <p className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
              <span className="text-3xl font-extrabold tracking-tight text-accent sm:text-4xl">
                {cb.cta.price}
              </span>
              <span className="text-sm text-white/55">{cb.cta.priceNote}</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/yhteys"
                className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-accent-foreground transition-opacity hover:opacity-90"
              >
                {cb.cta.button}
              </Link>
              <button
                type="button"
                onClick={() => openSalesChatbot()}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-black transition-opacity hover:opacity-90"
              >
                <Bot className="size-4" strokeWidth={2} />
                {cb.hero.cta}
              </button>
            </div>
          </div>
        </MarketingCtaBox>
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}
