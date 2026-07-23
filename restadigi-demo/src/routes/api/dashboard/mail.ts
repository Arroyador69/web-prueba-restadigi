import { createFileRoute } from "@tanstack/react-router";

import { isPublicDemo, requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import {
  getMailStats,
  getMailTemplate,
  listMailAttachments,
  listOutboundEmails,
  saveMailTemplate,
  sendClientMail,
} from "@/lib/mail-service";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/dashboard/mail")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const [emails, attachments, stats, template] = await Promise.all([
            listOutboundEmails(80),
            listMailAttachments(),
            getMailStats(),
            getMailTemplate(),
          ]);

          return Response.json({
            emails,
            attachments,
            stats,
            template,
          });
        } catch (error) {
          console.error("Dashboard mail list error:", error);
          return Response.json({ error: "Viestien lataus epäonnistui" }, { status: 500 });
        }
      },

      PUT: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard", ":write");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const body = (await request.json()) as { subject?: string; body?: string };
          const template = await saveMailTemplate({
            subject: body.subject ?? "",
            body: body.body ?? "",
          });
          return Response.json({ template });
        } catch (error) {
          console.error("Dashboard mail template save error:", error);
          const message = error instanceof Error ? error.message : "Tallennus epäonnistui";
          return Response.json({ error: message }, { status: 400 });
        }
      },

      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (isPublicDemo()) {
          return Response.json({
            ok: true,
            demo: true,
            message: "Public demo: real email sending is disabled.",
          });
        }
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const body = (await request.json()) as {
            toEmail?: string;
            toName?: string;
            company?: string;
            subject?: string;
            body?: string;
            test?: boolean;
          };

          const toEmail = body.toEmail?.trim().toLowerCase() ?? "";
          if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
            return Response.json({ error: "Anna kelvollinen sähköpostiosoite" }, { status: 400 });
          }

          const origin = new URL(request.url).origin;
          const isTest = body.test === true;
          const email = await sendClientMail({
            toEmail,
            toName: body.toName,
            company: body.company,
            subject: body.subject,
            body: body.body,
            origin,
            requireAttachments: !isTest,
            subjectPrefix: isTest ? "[TESTI] " : "",
          });

          return Response.json({ ok: true, email });
        } catch (error) {
          console.error("Dashboard mail send error:", error);
          const message = error instanceof Error ? error.message : "Lähetys epäonnistui";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
