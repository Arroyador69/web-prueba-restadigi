import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";
import { useLocale } from "@/i18n";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/dashboard/login";
  const [ready, setReady] = useState(isLogin);
  const [publicDemo, setPublicDemo] = useState(false);
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
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        {locale === "es" ? "Cargando…" : locale === "en" ? "Loading…" : "Ladataan…"}
      </div>
    );
  }

  const banner =
    locale === "es"
      ? {
          title: "Demo pública Restadigi — sin login",
          body: "Panel de muestra con datos de ejemplo nuestros. Todo lo que crees o edites aquí funciona en pantalla pero no se guarda en la base de datos. El correo real está desactivado.",
        }
      : locale === "en"
        ? {
            title: "Restadigi public demo — no login",
            body: "Sample panel with our curated demo data. Anything you create or edit works on screen but is never saved to the database. Real email sending is disabled.",
          }
        : {
            title: "Restadigi julkinen demo — ei kirjautumista",
            body: "Esimerkkipaneeli meidän demodatalla. Kaikki mitä luot tai muokkaat toimii näytöllä, mutta ei tallennu tietokantaan. Oikea sähköposti on pois käytöstä.",
          };

  return (
    <DashboardShell publicDemo={publicDemo}>
      {publicDemo ? (
        <div className="mb-6 rounded-sm border border-amber-300 bg-amber-50 px-4 py-3 text-amber-950">
          <p className="text-sm font-semibold">{banner.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/90">{banner.body}</p>
          <p className="mt-2 text-xs">
            <Link to="/" className="font-semibold underline">
              {locale === "es" ? "Ver landing" : locale === "en" ? "View landing" : "Näytä landing"}
            </Link>
          </p>
        </div>
      ) : null}
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </DashboardShell>
  );
}
