import { createFileRoute } from "@tanstack/react-router";

import { getRestaurantSettings } from "@/lib/settings-service";
import { toPublicSettings } from "@/lib/restaurant-settings-types";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/restaurant/settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = enforceRateLimit(request, "public");
        if (limited) return limited;

        try {
          const settings = await getRestaurantSettings();
          return Response.json({ settings: toPublicSettings(settings) });
        } catch (error) {
          console.error("Public settings error:", error);
          return Response.json({ error: "Asetusten lataus epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
