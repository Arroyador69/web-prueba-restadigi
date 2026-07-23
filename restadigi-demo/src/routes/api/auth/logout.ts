import { createFileRoute } from "@tanstack/react-router";

import { clearSessionCookieHeader } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "auth");
        if (limited) return limited;

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": clearSessionCookieHeader(),
          },
        });
      },
    },
  },
});
