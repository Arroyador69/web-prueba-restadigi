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

import restadigiIcon from "@/assets/restadigi-logo-icon.png";
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
    <div className="dashboard-app min-h-screen text-[#2a2018]">
      <header className="dashboard-app__header sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={restadigiIcon}
              alt=""
              className="size-10 shrink-0 rounded-full border border-white/15 object-cover shadow-md"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c46a32]">
                {publicDemo ? labels.demo : labels.admin}
              </p>
              <h1 className="truncate font-serif text-xl tracking-tight text-white sm:text-[1.35rem]">
                {labels.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="dashboard-app__lang flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/80">
              <LocaleFlag locale={locale} className="size-4 rounded-[2px] ring-1 ring-white/25" />
              <span className="sr-only sm:not-sr-only sm:text-white/55">{t.common.language}</span>
              <select
                className="bg-transparent text-sm font-medium text-white outline-none"
                value={locale}
                aria-label={t.common.language}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                <option value="fi" className="text-[#2a2018]">
                  FI
                </option>
                <option value="en" className="text-[#2a2018]">
                  EN
                </option>
                <option value="es" className="text-[#2a2018]">
                  ES
                </option>
              </select>
            </label>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/">{labels.landing}</Link>
            </Button>
            {!publicDemo ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void logout()}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <LogOut className="size-4" />
                {labels.logout}
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[248px_1fr] lg:gap-8 lg:px-8 lg:py-8">
        <aside className="dashboard-app__sidebar lg:sticky lg:top-[5.25rem] lg:self-start">
          <nav className="flex flex-row gap-1.5 overflow-x-auto p-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-3">
            {nav.map((item) => {
              const active =
                "exact" in item && item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to);
              const Icon = item.icon;
              const label = labels[item.labelKey];
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "dashboard-app__nav-item flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "dashboard-app__nav-item--active"
                      : "text-[#5c534c] hover:bg-[#f3eee8] hover:text-[#2a2018]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-white/15 text-white" : "bg-[#f3eee8] text-[#432f24]",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="dashboard-app__main min-w-0">{children}</main>
      </div>
    </div>
  );
}
