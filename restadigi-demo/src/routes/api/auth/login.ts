import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { createSessionToken, sessionCookieHeader, verifyAdminCredentials } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "login");
        if (limited) return limited;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid credentials" }, { status: 400 });
        }

        if (!verifyAdminCredentials(parsed.data.email, parsed.data.password)) {
          return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        try {
          const token = createSessionToken(parsed.data.email);
          return new Response(JSON.stringify({ ok: true, email: parsed.data.email }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": sessionCookieHeader(token),
            },
          });
        } catch (error) {
          console.error("Login error:", error);
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }
      },
    },
  },
});
