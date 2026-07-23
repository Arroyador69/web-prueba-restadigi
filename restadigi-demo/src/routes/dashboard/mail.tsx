import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileText, Mail, Save, Send, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import restadigiLogo from "@/assets/restadigi-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/mail")({
  component: DashboardMailPage,
});

type AttachmentMeta = {
  slot: "pdf1" | "pdf2";
  filename: string | null;
  sizeBytes: number;
  updatedAt: string | null;
  hasFile: boolean;
};

type OutboundEmail = {
  id: string;
  toEmail: string;
  toName: string | null;
  subject: string;
  status: string;
  errorMessage: string | null;
  openCount: number;
  openedAt: string | null;
  lastOpenedAt: string | null;
  sentAt: string;
};

type MailStats = {
  total: number;
  sent: number;
  failed: number;
  opened: number;
};

const SLOT_LABELS: Record<AttachmentMeta["slot"], string> = {
  pdf1: "PDF 1 · Digipalvelut",
  pdf2: "PDF 2 · Verkkosivupaketit",
};

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kt`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mt`;
}

function splitParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function DashboardMailPage() {
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const [emails, setEmails] = useState<OutboundEmail[]>([]);
  const [stats, setStats] = useState<MailStats>({ total: 0, sent: 0, failed: 0, opened: 0 });
  const [subject, setSubject] = useState(DEFAULT_MAIL_SUBJECT);
  const [body, setBody] = useState(DEFAULT_MAIL_BODY_FI);
  const [templateUpdatedAt, setTemplateUpdatedAt] = useState<string | null>(null);
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [company, setCompany] = useState("");
  const [previewFirstName, setPreviewFirstName] = useState("Jani");
  const [previewCompany, setPreviewCompany] = useState("Oluthuone Hannikainen");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/dashboard/mail", { credentials: "include" });
      const data = (await res.json()) as {
        emails?: OutboundEmail[];
        attachments?: AttachmentMeta[];
        stats?: MailStats;
        template?: { subject: string; body: string; updatedAt: string | null };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Lataus epäonnistui");
      setEmails(data.emails ?? []);
      setAttachments(data.attachments ?? []);
      setStats(data.stats ?? { total: 0, sent: 0, failed: 0, opened: 0 });
      if (data.template) {
        setSubject(data.template.subject);
        setBody(data.template.body);
        setTemplateUpdatedAt(data.template.updatedAt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Virhe");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filledSubject = useMemo(
    () =>
      applyMailPlaceholders(subject, {
        firstName: previewFirstName,
        company: previewCompany,
      }),
    [subject, previewFirstName, previewCompany],
  );

  const filledBody = useMemo(
    () =>
      applyMailPlaceholders(body, {
        firstName: previewFirstName,
        company: previewCompany,
      }),
    [body, previewFirstName, previewCompany],
  );

  async function handleUpload(slot: AttachmentMeta["slot"], file: File | undefined) {
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const form = new FormData();
      form.set("slot", slot);
      form.set("file", file);
      const res = await fetch("/api/dashboard/mail/attachments", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      toast.success("PDF tallennettu");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleDelete(slot: AttachmentMeta["slot"]) {
    try {
      const res = await fetch(`/api/dashboard/mail/attachments?slot=${slot}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Poisto epäonnistui");
      toast.success("PDF poistettu");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Poisto epäonnistui");
    }
  }

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/mail", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = (await res.json()) as {
        template?: { updatedAt: string | null };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Tallennus epäonnistui");
      setTemplateUpdatedAt(data.template?.updatedAt ?? null);
      toast.success("Sähköpostipohja tallennettu");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tallennus epäonnistui");
    } finally {
      setSaving(false);
    }
  }

  async function handleSend(opts: { test: boolean }) {
    if (!toEmail.trim()) {
      toast.error("Anna vastaanottajan sähköposti");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/dashboard/mail", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail,
          toName: toName || previewFirstName,
          company: company || previewCompany,
          subject,
          body,
          test: opts.test,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Lähetys epäonnistui");
      toast.success(
        opts.test ? `Testiviesti lähetetty: ${toEmail}` : `Viesti lähetetty: ${toEmail}`,
      );
      if (!opts.test) {
        setToEmail("");
        setToName("");
        setCompany("");
      }
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lähetys epäonnistui");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Ladataan…</p>;
  }

  if (error) {
    return (
      <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-4 text-sm">
        {error}
        <p className="mt-2 text-muted-foreground">
          Tarvitset DATABASE_URL (Neon) ja SMTP-asetukset Zohoa varten.
        </p>
      </div>
    );
  }

  const openRate = stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0;
  const pdfReady = attachments.filter((a) => a.hasFile).length >= 2;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Asiakasposti</p>
          <h2 className="mt-1 text-2xl font-medium">Sähköposti</h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            Tallenna suomenkielinen pohja ja PDF-liitteet. Esikatselu näyttää valmiin viestin
            allekirjoituksineen.
          </p>
          {templateUpdatedAt ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Pohja tallennettu {new Date(templateUpdatedAt).toLocaleString("fi-FI")}
            </p>
          ) : null}
        </div>
        <Button type="button" onClick={() => void handleSaveTemplate()} disabled={saving}>
          <Save className="size-4" />
          {saving ? "Tallennetaan…" : "Tallenna pohja"}
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Lähetetty", value: stats.sent },
          { label: "Avattu", value: stats.opened },
          { label: "Avausprosentti", value: `${openRate} %` },
          { label: "Epäonnistuneet", value: stats.failed },
        ].map((card) => (
          <div key={card.label} className="rounded-sm border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-2xl font-medium tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-sm border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-accent" />
          <h3 className="font-medium">PDF-liitteet</h3>
        </div>
        <p className="text-sm text-foreground/70">
          Lataa PDF:t Neon-tietokantaan. Asiakaslähetys vaatii molemmat; testilähetys toimii myös
          ilman liitteitä.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {attachments.map((att) => (
            <div key={att.slot} className="rounded-sm border border-border p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{SLOT_LABELS[att.slot]}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {att.hasFile
                      ? `${att.filename} · ${formatBytes(att.sizeBytes)}`
                      : "Ei tiedostoa — lataa PDF"}
                  </p>
                </div>
                {att.hasFile ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleDelete(att.slot)}
                  >
                    <Trash2 className="size-3.5" />
                    Poista
                  </Button>
                ) : null}
              </div>
              <Label
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-border px-3 py-3 text-sm hover:bg-secondary/60",
                  uploadingSlot === att.slot && "opacity-60",
                )}
              >
                <Upload className="size-4" />
                {uploadingSlot === att.slot
                  ? "Ladataan…"
                  : att.hasFile
                    ? "Vaihda PDF"
                    : "Lataa PDF"}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  disabled={uploadingSlot === att.slot}
                  onChange={(e) => void handleUpload(att.slot, e.target.files?.[0])}
                />
              </Label>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="space-y-5 rounded-sm border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Aihe</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Merkit <code className="rounded bg-muted px-1">[ETUNIMI]</code> ja{" "}
              <code className="rounded bg-muted px-1">[YRITYS]</code>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Viestipohja</Label>
            <Textarea
              id="body"
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[260px] font-serif text-[15px] leading-relaxed"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preview-first">Esikatselu: etunimi</Label>
              <Input
                id="preview-first"
                value={previewFirstName}
                onChange={(e) => setPreviewFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview-company">Esikatselu: yritys</Label>
              <Input
                id="preview-company"
                value={previewCompany}
                onChange={(e) => setPreviewCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <Send className="size-4 text-accent" />
              <h3 className="font-medium">Lähetys</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="toEmail">Vastaanottajan sähköposti</Label>
                <Input
                  id="toEmail"
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="oma@restadigi.fi tai asiakas@yritys.fi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toName">Nimi</Label>
                <Input
                  id="toName"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="Jani"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Yritys</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Oluthuone Hannikainen"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={sending}
                onClick={() => void handleSend({ test: true })}
              >
                <Mail className="size-4" />
                {sending ? "Lähetetään…" : "Lähetä testi"}
              </Button>
              <Button
                type="button"
                disabled={sending || !pdfReady}
                onClick={() => void handleSend({ test: false })}
              >
                <Send className="size-4" />
                Lähetä asiakkaalle
              </Button>
            </div>
            {!pdfReady ? (
              <p className="text-xs text-muted-foreground">
                Asiakaslähetys vaatii molemmat PDF:t. Testi toimii ilman liitteitä.
              </p>
            ) : null}
          </div>
        </section>

        <div className="rounded-xl border border-[#e6dfd7] bg-[#f7f3ee] p-4 sm:p-6">
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[#5c534c]">Esikatselu</p>
          <article className="rounded-xl border border-[#e6dfd7] bg-white px-6 py-8 shadow-[0_8px_28px_rgba(67,47,36,0.06)] sm:px-10 sm:py-10">
            <div className="mb-5 border-b border-[#e6dfd7] pb-3.5 font-sans text-[13px] text-[#5c534c]">
              <strong className="font-semibold text-[#1a1512]">Aihe:</strong> {filledSubject}
            </div>

            <div className="space-y-4 font-serif text-[17px] leading-[1.55] text-[#1a1512]">
              {splitParagraphs(filledBody).map((paragraph, index) => {
                const isTagline = paragraph.startsWith("Restadigi.fi —");
                const isSite = paragraph.startsWith("Tutustu palveluumme");
                return (
                  <p
                    key={`${index}-${paragraph.slice(0, 24)}`}
                    className={
                      isTagline ? "mt-2 italic text-[#432f24]" : isSite ? "mb-2" : undefined
                    }
                  >
                    {isSite ? (
                      <>
                        Tutustu palveluumme:{" "}
                        <a
                          href="https://restadigi.fi"
                          className="text-[#432f24] underline-offset-2 hover:underline"
                        >
                          https://restadigi.fi
                        </a>
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                );
              })}
            </div>

            {attachments.some((a) => a.hasFile) ? (
              <div className="mt-6 rounded-lg border border-dashed border-[#e6dfd7] bg-[#f7f3ee]/60 px-4 py-3">
                <p className="mb-2 font-sans text-xs uppercase tracking-wide text-[#5c534c]">
                  Liitteet
                </p>
                <ul className="space-y-1 font-sans text-sm text-[#432f24]">
                  {attachments
                    .filter((a) => a.hasFile)
                    .map((a) => (
                      <li key={a.slot}>📎 {a.filename}</li>
                    ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8 border-t border-[#e6dfd7] pt-6 font-sans">
              <p className="text-[15px]">Parhain terveisin,</p>
              <p className="mt-1 mb-4 text-base font-semibold">{CONTACT_PERSON}</p>
              <img
                src={restadigiLogo}
                alt="Restadigi"
                className="mb-3 h-[72px] w-auto object-contain object-left"
              />
              <p className="text-sm text-[#5c534c]">{CONTACT_COMPANY}</p>
              <p className="mt-1 text-sm leading-snug text-[#5c534c]">
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#432f24] no-underline">
                  {CONTACT_EMAIL}
                </a>
                <br />
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-[#432f24] no-underline">
                  {CONTACT_PHONE_DISPLAY}
                </a>
                <br />
                <a href="https://restadigi.fi" className="text-[#432f24] no-underline">
                  https://restadigi.fi
                </a>
                <br />
                {CONTACT_ADDRESS}
              </p>
            </div>
          </article>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-accent" />
          <h3 className="font-medium">Lähetetyt viestit</h3>
        </div>
        {emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ei vielä lähetettyjä viestejä.</p>
        ) : (
          <div className="overflow-x-auto rounded-sm border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Vastaanottaja</th>
                  <th className="px-3 py-2 font-medium">Aihe</th>
                  <th className="px-3 py-2 font-medium">Tila</th>
                  <th className="px-3 py-2 font-medium">Avaukset</th>
                  <th className="px-3 py-2 font-medium">Lähetetty</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <div className="font-medium">{email.toName || email.toEmail}</div>
                      {email.toName ? (
                        <div className="text-xs text-muted-foreground">{email.toEmail}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 max-w-[220px] truncate">{email.subject}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded-sm px-2 py-0.5 text-xs",
                          email.status === "sent"
                            ? "bg-accent/15 text-accent"
                            : "bg-destructive/10 text-destructive",
                        )}
                      >
                        {email.status === "sent" ? "Lähetetty" : "Epäonnistui"}
                      </span>
                      {email.errorMessage ? (
                        <p className="mt-1 text-xs text-destructive">{email.errorMessage}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {email.openCount > 0 ? (
                        <span>
                          {email.openCount}×
                          {email.lastOpenedAt ? (
                            <span className="block text-xs text-muted-foreground">
                              {new Date(email.lastOpenedAt).toLocaleString("fi-FI")}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Ei avattu</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {new Date(email.sentAt).toLocaleString("fi-FI")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
