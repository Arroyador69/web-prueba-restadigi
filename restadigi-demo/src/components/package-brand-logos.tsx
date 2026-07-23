/** Compact brand marks for diginäkyvyys package panels (decorative). */

import type { ReactElement } from "react";
import sportHockey from "@/assets/sport-hockey.jpg";
import sportFootball from "@/assets/sport-football.jpg";
import delfinLogo from "@/assets/delfin-checkin-icon.jpg";
import rafaLogo from "@/assets/rafa-romera-logo.png";
import restadigiLogo from "@/assets/restadigi-logo.png";

type MarkProps = { className?: string; title: string };

export function OpenaiMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.774-4.23 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.049zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.787a4.471 4.471 0 0 1-.679 8.048v-5.518a.764.764 0 0 0-.39-.675zm1.28-3.038l-.141-.085-4.775-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.504 4.504 0 0 1 6.68 4.66zm-12.64 4.135l2.02-1.164a.08.08 0 0 1 .038-.052V7.35a.067.067 0 0 1 .033-.063l4.822-2.774.141.081a4.47 4.47 0 0 1 0 7.963l-.141.084-4.778 2.758a.775.775 0 0 0-.785 0l-2.02-1.163a.08.08 0 0 1-.033-.062z"
      />
    </svg>
  );
}

export function ClaudeMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12.8 2.4 14.4 8l5.6 1.2-4.4 3.6 1.6 5.6-4.8-2.8-4.8 2.8 1.6-5.6L4 9.2 9.6 8l1.6-5.6z"
      />
    </svg>
  );
}

export function GeminiMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12 0C8.686 6.857 6.857 8.686 0 12c6.857 3.314 8.686 5.143 12 12 3.314-6.857 5.143-8.686 12-12C17.143 8.686 15.314 6.857 12 0z"
      />
    </svg>
  );
}

export function CopilotMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="currentColor"
        d="M12 2.5c1.2 3.8 3.7 6.3 7.5 7.5-3.8 1.2-6.3 3.7-7.5 7.5-1.2-3.8-3.7-6.3-7.5-7.5 3.8-1.2 6.3-3.7 7.5-7.5z"
      />
      <circle fill="currentColor" cx="5" cy="5" r="1.6" opacity="0.55" />
      <circle fill="currentColor" cx="19" cy="19" r="1.6" opacity="0.55" />
    </svg>
  );
}

export function GoogleMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function GoogleAdsMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path fill="#FBBC04" d="M1.5 20.25 9.75 3.75l4.5 2.25-8.25 16.5H1.5z" />
      <path fill="#4285F4" d="M14.25 3.75 22.5 20.25h-4.5L9.75 3.75h4.5z" />
      <circle fill="#34A853" cx="5.25" cy="18.75" r="3.75" />
    </svg>
  );
}

export function GoogleAnalyticsMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="#E37400"
        d="M22.84 2.998v17.998a2.999 2.999 0 0 1-5.661 1.381L1.162 4.381A3 3 0 0 1 3.999.998h15.843a2.999 2.999 0 0 1 2.998 3z"
      />
      <path
        fill="#F9AB00"
        d="M7.498 12v8.998a3 3 0 1 1-6 0V12a3 3 0 1 1 6 0zm15.342-9.002v17.998a2.999 2.999 0 1 1-5.998 0V2.998a2.999 2.999 0 1 1 5.998 0z"
      />
    </svg>
  );
}

export function GoogleBusinessMark({ className = "", title }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="#4285F4"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      />
    </svg>
  );
}

type LogoItem = {
  name: string;
  Mark: (props: MarkProps) => ReactElement;
  tone?: string;
};

const AI_LOGOS: LogoItem[] = [
  { name: "ChatGPT", Mark: OpenaiMark, tone: "text-[#412524]" },
  { name: "Claude", Mark: ClaudeMark, tone: "text-[#d97757]" },
  { name: "Gemini", Mark: GeminiMark, tone: "text-[#8E75B2]" },
  { name: "Copilot", Mark: CopilotMark, tone: "text-[#0078D4]" },
];

const GOOGLE_LOGOS: LogoItem[] = [
  { name: "Google", Mark: GoogleMark },
  { name: "Google Ads", Mark: GoogleAdsMark },
  { name: "Analytics", Mark: GoogleAnalyticsMark },
  { name: "Business Profile", Mark: GoogleBusinessMark },
];

/** AI + Google package marks in one row — icons only. */
export function VisibilityBrandLogoStrip({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const logos = [...AI_LOGOS, ...GOOGLE_LOGOS];

  return (
    <div
      className={"flex flex-wrap items-center justify-center gap-5 sm:gap-7 " + className}
      aria-hidden
    >
      {logos.map(({ name, Mark, tone }) => (
        <Mark
          key={name}
          title={name}
          className={
            "size-8 sm:size-9 " + (onDark ? "text-[#e8dccf]" : (tone ?? "text-foreground"))
          }
        />
      ))}
    </div>
  );
}

export function PackageBrandLogos({
  kind,
  dark = false,
  logosOnly = false,
}: {
  kind: "ai" | "google";
  dark?: boolean;
  /** Only the 4 marks — no labels, no panel background */
  logosOnly?: boolean;
}) {
  const logos = kind === "ai" ? AI_LOGOS : GOOGLE_LOGOS;

  if (logosOnly) {
    return (
      <div className="flex w-full items-end justify-between gap-2 sm:gap-3" aria-hidden>
        {logos.map(({ name, Mark, tone }) => (
          <div key={name} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <Mark title={name} className={"size-7 sm:size-8 " + (tone ?? "text-foreground")} />
            <span className="w-full truncate text-center text-[9px] leading-tight text-foreground/60 sm:text-[10px]">
              {name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-start md:justify-center" aria-hidden>
      <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-6 sm:gap-y-6">
        {logos.map(({ name, Mark, tone }) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <Mark
              title={name}
              className={
                "size-11 sm:size-12 " +
                (dark ? "text-primary-foreground" : (tone ?? "text-foreground"))
              }
            />
            <span
              className={
                "text-center text-[10px] leading-tight " +
                (dark ? "text-primary-foreground/70" : "text-foreground/55")
              }
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function packageLogoKind(packageName: string): "ai" | "google" | null {
  const n = packageName.toLowerCase();
  if (
    n.includes("ai-optim") ||
    n.includes("ai optim") ||
    n.includes("optimización ia") ||
    n.includes("ai optimisation") ||
    n.includes("ai optimization") ||
    n.startsWith("ai ")
  ) {
    return "ai";
  }
  if (n.includes("google")) return "google";
  return null;
}

export function packageHeaderKind(
  packageName: string,
): "ai" | "google" | "sports" | "brandLogos" | null {
  const logoKind = packageLogoKind(packageName);
  if (logoKind) return logoKind;
  const n = packageName.toLowerCase();
  if (
    n.includes("urheil") ||
    n.includes("sport") ||
    n.includes("deport") ||
    n.includes("élite") ||
    n.includes("elite")
  ) {
    return "sports";
  }
  if (
    n.includes("graafi") ||
    n.includes("graphic") ||
    n.includes("diseño") ||
    n.includes("diseno") ||
    n.includes("branding")
  ) {
    return "brandLogos";
  }
  return null;
}

/** Hockey + football photos for elite sports package header */
export function PackageSportsPhotos({ className = "" }: { className?: string }) {
  return (
    <div className={"grid h-full grid-cols-2 gap-px bg-[#432f24] " + className} aria-hidden>
      <img
        src={sportHockey}
        alt=""
        className="size-full min-h-0 object-cover object-[center_35%]"
      />
      <img
        src={sportFootball}
        alt=""
        className="size-full min-h-0 object-cover object-[center_25%]"
      />
    </div>
  );
}

/** Client / brand logos for graphic design showcase in package headers */
export function PackageBrandWorkLogos({ className = "" }: { className?: string }) {
  const logos = [
    { src: delfinLogo, name: "Delfín", tile: "bg-white" },
    { src: rafaLogo, name: "Rafa Romera", tile: "bg-black" },
    { src: restadigiLogo, name: "Restadigi", tile: "bg-white" },
  ] as const;

  return (
    <div
      className={
        "flex h-full w-full items-center justify-between gap-2 bg-[#f3eee8] px-2.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3 " +
        className
      }
      aria-hidden
    >
      {logos.map((logo) => (
        <div key={logo.name} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div
            className={
              "flex h-12 w-full items-center justify-center overflow-hidden rounded-lg px-1.5 sm:h-14 " +
              logo.tile
            }
          >
            <img src={logo.src} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <span className="w-full truncate text-center text-[9px] leading-tight text-foreground/65 sm:text-[10px]">
            {logo.name}
          </span>
        </div>
      ))}
    </div>
  );
}
