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
import { LocaleFlag, useDashboardUi, useLocale, type Locale } from "@/i18n";
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

export function DashboardShell({
  children,
  publicDemo = false,
}: {
  children: ReactNode;
  publicDemo?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { locale, setLocale } = useLocale();
  const t = useDashboardUi();
  const labels = t.shell;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/dashboard/login";
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {publicDemo ? labels.demo : labels.admin}
            </p>
            <h1 className="text-lg font-medium">{labels.title}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="flex items-center gap-2 rounded-sm border border-border bg-background px-2 py-1.5 text-xs">
              <LocaleFlag locale={locale} className="size-4 rounded-[2px] ring-1 ring-border/60" />
              <span className="sr-only sm:not-sr-only sm:text-muted-foreground">
                {t.common.language}
              </span>
              <select
                className="bg-transparent text-sm font-medium outline-none"
                value={locale}
                aria-label={t.common.language}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                <option value="fi">FI</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </label>
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
