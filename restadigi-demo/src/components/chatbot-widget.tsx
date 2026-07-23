import { useRouterState } from "@tanstack/react-router";
import { Headphones, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useMessages } from "@/i18n";
import type { ChatMessage } from "@/lib/chatbot-prompt";
import type { PublicRestaurantSettings } from "@/lib/restaurant-settings-types";
import {
  getChatSessionId,
  getOrCreateVisitorSessionId,
  setChatSessionId,
} from "@/lib/visitor-session";
import { cn } from "@/lib/utils";

type ChatMode = "sales" | "reservation";

type ChatbotPanelProps = {
  mode: ChatMode;
  /** floating = bottom-right FAB; inline = button for hero (chat panel still floats) */
  placement: "floating" | "inline";
  className?: string;
  /** Public demo copy (badge + “try booking” hint) */
  demoContext?: boolean;
};

const SALES_ACCENT = "#432f24";

function useChatbot(mode: ChatMode) {
  const t = useMessages();
  const { locale } = useLocale();
  const copy = mode === "sales" ? t.widget.sales : t.widget.booking;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [siteSettings, setSiteSettings] = useState<PublicRestaurantSettings | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(() => getChatSessionId(mode));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const accentColor =
    mode === "reservation" ? (siteSettings?.accentColor ?? "#c46a32") : SALES_ACCENT;

  const welcomeText =
    mode === "reservation" && locale === "fi" && siteSettings?.chatbotWelcomeMessage
      ? siteSettings.chatbotWelcomeMessage
      : copy.welcome;

  const headerTitle =
    mode === "reservation" ? (siteSettings?.restaurantName ?? copy.title) : copy.title;

  useEffect(() => {
    if (mode !== "reservation") return;
    void fetch("/api/restaurant/settings")
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ settings: PublicRestaurantSettings }>;
      })
      .then((data) => {
        if (data?.settings) setSiteSettings(data.settings);
      })
      .catch(() => undefined);
  }, [mode]);

  useEffect(() => {
    setMessages([{ role: "assistant", content: welcomeText }]);
    setError(null);
  }, [welcomeText, locale]);

  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId ?? undefined,
          visitorSessionId: getOrCreateVisitorSessionId(),
          locale,
          mode,
          messages: nextMessages.filter((m) => m.role !== "assistant" || m.content !== welcomeText),
        }),
      });

      const data = (await response.json()) as {
        message?: ChatMessage;
        sessionId?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? copy.sendFailed);
      }

      if (data.sessionId) {
        setSessionId(data.sessionId);
        setChatSessionId(data.sessionId, mode);
      }

      if (data.message) {
        setMessages((prev) => [...prev, data.message!]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.genericError);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return {
    copy,
    open,
    setOpen,
    input,
    setInput,
    messages,
    loading,
    error,
    scrollRef,
    inputRef,
    accentColor,
    headerTitle,
    sendMessage,
    handleKeyDown,
  };
}

function ChatDialog({
  mode,
  panel,
  panelClassName,
  demoContext = false,
}: {
  mode: ChatMode;
  panel: ReturnType<typeof useChatbot>;
  panelClassName?: string;
  /** Public demo: badge + hint under header */
  demoContext?: boolean;
}) {
  const {
    copy,
    open,
    setOpen,
    input,
    setInput,
    messages,
    loading,
    error,
    scrollRef,
    inputRef,
    accentColor,
    headerTitle,
    sendMessage,
    handleKeyDown,
  } = panel;

  if (!open) return null;

  return (
    <div
      className={cn(
        "flex w-[min(100vw-3rem,24rem)] flex-col overflow-hidden rounded-sm border border-border bg-card shadow-2xl",
        "animate-in fade-in slide-in-from-bottom-4 duration-200",
        panelClassName,
      )}
      role="dialog"
      aria-label={copy.dialogAria}
    >
      <div
        className="flex items-center justify-between border-b border-border px-4 py-3 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-white/70">
            {demoContext && mode === "reservation" ? copy.demoEyebrow : copy.eyebrow}
          </p>
          <p className="text-sm font-medium">{headerTitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1.5 transition-colors hover:bg-white/10"
          aria-label={copy.closeLabel}
        >
          <X className="size-4" />
        </button>
      </div>

      {demoContext && mode === "reservation" ? (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-[11px] leading-snug text-amber-950">
          {copy.demoHint}
        </p>
      ) : null}

      <div ref={scrollRef} className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={cn(
              "max-w-[85%] rounded-sm px-3 py-2 text-sm leading-relaxed",
              msg.role === "user"
                ? "ml-auto text-white"
                : "mr-auto border border-border bg-background text-foreground/85",
            )}
            style={msg.role === "user" ? { backgroundColor: accentColor } : undefined}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto rounded-sm border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            {copy.typing}
          </div>
        )}
      </div>

      {error && (
        <p className="px-4 pb-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={copy.placeholder}
            rows={2}
            disabled={loading}
            className="min-h-[44px] resize-none border-border bg-background"
          />
          <Button
            type="button"
            size="icon"
            onClick={() => void sendMessage()}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-full text-white hover:opacity-90"
            style={{ backgroundColor: accentColor }}
            aria-label={copy.sendAria}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatbotPanel({ mode, placement, className, demoContext = false }: ChatbotPanelProps) {
  const panel = useChatbot(mode);
  const { copy, open, setOpen, accentColor } = panel;
  const Icon = mode === "sales" ? Headphones : MessageCircle;

  useEffect(() => {
    if (placement !== "floating") return;
    document.documentElement.classList.toggle("chatbot-open", open);
    return () => document.documentElement.classList.remove("chatbot-open");
  }, [open, placement]);

  useEffect(() => {
    if (mode !== "sales" || placement !== "floating") return;
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_SALES_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SALES_CHAT_EVENT, onOpen);
  }, [mode, placement, setOpen]);

  if (placement === "inline") {
    return (
      <div className={cn("relative flex flex-col items-center", className)}>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] sm:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2">
              <ChatDialog mode={mode} panel={panel} demoContext={demoContext} />
            </div>
          </>
        )}
        <Button
          type="button"
          size="lg"
          onClick={() => setOpen((v) => !v)}
          className="h-14 rounded-full px-6 text-white shadow-lg hover:opacity-90"
          style={{ backgroundColor: accentColor }}
          aria-expanded={open}
          aria-label={open ? copy.closeAria : copy.openAria}
        >
          <MessageCircle className="size-5" />
          <span>{open ? copy.closeLabel : demoContext ? copy.demoOpenLabel : copy.openLabel}</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3", className)}>
        <ChatDialog mode={mode} panel={panel} demoContext={demoContext} />

        <Button
          type="button"
          size="lg"
          onClick={() => setOpen((v) => !v)}
          className="h-14 rounded-full px-5 text-white shadow-lg hover:opacity-90"
          style={{ backgroundColor: accentColor }}
          aria-expanded={open}
          aria-label={open ? copy.closeAria : copy.openAria}
        >
          <Icon className="size-5" />
          <span className="hidden sm:inline">
            {open ? copy.closeLabel : demoContext ? copy.demoOpenLabel : copy.openLabel}
          </span>
        </Button>
      </div>
    </>
  );
}

/** Restadigi sales / customer-service bot — every page, bottom right */
export const OPEN_SALES_CHAT_EVENT = "restadigi:open-sales-chat";

export function openSalesChatbot() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_SALES_CHAT_EVENT));
}

export function ChatbotWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Demo pública: mismo bot de reserva en landing y en el dashboard (para probarlo)
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") return null;
    return <ChatbotPanel mode="reservation" placement="floating" demoContext />;
  }
  return <ChatbotPanel mode="sales" placement="floating" />;
}

/** Table booking demo bot — only on pöytävarauspalvelu hero */
export function BookingChatbotButton({ className }: { className?: string }) {
  return <ChatbotPanel mode="reservation" placement="inline" className={className} />;
}
