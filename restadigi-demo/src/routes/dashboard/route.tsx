import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";
import { landingUrl, useDashboardUi, useLocale } from "@/i18n";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/dashboard/login";
  const [ready, setReady] = useState(isLogin);
  const [publicDemo, setPublicDemo] = useState(false);
  const t = useDashboardUi();
  const { locale } = useLocale();

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }

    setReady(false);
    void fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          void navigate({ to: "/dashboard/login" });
          return;
        }
        const data = (await res.json()) as { publicDemo?: boolean };
        setPublicDemo(!!data.publicDemo);
        setReady(true);
      })
      .catch(() => void navigate({ to: "/dashboard/login" }));
  }, [navigate, isLogin]);

  if (isLogin) {
    return <Outlet />;
  }

  if (!ready) {
    return (
      <div className="dashboard-app flex min-h-screen items-center justify-center text-[#5c534c]">
        <div className="rounded-2xl border border-[#e8dfd4] bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
          {t.layout.loading}
        </div>
      </div>
    );
  }

  return (
    <DashboardShell publicDemo={publicDemo}>
      {publicDemo ? (
        <div className="dashboard-app__banner mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c46a32]">
                Restadigi
              </p>
              <p className="mt-1 font-serif text-base leading-snug text-[#2a2018] sm:text-lg">
                {t.layout.demoTitle}
              </p>
              <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-[#5c534c] sm:text-sm">
                {t.layout.demoBody}
              </p>
            </div>
            <a
              href={landingUrl(locale)}
              className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-full border border-[#432f24]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#432f24] shadow-sm transition hover:border-[#c46a32]/40 hover:text-[#c46a32] sm:w-auto sm:min-h-0 sm:py-1.5"
            >
              {t.layout.viewLanding}
            </a>
          </div>
        </div>
      ) : null}
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </DashboardShell>
  );
}
