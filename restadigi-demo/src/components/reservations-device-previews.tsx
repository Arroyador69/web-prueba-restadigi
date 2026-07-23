/** Marketing mock: reservations dashboard on desktop monitor + tablet. */

const SAMPLE_DAYS = [
  { d: "14", booked: false },
  { d: "15", booked: true },
  { d: "16", booked: true },
  { d: "17", booked: false },
  { d: "18", booked: true },
  { d: "19", booked: false },
  { d: "20", booked: true },
];

const SAMPLE_RESERVATIONS = [
  {
    name: "Maija Virtanen",
    meta: "18.7. · 16:00 · 4 hlö",
    phone: "+358 40 123 4567",
    status: "Vahvistettu",
    statusTone: "ok" as const,
  },
  {
    name: "Hotel Aura",
    meta: "18.7. · 19:00 · 6 hlö",
    phone: "+358 50 987 6543",
    status: "Odottaa",
    statusTone: "wait" as const,
  },
  {
    name: "Café Norte",
    meta: "18.7. · 20:30 · 2 hlö",
    phone: "+358 44 555 1212",
    status: "Vahvistettu",
    statusTone: "ok" as const,
  },
];

function StatusPill({ label, tone }: { label: string; tone: "ok" | "wait" }) {
  return (
    <span
      className={
        "shrink-0 rounded-full px-1.5 py-0.5 text-[6px] uppercase tracking-wide " +
        (tone === "ok" ? "bg-[#c46a32]/15 text-[#a35528]" : "bg-[#432f24]/10 text-[#432f24]")
      }
    >
      {label}
    </span>
  );
}

function MiniCalendar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "p-2" : "p-2.5"}>
      <p className="mb-1.5 text-[8px] font-medium text-[#1a1512]">Heinäkuu 2026</p>
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[5px] uppercase tracking-wide text-[#8a8178]">
        {["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={`e${i}`} className="aspect-square" />
        ))}
        {SAMPLE_DAYS.map((day) => (
          <span
            key={day.d}
            className={
              "flex aspect-square items-center justify-center rounded-[2px] text-[7px] tabular-nums " +
              (day.d === "18"
                ? "bg-[#432f24] font-medium text-white"
                : day.booked
                  ? "bg-[#c46a32]/25 font-semibold text-[#432f24]"
                  : "text-[#1a1512]")
            }
          >
            {day.d}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReservationRows({ dense = false }: { dense?: boolean }) {
  return (
    <ul className={dense ? "space-y-1.5" : "space-y-2"}>
      {SAMPLE_RESERVATIONS.map((row) => (
        <li key={row.name} className="rounded-sm border border-[#e5e0d8] bg-white px-2 py-1.5">
          <div className="flex items-start justify-between gap-1">
            <p className="truncate text-[8px] font-medium text-[#1a1512]">{row.name}</p>
            <StatusPill label={row.status} tone={row.statusTone} />
          </div>
          <p className="mt-0.5 text-[7px] text-[#6b635c]">{row.meta}</p>
          <p className="text-[7px] text-[#8a8178]">{row.phone}</p>
        </li>
      ))}
    </ul>
  );
}

function MonitorPreview() {
  return (
    <div className="w-full max-w-[22rem]">
      <div className="rounded-[0.95rem] border border-[#2a221c] bg-[#1a1512] p-[0.45rem] shadow-[0_18px_44px_-12px_rgba(26,18,12,0.4)]">
        <div className="overflow-hidden rounded-[0.55rem] border border-[#3d322a] bg-[#f7f5f2]">
          <div className="border-b border-[#e5e0d8] bg-white px-2.5 py-2">
            <p className="text-[6px] uppercase tracking-[0.18em] text-[#8a8178]">Admin</p>
            <p className="text-[10px] font-medium text-[#1a1512]">Pöytävaraukset</p>
          </div>

          <div className="flex min-h-[12.5rem] sm:min-h-[14rem]">
            <nav className="hidden w-[4.25rem] shrink-0 border-r border-[#e5e0d8] bg-[#faf8f5] p-1.5 sm:block">
              {[
                { label: "Yhteenveto", active: false },
                { label: "Varaukset", active: true },
                { label: "Asetukset", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={
                    "mb-1 rounded-sm px-1.5 py-1.5 text-[8px] leading-tight " +
                    (item.active ? "bg-[#432f24] text-white" : "text-[#6b635c]")
                  }
                >
                  {item.label}
                </div>
              ))}
            </nav>

            <div className="grid flex-1 gap-2 p-2 sm:grid-cols-[7.5rem_1fr] sm:p-2.5">
              <div className="rounded-sm border border-[#e5e0d8] bg-white">
                <MiniCalendar />
              </div>
              <div className="min-w-0">
                <p className="mb-1.5 text-[9px] font-medium text-[#1a1512]">
                  Lauantai 18. heinäkuuta
                </p>
                <ReservationRows />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-0 flex w-[28%] flex-col items-center">
        <div className="h-3 w-[18%] bg-[#2a221c]" />
        <div className="h-1.5 w-full rounded-b-sm bg-[#1a1512]" />
      </div>
    </div>
  );
}

function TabletPreview() {
  return (
    <div className="w-full max-w-[11.5rem]">
      <div className="rounded-[1.15rem] border border-[#2a221c] bg-[#1a1512] p-[0.4rem] shadow-[0_18px_40px_-14px_rgba(26,18,12,0.45)]">
        <div className="overflow-hidden rounded-[0.75rem] border border-[#3d322a] bg-[#f7f5f2]">
          <div className="flex justify-center bg-[#1a1512] py-1">
            <div className="h-1 w-8 rounded-full bg-[#3d322a]" />
          </div>
          <div className="border-b border-[#e5e0d8] bg-white px-2.5 py-2">
            <p className="text-[6px] uppercase tracking-[0.16em] text-[#8a8178]">Restadigi</p>
            <p className="text-[10px] font-medium text-[#1a1512]">Päivän varaukset</p>
          </div>
          <div className="space-y-2 p-2">
            <div className="rounded-sm border border-[#e5e0d8] bg-white">
              <MiniCalendar compact />
            </div>
            <ReservationRows dense />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReservationsDevicePreviews({ className = "" }: { className?: string }) {
  return (
    <div
      className={"flex flex-wrap items-end justify-center gap-6 sm:gap-10 " + className}
      aria-hidden
    >
      <div className="origin-bottom transition-transform duration-700 hover:-translate-y-1">
        <TabletPreview />
      </div>
      <div className="origin-bottom transition-transform duration-700 hover:-translate-y-1.5">
        <MonitorPreview />
      </div>
    </div>
  );
}
