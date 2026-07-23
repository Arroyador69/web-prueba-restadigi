import { useMessages } from "@/i18n";

type SiteFooterProps = {
  /** When set to primary, footer blends into a primary-colored page end. */
  tone?: "default" | "primary";
};

export function SiteFooter({ tone = "default" }: SiteFooterProps) {
  const t = useMessages();
  const onPrimary = tone === "primary";
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace("{year}", String(year));
  const c = t.header.contactPanel;

  const muted = onPrimary ? "text-primary-foreground/55" : "text-muted-foreground";
  const strong = onPrimary ? "text-primary-foreground/85" : "text-foreground/80";
  const linkHover = onPrimary ? "hover:text-primary-foreground" : "hover:text-foreground";

  return (
    <footer
      className={
        onPrimary ? "py-12 border-t border-primary-foreground/15" : "py-12 border-t border-border"
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className={"space-y-1.5 text-sm " + muted}>
          <p className={"font-medium " + strong}>{c.company}</p>
          <p>{c.person}</p>
          <p>{c.address}</p>
          <p>
            <span className="sr-only">{c.emailLabel}: </span>
            <a
              href={`mailto:${c.email}`}
              className={"underline underline-offset-2 transition-colors " + linkHover}
            >
              {c.email}
            </a>
          </p>
          <p>
            <span className="sr-only">{c.phoneLabel}: </span>
            <a
              href={`tel:${c.phoneTel}`}
              className={"underline underline-offset-2 transition-colors " + linkHover}
            >
              {c.phoneDisplay}
            </a>
          </p>
          <p>
            <span className="sr-only">{c.whatsappLabel}: </span>
            <a
              href={`https://wa.me/${c.phoneTel.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={"underline underline-offset-2 transition-colors " + linkHover}
            >
              {c.whatsappLabel}: {c.whatsappDisplay}
            </a>
          </p>
        </div>
        <p className={"text-sm " + muted}>{copyright}</p>
      </div>
    </footer>
  );
}
