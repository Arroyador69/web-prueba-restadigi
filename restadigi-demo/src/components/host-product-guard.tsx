import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

import { hostProductRedirect } from "@/i18n/detect";

/**
 * On production hosts, keep web.* = landing and demo.* = dashboard.
 * Runs on navigation so deep links still land correctly.
 */
export function HostProductGuard() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = hostProductRedirect(
      window.location.hostname,
      pathname,
      window.location.search,
    );
    if (!target) return;
    const current = `${window.location.pathname}${window.location.search}`;
    if (target.startsWith("http")) {
      if (target !== window.location.href) window.location.replace(target);
      return;
    }
    if (target !== current) window.location.replace(target);
  }, [pathname]);

  return null;
}
