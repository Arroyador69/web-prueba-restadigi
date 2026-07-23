import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";
import { useDashboardUi } from "@/i18n";

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
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        {t.layout.loading}
      </div>
    );
  }

  return (
    <DashboardShell publicDemo={publicDemo}>
      {publicDemo ? (
        <div className="mb-6 rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950">
          <p className="text-sm font-semibold">{t.layout.demoTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/90">{t.layout.demoBody}</p>
          <p className="mt-2 text-xs">
            <Link to="/" className="font-semibold underline">
              {t.layout.viewLanding}
            </Link>
          </p>
        </div>
      ) : null}
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </DashboardShell>
  );
}
