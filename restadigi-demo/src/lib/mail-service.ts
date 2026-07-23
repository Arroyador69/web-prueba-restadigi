import { randomBytes } from "node:crypto";

import { count, desc, eq, sql } from "drizzle-orm";
import nodemailer from "nodemailer";

import { getDb, schema } from "@/db";
import {
  CONTACT_ADDRESS,
  CONTACT_COMPANY,
  CONTACT_EMAIL,
  CONTACT_PERSON,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/company-contact";
import {
  applyMailPlaceholders,
  DEFAULT_MAIL_BODY_FI,
  DEFAULT_MAIL_SUBJECT,
} from "@/lib/mail-template";

export { applyMailPlaceholders, DEFAULT_MAIL_BODY_FI, DEFAULT_MAIL_SUBJECT };

export const MAIL_SLOTS = ["pdf1", "pdf2"] as const;
export type MailSlot = (typeof MAIL_SLOTS)[number];

const PIXEL_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Creates Neon tables if missing (safe to call on every request). */
export async function ensureMailTables() {
  const db = getDb();
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mail_attachments (
      slot TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'application/pdf',
      content_base64 TEXT NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS outbound_emails (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      to_email TEXT NOT NULL,
      to_name TEXT,
      subject TEXT NOT NULL,
      tracking_token TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'sent',
      error_message TEXT,
      attachment_slots TEXT NOT NULL DEFAULT 'pdf1,pdf2',
      open_count INTEGER NOT NULL DEFAULT 0,
      opened_at TIMESTAMPTZ,
      last_opened_at TIMESTAMPTZ,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS mail_templates (
      id TEXT PRIMARY KEY DEFAULT 'default',
      subject TEXT NOT NULL,
      body_text TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS idx_outbound_emails_sent_at ON outbound_emails(sent_at DESC)`,
  );
}

export async function getMailTemplate() {
  await ensureMailTables();
  const db = getDb();
  const row = await db.query.mailTemplates.findFirst({
    where: eq(schema.mailTemplates.id, "default"),
  });
  if (!row) {
    return {
      subject: DEFAULT_MAIL_SUBJECT,
      body: DEFAULT_MAIL_BODY_FI,
      updatedAt: null as string | null,
    };
  }
  return {
    subject: row.subject,
    body: row.bodyText,
    updatedAt: row.updatedAt?.toISOString?.() ?? String(row.updatedAt),
  };
}

export async function saveMailTemplate(input: { subject: string; body: string }) {
  await ensureMailTables();
  const db = getDb();
  const subject = input.subject.trim();
  const bodyText = input.body.trim();
  if (!subject || !bodyText) {
    throw new Error("Aihe ja viesti ovat pakollisia");
  }

  await db
    .insert(schema.mailTemplates)
    .values({
      id: "default",
      subject,
      bodyText,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.mailTemplates.id,
      set: {
        subject,
        bodyText,
        updatedAt: new Date(),
      },
    });

  return getMailTemplate();
}

/** PDFs are uploaded manually from the dashboard — never auto-seeded from disk. */
export async function listMailAttachments() {
  await ensureMailTables();
  const db = getDb();
  const rows = await db.query.mailAttachments.findMany();
  return MAIL_SLOTS.map((slot) => {
    const row = rows.find((r) => r.slot === slot);
    if (!row) {
      return { slot, filename: null, sizeBytes: 0, updatedAt: null, hasFile: false };
    }
    return {
      slot,
      filename: row.filename,
      sizeBytes: row.sizeBytes,
      updatedAt: row.updatedAt,
      hasFile: true,
    };
  });
}

export async function upsertMailAttachment(
  slot: MailSlot,
  filename: string,
  contentBase64: string,
  mimeType = "application/pdf",
) {
  await ensureMailTables();
  const db = getDb();
  const sizeBytes = Buffer.from(contentBase64, "base64").length;
  if (sizeBytes > 8 * 1024 * 1024) {
    throw new Error("PDF on liian suuri (max 8 Mt)");
  }

  await db
    .insert(schema.mailAttachments)
    .values({
      slot,
      filename,
      mimeType,
      contentBase64,
      sizeBytes,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.mailAttachments.slot,
      set: {
        filename,
        mimeType,
        contentBase64,
        sizeBytes,
        updatedAt: new Date(),
      },
    });

  return { slot, filename, sizeBytes, hasFile: true };
}

export async function deleteMailAttachment(slot: MailSlot) {
  await ensureMailTables();
  const db = getDb();
  await db.delete(schema.mailAttachments).where(eq(schema.mailAttachments.slot, slot));
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST ?? "smtp.zoho.eu";
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER ?? process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? `Restadigi <${user ?? CONTACT_EMAIL}>`;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be configured (Zoho)");
  }

  return { host, port, user, pass, from, secure: port === 465 };
}

function logoUrl(origin: string) {
  return `${origin.replace(/\/$/, "")}/restadigi-logo.png`;
}

function buildHtmlBody(textBody: string, trackingUrl: string, origin: string) {
  const paragraphs = textBody
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const isTagline = block.startsWith("Restadigi.fi —");
      const isSite = block.startsWith("Tutustu palveluumme");
      const linked = escapeHtml(block).replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" style="color:#432f24;text-decoration:underline;">$1</a>',
      );
      const style = isTagline
        ? "margin:1.4em 0 1em;line-height:1.55;color:#432f24;font-size:17px;font-style:italic;font-family:Georgia,'Times New Roman',serif;"
        : isSite
          ? "margin:0 0 1.6em;line-height:1.55;color:#1a1512;font-size:17px;font-family:Georgia,'Times New Roman',serif;"
          : "margin:0 0 1em;line-height:1.55;color:#1a1512;font-size:17px;font-family:Georgia,'Times New Roman',serif;";
      return `<p style="${style}">${linked}</p>`;
    })
    .join("");

  const logo = escapeHtml(logoUrl(origin));

  return `<!DOCTYPE html>
<html lang="fi">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f7f3ee;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ee;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e6dfd7;border-radius:12px;">
          <tr>
            <td style="padding:36px 40px 40px;">
              ${paragraphs}
              <div style="margin-top:2rem;padding-top:1.4rem;border-top:1px solid #e6dfd7;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">
                <p style="margin:0.2em 0;font-size:15px;color:#1a1512;">Parhain terveisin,</p>
                <p style="margin:0.35em 0 1em;font-size:16px;font-weight:600;color:#1a1512;">${escapeHtml(CONTACT_PERSON)}</p>
                <img src="${logo}" alt="Restadigi" width="180" height="72" style="display:block;height:72px;width:auto;margin:0 0 0.85em;border:0;" />
                <p style="margin:0 0 0.35em;font-size:14px;color:#5c534c;">${escapeHtml(CONTACT_COMPANY)}</p>
                <p style="margin:0;font-size:14px;line-height:1.45;color:#5c534c;">
                  <a href="mailto:${CONTACT_EMAIL}" style="color:#432f24;text-decoration:none;">${CONTACT_EMAIL}</a><br />
                  <a href="tel:${CONTACT_PHONE_TEL}" style="color:#432f24;text-decoration:none;">${CONTACT_PHONE_DISPLAY}</a><br />
                  <a href="https://restadigi.fi" style="color:#432f24;text-decoration:none;">https://restadigi.fi</a><br />
                  ${escapeHtml(CONTACT_ADDRESS)}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <img src="${trackingUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />
</body>
</html>`;
}

function buildPlainText(body: string) {
  return `${body.trim()}

Parhain terveisin,
${CONTACT_PERSON}
${CONTACT_COMPANY}

${CONTACT_EMAIL}
${CONTACT_PHONE_DISPLAY}
https://restadigi.fi
${CONTACT_ADDRESS}`;
}

export async function sendClientMail(input: {
  toEmail: string;
  toName?: string;
  company?: string;
  subject?: string;
  body?: string;
  origin: string;
  requireAttachments?: boolean;
  subjectPrefix?: string;
}) {
  await ensureMailTables();
  const db = getDb();
  const smtp = getSmtpConfig();
  const saved = await getMailTemplate();

  const attachments = await db.query.mailAttachments.findMany();
  const ready = MAIL_SLOTS.map((slot) => attachments.find((a) => a.slot === slot)).filter(
    Boolean,
  ) as (typeof attachments)[number][];

  const requireAttachments = input.requireAttachments !== false;
  if (requireAttachments && ready.length < MAIL_SLOTS.length) {
    throw new Error("Lataa molemmat PDF-tiedostot ennen lähetystä (PDF 1 ja PDF 2)");
  }

  const firstName = input.toName?.trim().split(/\s+/)[0] || undefined;
  const vars = {
    firstName: firstName || "Jani",
    company: input.company?.trim() || "Oluthuone Hannikainen",
  };

  const trackingToken = randomBytes(24).toString("base64url");
  const subject = `${input.subjectPrefix ?? ""}${applyMailPlaceholders(
    (input.subject ?? saved.subject).trim(),
    vars,
  )}`;
  const body = applyMailPlaceholders((input.body ?? saved.body).trim(), vars);
  const trackingUrl = `${input.origin.replace(/\/$/, "")}/api/mail/track/${trackingToken}`;

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  try {
    await transporter.sendMail({
      from: smtp.from,
      to: input.toName ? `"${input.toName}" <${input.toEmail}>` : input.toEmail,
      subject,
      text: buildPlainText(body),
      html: buildHtmlBody(body, trackingUrl, input.origin),
      attachments: ready.map((file) => ({
        filename: file.filename,
        content: Buffer.from(file.contentBase64, "base64"),
        contentType: file.mimeType || "application/pdf",
      })),
    });

    const [row] = await db
      .insert(schema.outboundEmails)
      .values({
        toEmail: input.toEmail,
        toName: input.toName?.trim() || null,
        subject,
        trackingToken,
        status: "sent",
        attachmentSlots: ready.map((f) => f.slot).join(",") || "none",
      })
      .returning();

    return row;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lähetys epäonnistui";
    await db.insert(schema.outboundEmails).values({
      toEmail: input.toEmail,
      toName: input.toName?.trim() || null,
      subject,
      trackingToken,
      status: "failed",
      errorMessage: message,
      attachmentSlots: ready.map((f) => f.slot).join(",") || "none",
    });
    throw new Error(message);
  }
}

export async function listOutboundEmails(limit = 50) {
  await ensureMailTables();
  const db = getDb();
  return db.query.outboundEmails.findMany({
    orderBy: [desc(schema.outboundEmails.sentAt)],
    limit,
  });
}

export async function getMailStats() {
  await ensureMailTables();
  const db = getDb();
  const [total] = await db.select({ count: count() }).from(schema.outboundEmails);
  const [sent] = await db
    .select({ count: count() })
    .from(schema.outboundEmails)
    .where(eq(schema.outboundEmails.status, "sent"));
  const [failed] = await db
    .select({ count: count() })
    .from(schema.outboundEmails)
    .where(eq(schema.outboundEmails.status, "failed"));
  const openedResult = await db.execute<{ count: number }>(
    sql`SELECT COUNT(*)::int AS count FROM outbound_emails WHERE open_count > 0`,
  );

  return {
    total: total?.count ?? 0,
    sent: sent?.count ?? 0,
    failed: failed?.count ?? 0,
    opened: openedResult.rows[0]?.count ?? 0,
  };
}

export async function recordMailOpen(trackingToken: string) {
  await ensureMailTables();
  const db = getDb();
  const row = await db.query.outboundEmails.findFirst({
    where: eq(schema.outboundEmails.trackingToken, trackingToken),
  });
  if (!row) return false;

  const now = new Date();
  await db
    .update(schema.outboundEmails)
    .set({
      openCount: sql`${schema.outboundEmails.openCount} + 1`,
      openedAt: row.openedAt ?? now,
      lastOpenedAt: now,
    })
    .where(eq(schema.outboundEmails.id, row.id));

  return true;
}

export function trackingPixelResponse() {
  return new Response(PIXEL_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
