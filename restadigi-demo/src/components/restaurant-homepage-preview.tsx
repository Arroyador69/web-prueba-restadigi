import erikoismenut from "@/assets/mock-erikoismenut.jpg";
import tapahtumat from "@/assets/mock-tapahtumat.jpg";
import ryhmille from "@/assets/mock-ryhmille.jpg";
import { useMessages } from "@/i18n";

function GoldFlourish({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 12" fill="none" aria-hidden>
      <path d="M2 6h38M80 6h38" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M52 6c4-5 8-5 12 0c-4 5-8 5-12 0Z" fill="currentColor" opacity="0.9" />
      <circle cx="46" cy="6" r="1.2" fill="currentColor" />
      <circle cx="74" cy="6" r="1.2" fill="currentColor" />
    </svg>
  );
}

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M4 24V10c0-4 2-6 6-6h14"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M8 24V14c0-2.5 1.2-4 4-4h12"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.55"
        strokeLinecap="round"
      />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Mini-mock: ravintolan / kahvilan verkkosivun etusivu — editorial + ornamenttigrafiikka */
export function RestaurantHomepagePreview({
  image,
  brand = "Atelier",
  tileImages,
}: {
  image: string;
  brand?: string;
  tileImages?: [string, string, string];
}) {
  const { home } = useMessages();
  const p = home.sitePreview;
  const brandMark = brand.trim().charAt(0).toUpperCase() || "A";

  const tiles = [
    {
      label: p.tileSpecialMenus,
      image: tileImages?.[0] ?? erikoismenut,
      position: "center 45%",
      n: "01",
    },
    {
      label: p.tileEvents,
      image: tileImages?.[1] ?? tapahtumat,
      position: "center 40%",
      n: "02",
    },
    {
      label: p.tileGroups,
      image: tileImages?.[2] ?? ryhmille,
      position: "center 45%",
      n: "03",
    },
  ] as const;

  return (
    <div className="relative flex size-full flex-col overflow-hidden bg-[#f3eee8]" aria-hidden>
      {/* Hieno pistekuvio */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(67,47,36,0.2) 1px, transparent 0)",
          backgroundSize: "9px 9px",
        }}
      />

      {/* Kultaiset kulmaornamentit */}
      <CornerOrnament className="pointer-events-none absolute left-1 top-1 z-[3] size-5 text-[#c9a882]/80 sm:size-6" />
      <CornerOrnament className="pointer-events-none absolute right-1 top-1 z-[3] size-5 rotate-90 text-[#c9a882]/80 sm:size-6" />
      <CornerOrnament className="pointer-events-none absolute bottom-1 left-1 z-[3] size-5 -rotate-90 text-[#c9a882]/70 sm:size-6" />
      <CornerOrnament className="pointer-events-none absolute bottom-1 right-1 z-[3] size-5 rotate-180 text-[#c9a882]/70 sm:size-6" />

      {/* Sisempi kultakehys */}
      <div className="pointer-events-none absolute inset-[5px] z-[2] rounded-[0.35rem] border border-[#c9a882]/35 sm:inset-[6px]" />
      <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[0.25rem] border border-[#432f24]/08 sm:inset-[8px]" />

      {/* Yläpalkki */}
      <div className="relative z-[1] mx-[7px] mt-[7px] flex shrink-0 items-center justify-between gap-2 border-b border-[#432f24]/12 bg-[#f7f3ee]/92 px-2 py-1.5 sm:mx-[8px] sm:mt-[8px] sm:px-2.5 sm:py-2">
        <div className="flex items-center gap-1.5">
          <span className="relative inline-flex size-5 items-center justify-center sm:size-6">
            <span className="absolute inset-0 rounded-full border border-[#c9a882]/70" />
            <span className="absolute inset-[2px] rounded-full border border-[#432f24]/25" />
            <span className="relative font-serif text-[0.55rem] italic leading-none text-[#432f24] sm:text-[0.62rem]">
              {brandMark}
            </span>
          </span>
          <span className="font-serif text-[0.7rem] italic leading-none tracking-tight text-[#432f24] sm:text-[0.8rem]">
            {brand}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[0.4rem] font-semibold uppercase tracking-[0.14em] text-[#432f24]/50 sm:gap-1.5 sm:text-[0.46rem]">
          <span>{p.navMenu}</span>
          <span className="inline-block size-0.5 rounded-full bg-[#c9a882]" />
          <span>{p.navHours}</span>
          <span className="inline-block size-0.5 rounded-full bg-[#c9a882]" />
          <span>{p.navContact}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative z-[1] mx-[7px] min-h-0 flex-1 overflow-hidden sm:mx-[8px]">
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full scale-[1.05] object-cover object-[center_32%]"
        />

        {/* Kaarimainen vignetti ylhäällä */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(26,18,14,0.55) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, rgba(26,18,14,0.45) 0%, transparent 38%, transparent 52%, rgba(26,18,14,0.88) 100%)",
          }}
        />

        {/* Vino kultaviiva */}
        <div className="pointer-events-none absolute -right-8 top-0 h-[140%] w-10 origin-top-right rotate-[18deg] bg-gradient-to-l from-[#c9a882]/40 via-[#c9a882]/12 to-transparent" />

        {/* Kelluva badge */}
        <div className="absolute right-2 top-2 rotate-[8deg] rounded-full border border-[#c9a882]/60 bg-[#432f24]/85 px-2 py-1 shadow-sm backdrop-blur-[2px] sm:right-2.5 sm:top-2.5">
          <p className="text-[0.38rem] font-bold uppercase tracking-[0.18em] text-[#c9a882] sm:text-[0.42rem]">
            {p.openBadge}
          </p>
        </div>

        {/* Pieni tähden/vinoneliön kuvio */}
        <svg
          className="pointer-events-none absolute left-2.5 top-3 size-3 text-[#c9a882]/80 sm:left-3 sm:top-3.5 sm:size-3.5"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 0l1.2 5.3L14.5 8l-5.3 1.2L8 14.5 6.8 9.2 1.5 8l5.3-1.2L8 0z" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start px-2.5 pb-3 pt-10 text-left sm:px-3 sm:pb-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="h-px w-3 bg-[#c9a882]" />
            <span className="text-[0.4rem] uppercase tracking-[0.26em] text-[#c9a882] sm:text-[0.45rem]">
              {p.tagline}
            </span>
          </div>

          <p className="font-serif text-[1.4rem] italic leading-[0.95] text-white sm:text-[1.6rem]">
            {brand}
          </p>

          <GoldFlourish className="mt-1.5 w-[4.5rem] text-[#c9a882] sm:mt-2 sm:w-[5.25rem]" />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-3">
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#c9a882] px-2.5 py-1.5 text-[0.46rem] font-bold uppercase tracking-[0.1em] text-[#2a1f18] sm:text-[0.5rem]">
              <span className="size-1 rounded-full bg-[#2a1f18]/35" />
              {p.bookTable}
            </span>
            <span className="inline-flex rounded-sm border border-white/50 bg-white/5 px-2.5 py-1.5 text-[0.46rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-[1px] sm:text-[0.5rem]">
              {p.customerService}
            </span>
          </div>
        </div>
      </div>

      {/* Alarivi */}
      <div className="relative z-[1] mx-[7px] mb-[7px] mt-1 grid shrink-0 grid-cols-3 gap-1 bg-transparent sm:mx-[8px] sm:mb-[8px] sm:mt-1.5 sm:gap-1.5">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="relative flex aspect-[5/4] flex-col overflow-hidden rounded-[0.3rem] ring-1 ring-[#c9a882]/25"
          >
            <img
              src={tile.image}
              alt=""
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: tile.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a120e]/85 via-[#1a120e]/25 to-[#1a120e]/10" />
            {/* Pieni kultaviiva numeron alla */}
            <div className="absolute left-1 top-1 flex flex-col gap-0.5">
              <span className="font-serif text-[0.52rem] italic leading-none text-[#c9a882] sm:text-[0.58rem]">
                {tile.n}
              </span>
              <span className="h-px w-3 bg-[#c9a882]/70" />
            </div>
            <p className="absolute inset-x-0 bottom-0 px-1 pb-1 text-[0.33rem] font-semibold uppercase leading-tight tracking-[0.08em] text-white sm:text-[0.37rem]">
              {tile.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
