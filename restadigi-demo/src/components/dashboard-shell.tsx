import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  ContactRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  MessageSquare,
  Phone,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", labelKey: "summary", icon: LayoutDashboard, exact: true as const },
  { to: "/dashboard/leads", labelKey: "leads", icon: ContactRound },
  { to: "/dashboard/calls", labelKey: "calls", icon: Phone },
  { to: "/dashboard/mail", labelKey: "mail", icon: Mail },
  { to: "/dashboard/visitors", labelKey: "visitors", icon: Users },
  { to: "/dashboard/conversations", labelKey: "conversations", icon: MessageSquare },
  { to: "/dashboard/reservations", labelKey: "reservations", icon: CalendarDays },
  { to: "/dashboard/floor-plan", labelKey: "floor", icon: Map },
  { to: "/dashboard/settings", labelKey: "settings", icon: Settings },
] as const;

const LABELS = {
  fi: {
    summary: "Yhteenveto",
    leads: "Myyntiliidit",
    calls: "Soitukalenteri",
    mail: "Sähköposti",
    visitors: "Kävijät",
    conversations: "Keskustelut",
    reservations: "Varaukset",
    floor: "Pöytäkartta",
    settings: "Asetukset",
    logout: "Kirjaudu ulos",
    demo: "Julkinen demo",
    landing: "Landing",
  },
  en: {
    summary: "Overview",
    leads: "Sales leads",
    calls: "Call calendar",
    mail: "Email",
    visitors: "Visitors",
    conversations: "Conversations",
    reservations: "Reservations",
    floor: "Floor plan",
    settings: "Settings",
    logout: "Log out",
    demo: "Public demo",
    landing: "Landing",
  },
  es: {
    summary: "Resumen",
    leads: "Leads",
    calls: "Calendario llamadas",
    mail: "Email",
    visitors: "Visitas",
    conversations: "Conversaciones",
    reservations: "Reservas",
    floor: "Mapa de mesas",
    settings: "Ajustes",
    logout: "Cerrar sesión",
    demo: "Demo pública",
    landing: "Landing",
  },
} as const;

export function DashboardShell({
  children,
  publicDemo = false,
}: {
  children: ReactNode;
  publicDemo?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { locale } = useLocale();
  const labels = LABELS[locale] || LABELS.fi;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/dashboard/login";
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {publicDemo ? labels.demo : "Admin"}
            </p>
            <h1 className="text-lg font-medium">Restadigi Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">{labels.landing}</Link>
            </Button>
            {!publicDemo ? (
              <Button variant="outline" size="sm" onClick={() => void logout()}>
                <LogOut className="size-4" />
                {labels.logout}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {nav.map((item) => {
            const active =
              "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            const label = labels[item.labelKey];
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
