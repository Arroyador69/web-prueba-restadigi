import type { ReactNode } from "react";

type MarketingBandProps = {
  children: ReactNode;
  className?: string;
};

/** Vaaleanruskea sisältökaista heron alla (etusivun boksirakenne). */
export function MarketingBand({ children, className = "" }: MarketingBandProps) {
  return (
    <section className={"bg-[#ebe8e2] text-foreground pt-10 sm:pt-14 pb-14 sm:pb-20 " + className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function MarketingHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={
        "max-w-[16ch] text-[2.35rem] sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[0.98] tracking-tight mb-8 sm:mb-10 " +
        className
      }
    >
      {children}
    </h2>
  );
}

type MarketingBoxTone = "dark" | "white" | "photo";

type MarketingBoxProps = {
  children: ReactNode;
  tone?: MarketingBoxTone;
  image?: string;
  className?: string;
  /** Sisällön pystysuuntainen sijoittelu */
  justify?: "start" | "center" | "end";
  /** Tekstin vaakasuuntainen kohdistus */
  align?: "left" | "center";
};

const justifyClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
} as const;

const alignClass = {
  left: "items-start text-left",
  center: "items-center text-center",
} as const;

/** Pyöristetty sisältöboksi — dark / white / photo. */
export function MarketingBox({
  children,
  tone = "white",
  image,
  className = "",
  justify = "end",
  align = "left",
}: MarketingBoxProps) {
  const base =
    "relative isolate overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] flex flex-col p-6 sm:p-8 " +
    justifyClass[justify] +
    " " +
    alignClass[align];

  if (tone === "photo" && image) {
    return (
      <article className={base + " min-h-[18rem] text-white " + className}>
        <img src={image} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20"
          aria-hidden
        />
        <div className="relative z-[1] w-full">{children}</div>
      </article>
    );
  }

  if (tone === "dark") {
    return (
      <article className={base + " min-h-[16rem] bg-[#432f24] text-white " + className}>
        <div className="relative z-[1] w-full">{children}</div>
      </article>
    );
  }

  return (
    <article className={base + " min-h-[16rem] bg-white text-foreground " + className}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(#432f24 1px, transparent 1px), linear-gradient(90deg, #432f24 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div className="relative z-[1] w-full">{children}</div>
    </article>
  );
}

export function MarketingCtaBox({
  title,
  children,
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <MarketingBox
      tone="dark"
      justify="center"
      align="center"
      className={"min-h-[16rem] sm:min-h-[18rem] px-8 py-12 sm:px-12 " + className}
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-balance max-w-[18ch] mx-auto">
        {title}
      </h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
    </MarketingBox>
  );
}
