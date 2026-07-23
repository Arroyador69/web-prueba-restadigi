import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/conversations")({
  component: DashboardConversationsPage,
});

type SessionItem = {
  id: string;
  visitorSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string | null;
  hasReservation: boolean;
};

type Message = { id: string; role: string; content: string; createdAt: string };

function DashboardConversationsPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/dashboard/conversations", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Lataus epäonnistui");
        return res.json() as Promise<{ sessions: SessionItem[] }>;
      })
      .then((data) => setSessions(data.sessions))
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    void fetch(`/api/dashboard/conversations/${selectedId}`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Viestien lataus epäonnistui");
        return res.json() as Promise<{ messages: Message[] }>;
      })
      .then((data) => setMessages(data.messages))
      .catch((err: Error) => setError(err.message));
  }, [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium">Chat-keskustelut</h2>
        <p className="text-sm text-muted-foreground">Kaikki chatbot-keskustelut ja varaukset</p>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => setSelectedId(session.id)}
              className={cn(
                "w-full rounded-sm border p-4 text-left transition-colors",
                selectedId === session.id
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:bg-secondary/50",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(session.updatedAt).toLocaleString("fi-FI")}
                </p>
                {session.hasReservation && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent">
                    Varaus
                  </span>
                )}
                {session.lastMessage?.includes("MYYNTILIIDI") && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
                    Liidi
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm">{session.lastMessage ?? "—"}</p>
              <p className="mt-2 text-xs text-muted-foreground">{session.messageCount} viestiä</p>
            </button>
          ))}
        </div>

        <div className="rounded-sm border border-border bg-card p-5">
          {!selectedId ? (
            <p className="text-sm text-muted-foreground">Valitse keskustelu vasemmalta.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm",
                    msg.role === "user"
                      ? "ml-8 bg-accent/15"
                      : msg.role === "system"
                        ? "mr-8 border border-primary/30 bg-primary/5 whitespace-pre-wrap"
                        : "mr-8 border border-border bg-background",
                  )}
                >
                  <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {msg.role === "system" ? "Myyntiliidi" : msg.role}
                  </p>
                  {msg.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
