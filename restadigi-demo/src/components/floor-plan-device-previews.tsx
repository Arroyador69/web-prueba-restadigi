import {
  DEMO_FLOOR_PLAN_LARGE,
  DEMO_FLOOR_PLAN_MEDIUM,
  DEMO_FLOOR_PLAN_SMALL,
  type FloorPlan,
  type FloorTable,
  ZONE_LABELS,
  sumSeats,
} from "@/lib/floor-plan";
import type { ReactNode } from "react";

function tableSize(seats: FloorTable["seats"], scale: "sm" | "md" | "lg") {
  const map = {
    sm: {
      2: "size-[1.05rem] text-[5px]",
      4: "size-[1.25rem] text-[5px]",
      6: "h-[1.25rem] w-[1.7rem] text-[5px]",
      8: "h-[1.35rem] w-[2rem] text-[5px]",
    },
    md: {
      2: "size-5 text-[6px]",
      4: "size-6 text-[6px]",
      6: "h-6 w-9 text-[6px]",
      8: "h-7 w-10 text-[6px]",
    },
    lg: {
      2: "size-6 text-[7px]",
      4: "size-7 text-[7px]",
      6: "h-7 w-10 text-[7px]",
      8: "h-8 w-[3rem] text-[7px]",
    },
  } as const;
  return map[scale][seats];
}

function MiniFloorMap({
  plan,
  highlightId,
  occupied,
  scale,
  showZones = true,
}: {
  plan: FloorPlan;
  highlightId: string;
  occupied: Set<string>;
  scale: "sm" | "md" | "lg";
  showZones?: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[0.35rem] border border-[#e5e0d8] bg-[#f3efe8]">
      {showZones && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[24%] border-b border-dashed border-[#c46a32]/25 bg-[#c46a32]/5" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] border-t border-dashed border-[#432f24]/15 bg-[#432f24]/5" />
        </>
      )}
      {plan.tables.map((table) => {
        const isOccupied = occupied.has(table.id);
        const active = table.id === highlightId;
        return (
          <div
            key={table.id}
            className={
              "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border shadow-sm " +
              (table.shape === "round" ? "rounded-full " : "rounded-[3px] ") +
              tableSize(table.seats, scale) +
              " " +
              (active
                ? "z-[2] border-[#c46a32] bg-[#432f24] text-white"
                : isOccupied
                  ? "border-[#c46a32]/50 bg-[#c46a32]/20 text-[#432f24]"
                  : "border-[#d4cdc3] bg-white text-[#1a1512]")
            }
            style={{ left: `${table.x}%`, top: `${table.y}%` }}
          >
            <span className="font-medium leading-none">{table.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ScreenChrome({
  title,
  children,
  dense = false,
}: {
  title: string;
  children: ReactNode;
  dense?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[0.45rem] border border-[#3d322a] bg-[#f7f5f2]">
      <div
        className={"border-b border-[#e5e0d8] bg-white " + (dense ? "px-2 py-1.5" : "px-2.5 py-2")}
      >
        <p className="text-[5px] uppercase tracking-[0.16em] text-[#8a8178]">Admin</p>
        <p className={"font-medium text-[#1a1512] " + (dense ? "text-[8px]" : "text-[10px]")}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

function PhonePreview() {
  const plan = DEMO_FLOOR_PLAN_SMALL;
  const highlightId = "s5";
  const occupied = new Set(["s2", "s5", "s7"]);
  const totalSeats = sumSeats(plan.tables);
  const freeCount = plan.tables.length - occupied.size;
  const table = plan.tables.find((t) => t.id === highlightId)!;

  return (
    <div className="w-[8.5rem] shrink-0 sm:w-[9.25rem]">
      <div className="rounded-[1.35rem] border border-[#2a221c] bg-[#1a1512] p-[0.35rem] shadow-[0_16px_36px_-12px_rgba(26,18,12,0.45)]">
        <div className="mb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-[#3d322a]" />
        </div>
        <ScreenChrome title={`Pöytäkartta · ${totalSeats}`} dense>
          <div className="space-y-1.5 p-1.5">
            <div className="grid grid-cols-2 gap-1">
              <div className="rounded-[2px] border border-[#e5e0d8] bg-white px-1 py-1">
                <p className="text-[5px] uppercase tracking-wide text-[#8a8178]">Paikat</p>
                <p className="text-[9px] font-medium tabular-nums text-[#1a1512]">{totalSeats}</p>
              </div>
              <div className="rounded-[2px] border border-[#e5e0d8] bg-white px-1 py-1">
                <p className="text-[5px] uppercase tracking-wide text-[#8a8178]">Vapaana</p>
                <p className="text-[9px] font-medium tabular-nums text-[#1a1512]">{freeCount}</p>
              </div>
            </div>
            <MiniFloorMap plan={plan} highlightId={highlightId} occupied={occupied} scale="sm" />
            <div className="rounded-[2px] border border-[#e5e0d8] bg-white px-1.5 py-1">
              <p className="text-[7px] font-medium text-[#1a1512]">Pöytä {table.label}</p>
              <p className="text-[6px] text-[#8a8178]">
                {table.seats} hlö · {ZONE_LABELS[table.zone]} · varattu
              </p>
            </div>
          </div>
        </ScreenChrome>
        <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-[#3d322a]" />
      </div>
    </div>
  );
}

function TabletPreview() {
  const plan = DEMO_FLOOR_PLAN_MEDIUM;
  const highlightId = "m6";
  const occupied = new Set(["m2", "m6", "m9"]);
  const totalSeats = sumSeats(plan.tables);
  const freeCount = plan.tables.length - occupied.size;
  const table = plan.tables.find((t) => t.id === highlightId)!;

  return (
    <div className="w-[13rem] shrink-0 sm:w-[14.5rem]">
      <div className="rounded-[1.1rem] border border-[#2a221c] bg-[#1a1512] p-[0.4rem] shadow-[0_18px_40px_-14px_rgba(26,18,12,0.45)]">
        <div className="mb-1 flex justify-center">
          <div className="h-1 w-8 rounded-full bg-[#3d322a]" />
        </div>
        <ScreenChrome title={`Pöytäkartta · ${totalSeats} paikkaa`}>
          <div className="space-y-1.5 p-2">
            <MiniFloorMap plan={plan} highlightId={highlightId} occupied={occupied} scale="md" />
            <div className="grid grid-cols-3 gap-1">
              <div className="rounded-[2px] border border-[#e5e0d8] bg-white p-1.5">
                <p className="text-[5px] uppercase tracking-wide text-[#8a8178]">Valittu</p>
                <p className="text-[8px] font-medium text-[#1a1512]">Pöytä {table.label}</p>
                <p className="text-[6px] text-[#8a8178]">
                  {table.seats} hlö · {ZONE_LABELS[table.zone]}
                </p>
              </div>
              <div className="rounded-[2px] border border-[#e5e0d8] bg-white p-1.5">
                <p className="text-[5px] uppercase tracking-wide text-[#8a8178]">Tila</p>
                <p className="mt-0.5 text-[7px] font-medium text-[#a35528]">Varattu</p>
                <p className="text-[6px] text-[#8a8178]">19:00 · 6 hlö</p>
              </div>
              <div className="rounded-[2px] border border-[#e5e0d8] bg-white p-1.5">
                <p className="text-[5px] uppercase tracking-wide text-[#8a8178]">Pöytiä</p>
                <p className="text-[8px] font-medium tabular-nums text-[#1a1512]">
                  {plan.tables.length}
                </p>
                <p className="text-[6px] text-[#8a8178]">{freeCount} vapaana</p>
              </div>
            </div>
          </div>
        </ScreenChrome>
      </div>
    </div>
  );
}

function MonitorPreview() {
  const plan = DEMO_FLOOR_PLAN_LARGE;
  const highlightId = "l6";
  const occupied = new Set(["l2", "l6", "l9", "l11"]);
  const totalSeats = sumSeats(plan.tables);
  const occupiedCount = occupied.size;
  const freeCount = plan.tables.length - occupiedCount;

  return (
    <div className="w-[16.5rem] shrink-0 sm:w-[18.5rem]">
      <div className="rounded-[0.95rem] border border-[#2a221c] bg-[#1a1512] p-[0.4rem] shadow-[0_18px_44px_-12px_rgba(26,18,12,0.4)]">
        <ScreenChrome title={`Pöytäkartta · ${totalSeats} paikkaa`}>
          <div className="flex">
            <nav className="hidden w-[3.75rem] shrink-0 border-r border-[#e5e0d8] bg-[#faf8f5] p-1.5 sm:block">
              {["Yhteenveto", "Varaukset", "Pöytäkartta", "Asetukset"].map((label, i) => (
                <div
                  key={label}
                  className={
                    "mb-1 rounded-sm px-1 py-1.5 text-[6px] leading-tight " +
                    (i === 2 ? "bg-[#432f24] text-white" : "text-[#6b635c]")
                  }
                >
                  {label}
                </div>
              ))}
            </nav>
            <div className="min-w-0 flex-1 space-y-1.5 p-2">
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: "Paikat", value: String(totalSeats) },
                  { label: "Pöytiä", value: String(plan.tables.length) },
                  { label: "Vapaana", value: String(freeCount) },
                  { label: "Varattu", value: String(occupiedCount) },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-[2px] border border-[#e5e0d8] bg-white px-1 py-1"
                  >
                    <p className="text-[5px] uppercase tracking-wide text-[#8a8178]">
                      {card.label}
                    </p>
                    <p className="text-[9px] font-medium tabular-nums text-[#1a1512]">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
              <MiniFloorMap plan={plan} highlightId={highlightId} occupied={occupied} scale="lg" />
              <div className="flex flex-wrap gap-2 text-[6px] text-[#6b635c]">
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full border border-[#d4cdc3] bg-white" /> Vapaa
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#c46a32]/35" /> Varattu
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#432f24]" /> Valittu
                </span>
              </div>
            </div>
          </div>
        </ScreenChrome>
      </div>
      <div className="mx-auto mt-0 flex w-[28%] flex-col items-center">
        <div className="h-2.5 w-[18%] bg-[#2a221c]" />
        <div className="h-1.5 w-full rounded-b-sm bg-[#1a1512]" />
      </div>
    </div>
  );
}

export function FloorPlanDevicePreviews({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "flex w-full flex-wrap items-end justify-center gap-6 sm:gap-8 lg:gap-10 " + className
      }
      aria-hidden
    >
      <div className="origin-bottom transition-transform duration-700 hover:-translate-y-1">
        <PhonePreview />
      </div>
      <div className="origin-bottom transition-transform duration-700 hover:-translate-y-1.5">
        <TabletPreview />
      </div>
      <div className="origin-bottom transition-transform duration-700 hover:-translate-y-1">
        <MonitorPreview />
      </div>
    </div>
  );
}
