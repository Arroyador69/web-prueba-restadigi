import { createFileRoute } from "@tanstack/react-router";

import { isPublicDemo, requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = enforceRateLimit(request, "auth");
        if (limited) return limited;

        const session = requireAdmin(request);
        if (!session) return unauthorizedResponse();
        return Response.json({
          email: session.email,
          publicDemo: isPublicDemo(),
        });
      },
    },
  },
});
