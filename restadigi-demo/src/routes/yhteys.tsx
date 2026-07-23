import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroYhteys from "@/assets/hero-yhteys.jpg";
import { MarketingBand, MarketingBox, MarketingHeading } from "@/components/marketing-band";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHero } from "@/components/page-hero";
import { PageMeta } from "@/components/page-meta";
import { useMessages } from "@/i18n";
import { CONTACT_EMAIL } from "@/lib/company-contact";

export const Route = createFileRoute("/yhteys")({
  head: () => ({
    meta: [
      { title: "Ota yhteyttä — Restadigi" },
      {
        name: "description",
        content: `Kerro projektistasi, palaamme asiaan yhden arkipäivän kuluessa. ${CONTACT_EMAIL}`,
      },
      { property: "og:title", content: "Ota yhteyttä — Restadigi" },
      {
        property: "og:description",
        content: "Kerro projektistasi — palaamme asiaan yhden arkipäivän kuluessa.",
      },
    ],
  }),
  component: YhteysPage,
});

function YhteysPage() {
  const t = useMessages();
  const c = t.contact;
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const company = String(data.get("company") ?? "");
    const email = String(data.get("email") ?? "");
    const budget = String(data.get("budget") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(c.form.mailSubject.replace("{name}", name));
    const body = encodeURIComponent(
      c.form.mailBody
        .replace("{name}", name)
        .replace("{company}", company)
        .replace("{email}", email)
        .replace("{budget}", budget)
        .replace("{message}", message),
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <PageMeta
        title={c.meta.title}
        description={c.meta.description}
        ogTitle={c.meta.ogTitle}
        ogDescription={c.meta.ogDescription}
      />
      <SiteHeader />

      <PageHero
        image={heroYhteys}
        title={
          <>
            {c.hero.titleBefore}
            <span className="font-serif italic text-accent">{c.hero.titleAccent}</span>
            {c.hero.titleAfter}
          </>
        }
        description={c.hero.description}
      />

      <MarketingBand>
        <MarketingHeading>
          {c.hero.titleBefore}
          {c.hero.titleAccent}
          {c.hero.titleAfter}
        </MarketingHeading>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12">
          <MarketingBox
            tone="dark"
            justify="start"
            className="lg:col-span-4 min-h-[22rem] space-y-0"
          >
            <div className="space-y-7">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {c.labels.person}
                </div>
                <p className="text-lg font-medium">{c.person}</p>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {c.labels.email}
                </div>
                <a
                  href={`mailto:${c.email}`}
                  className="text-lg font-medium transition-colors hover:text-accent"
                >
                  {c.email}
                </a>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {c.labels.phone}
                </div>
                <a
                  href={`tel:${c.phoneTel}`}
                  className="text-lg font-medium transition-colors hover:text-accent"
                >
                  {c.phoneDisplay}
                </a>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {c.labels.whatsapp}
                </div>
                <a
                  href={`https://wa.me/${c.phoneTel.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium transition-colors hover:text-accent"
                >
                  {c.whatsappDisplay}
                </a>
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {c.labels.studio}
                </div>
                <p className="text-base text-white/75">
                  {c.studioLine2}
                  <br />
                  {c.studioLine1}
                </p>
              </div>
            </div>
          </MarketingBox>

          <MarketingBox tone="white" justify="start" className="lg:col-span-8 min-h-[22rem]">
            <form id="yhteys-lomake" onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={c.form.name} name="name" required />
                <Field label={c.form.company} name="company" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label={c.form.email} name="email" type="email" required />
                <SelectField
                  label={c.form.budget}
                  name="budget"
                  placeholder={c.form.selectPlaceholder}
                  options={c.form.budgetOptions}
                />
              </div>
              <div>
                <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-foreground/45">
                  {c.form.message}
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder={c.form.messagePlaceholder}
                  className="w-full resize-none border-b border-foreground/20 bg-transparent py-3 text-base outline-none transition-colors focus:border-foreground"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-accent-foreground transition-opacity hover:opacity-90"
                >
                  {c.form.submit}
                </button>
                {sent && <span className="text-sm text-foreground/60">{c.form.sending}</span>}
              </div>
            </form>
          </MarketingBox>
        </div>
      </MarketingBand>

      <section className="bg-background">
        <SiteFooter />
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-foreground/45">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border-b border-foreground/20 bg-transparent py-3 text-base outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-foreground/45">
        {label}
      </label>
      <select
        name={name}
        defaultValue=""
        className="w-full border-b border-foreground/20 bg-transparent py-3 text-base outline-none transition-colors focus:border-foreground"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
