import { createFileRoute } from "@tanstack/react-router";

import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { getDatabaseUrl } from "@/lib/database-url";
import {
  deleteMailAttachment,
  listMailAttachments,
  MAIL_SLOTS,
  type MailSlot,
  upsertMailAttachment,
} from "@/lib/mail-service";
import { enforceRateLimit } from "@/lib/rate-limit";

export const Route = createFileRoute("/api/dashboard/mail/attachments")({
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
          const attachments = await listMailAttachments();
          return Response.json({ attachments });
        } catch (error) {
          console.error("Mail attachments list error:", error);
          return Response.json({ error: "Liitteiden lataus epäonnistui" }, { status: 500 });
        }
      },

      POST: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const form = await request.formData();
          const slotRaw = String(form.get("slot") ?? "");
          const file = form.get("file");

          if (!MAIL_SLOTS.includes(slotRaw as MailSlot)) {
            return Response.json({ error: "Virheellinen PDF-paikka" }, { status: 400 });
          }
          if (!(file instanceof File)) {
            return Response.json({ error: "PDF-tiedosto puuttuu" }, { status: 400 });
          }
          if (file.type && file.type !== "application/pdf") {
            return Response.json({ error: "Vain PDF-tiedostot sallitaan" }, { status: 400 });
          }
          if (file.size > 8 * 1024 * 1024) {
            return Response.json({ error: "PDF on liian suuri (max 8 Mt)" }, { status: 400 });
          }

          const buffer = Buffer.from(await file.arrayBuffer());
          const attachment = await upsertMailAttachment(
            slotRaw as MailSlot,
            file.name || `${slotRaw}.pdf`,
            buffer.toString("base64"),
            "application/pdf",
          );

          return Response.json({ ok: true, attachment });
        } catch (error) {
          console.error("Mail attachment upload error:", error);
          const message = error instanceof Error ? error.message : "Upload failed";
          return Response.json({ error: message }, { status: 500 });
        }
      },

      DELETE: async ({ request }) => {
        const limited = enforceRateLimit(request, "dashboard");
        if (limited) return limited;
        if (!requireAdmin(request)) return unauthorizedResponse();
        if (!getDatabaseUrl()) {
          return Response.json({ error: "Database not configured" }, { status: 503 });
        }

        try {
          const url = new URL(request.url);
          const slotRaw = url.searchParams.get("slot") ?? "";
          if (!MAIL_SLOTS.includes(slotRaw as MailSlot)) {
            return Response.json({ error: "Virheellinen PDF-paikka" }, { status: 400 });
          }

          await deleteMailAttachment(slotRaw as MailSlot);
          return Response.json({ ok: true });
        } catch (error) {
          console.error("Mail attachment delete error:", error);
          return Response.json({ error: "Poisto epäonnistui" }, { status: 500 });
        }
      },
    },
  },
});
