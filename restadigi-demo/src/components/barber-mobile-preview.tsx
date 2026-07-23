import { useMessages } from "@/i18n";

/** Mini-mock: kahvilan / parturin verkkosivu puhelimen näytöllä */
export function BarberMobilePreview({ image }: { image: string }) {
  const { home } = useMessages();
  const b = home.barberPreview;
  const brandMark = b.brand.trim().charAt(0).toUpperCase() || "F";

  return (
    <div
      className="relative flex size-full flex-col overflow-hidden bg-[#f7f3ee] text-[#1a1512]"
      aria-hidden
    >
      {/* Yläpalkki */}
      <div className="relative z-[1] flex shrink-0 items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-1">
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#1a1512] text-[0.45rem] font-serif italic text-[#f7f3ee]">
            {brandMark}
          </span>
          <span className="text-[0.52rem] font-semibold tracking-tight">{b.brand}</span>
        </div>
        <span className="text-[0.34rem] font-semibold uppercase tracking-[0.14em] text-[#1a1512]/45">
          {b.menu}
        </span>
      </div>

      {/* Hero-kuva + teksti */}
      <div className="relative z-[1] mx-1.5 min-h-0 flex-1 overflow-hidden rounded-[0.55rem]">
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,14,0.15) 0%, transparent 35%, rgba(26,18,14,0.82) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 px-2 pb-2.5 pt-8">
          <p className="text-[0.34rem] font-semibold uppercase tracking-[0.2em] text-[#c9a882]">
            {b.tagline}
          </p>
          <p className="mt-0.5 font-serif text-[0.95rem] italic leading-[1.02] text-white">
            {b.headline}
          </p>
          <span className="mt-2 inline-flex rounded-full bg-[#c9a882] px-2.5 py-1 text-[0.38rem] font-bold uppercase tracking-[0.1em] text-[#1a1512]">
            {b.bookCta}
          </span>
        </div>
      </div>

      {/* Palvelut — tiivis rivistö */}
      <div className="relative z-[1] flex shrink-0 flex-col gap-0.5 px-2 py-1.5">
        {b.services.map((service) => (
          <div key={service} className="flex items-center justify-between py-0.5">
            <span className="text-[0.46rem] font-medium tracking-tight text-[#1a1512]/85">
              {service}
            </span>
            <span className="text-[0.34rem] font-semibold uppercase tracking-[0.12em] text-[#1a1512]/40">
              {b.bookShort}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
