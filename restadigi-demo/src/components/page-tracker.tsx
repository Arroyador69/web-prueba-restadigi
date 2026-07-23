import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { getOrCreateVisitorSessionId } from "@/lib/visitor-session";

export function PageTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;

    const visitorSessionId = getOrCreateVisitorSessionId();
    if (!visitorSessionId) return;

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorSessionId,
        path: pathname,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
