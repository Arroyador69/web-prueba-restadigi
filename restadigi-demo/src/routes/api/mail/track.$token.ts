import { createFileRoute } from "@tanstack/react-router";

import { getDatabaseUrl } from "@/lib/database-url";
import { recordMailOpen, trackingPixelResponse } from "@/lib/mail-service";

export const Route = createFileRoute("/api/mail/track/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          if (getDatabaseUrl() && params.token) {
            await recordMailOpen(params.token);
          }
        } catch (error) {
          console.error("Mail open tracking error:", error);
        }
        return trackingPixelResponse();
      },
    },
  },
});
