import { useRouterState } from "@tanstack/react-router";
import { Headphones, RefreshCw, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import restadigiIcon from "@/assets/restadigi-logo-icon.png";
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
  /** Public demo: booking-oriented labels */
  demoContext?: boolean;
};

const BROWN = "#432f24";
const ORANGE = "#c46a32";

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

  // Demo booking uses brand brown chrome like Resta-AI; orange for accents/user bubbles
  const chromeColor = BROWN;
  const accentColor =
    mode === "reservation" ? (siteSettings?.accentColor ?? ORANGE) : ORANGE;

  const welcomeText =
    mode === "reservation" && locale === "fi" && siteSettings?.chatbotWelcomeMessage
      ? siteSettings.chatbotWelcomeMessage
      : copy.welcome;

  const headerTitle = copy.title;

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

  function resetConversation() {
    setMessages([{ role: "assistant", content: welcomeText }]);
    setSessionId(null);
    setError(null);
    setInput("");
  }

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

  async function sendMessage(rawText?: string) {
    const text = (rawText ?? input).trim();
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
    mode,
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
    chromeColor,
    accentColor,
    headerTitle,
    welcomeText,
    sendMessage,
    handleKeyDown,
    resetConversation,
  };
}

function ChatDialog({
  panel,
  panelClassName,
  demoContext = false,
}: {
  panel: ReturnType<typeof useChatbot>;
  panelClassName?: string;
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
    welcomeText,
    sendMessage,
    handleKeyDown,
    resetConversation,
  } = panel;

  if (!open) return null;

  const showQuickReplies =
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    messages[0]?.content === welcomeText &&
    !loading &&
    copy.quickReplies.length > 0;

  const subtitle = demoContext ? copy.demoSubtitle : headerTitle;

  return (
    <div
      className={cn(
        "flex w-[min(100vw-2.5rem,22.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#2a2018] text-white shadow-2xl",
        "animate-in fade-in slide-in-from-bottom-4 duration-200",
        panelClassName,
      )}
      role="dialog"
      aria-label={copy.dialogAria}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src={restadigiIcon}
            alt="Restadigi"
            className="size-9 shrink-0 rounded-full border border-white/20 bg-[#432f24] object-cover shadow-sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.14em]" style={{ color: ORANGE }}>
              {copy.eyebrow}
            </p>
            <p className="truncate text-xs text-white/55">{subtitle}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={resetConversation}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label={copy.resetAria}
          >
            <RefreshCw className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label={copy.closeLabel}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {demoContext && copy.demoHint ? (
        <p className="mx-3 mb-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] leading-snug text-amber-100/90">
          {copy.demoHint}
        </p>
      ) : null}

      <div
        ref={scrollRef}
        className="flex max-h-[min(55vh,28rem)] flex-col gap-3 overflow-y-auto px-3 pb-3"
      >
        {messages.map((msg, i) =>
          msg.role === "assistant" ? (
            <div key={`a-${i}`} className="flex items-end gap-2">
              <img
                src={restadigiIcon}
                alt=""
                className="mb-0.5 size-8 shrink-0 rounded-full border border-white/15 bg-[#432f24] object-cover"
              />
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#1a1512] shadow-sm">
                {msg.content}
              </div>
            </div>
          ) : (
            <div
              key={`u-${i}`}
              className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {msg.content}
            </div>
          ),
        )}
        {loading && (
          <div className="flex items-end gap-2">
            <img
              src={restadigiIcon}
              alt=""
              className="size-8 shrink-0 rounded-full border border-white/15 bg-[#432f24] object-cover"
            />
            <div className="rounded-2xl bg-white/90 px-3.5 py-2.5 text-sm text-[#5c534c]">
              {copy.typing}
            </div>
          </div>
        )}

        {showQuickReplies ? (
          <div className="mt-1 flex flex-wrap justify-end gap-2">
            {copy.quickReplies.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={loading}
                onClick={() => void sendMessage(item.message)}
                className="rounded-full border border-[rgba(196,106,50,0.55)] bg-[#1a1512]/70 px-3 py-1.5 text-xs font-medium text-[color:#e8a05a] transition hover:border-[rgba(196,106,50,0.9)] hover:bg-[#432f24]"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {error && (
        <p className="px-4 pb-2 text-xs text-red-300" role="alert">
          {error}
        </p>
      )}

      <div className="border-t border-white/10 bg-[#1a1512]/50 p-3">
        <div className="flex items-end gap-2 rounded-2xl bg-white p-1.5 shadow-inner">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={copy.placeholder}
            rows={1}
            disabled={loading}
            className="max-h-28 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-[#1a1512] shadow-none focus-visible:ring-0"
          />
          <Button
            type="button"
            size="icon"
            onClick={() => void sendMessage()}
            disabled={loading || !input.trim()}
            className="mb-0.5 size-9 shrink-0 rounded-full text-white hover:opacity-90"
            style={{ backgroundColor: ORANGE }}
            aria-label={copy.sendAria}
          >
            <Send className="size-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] tracking-wide text-white/40">{headerTitle}</p>
      </div>
    </div>
  );
}

function ChatbotPanel({ mode, placement, className, demoContext = false }: ChatbotPanelProps) {
  const panel = useChatbot(mode);
  const { copy, open, setOpen, chromeColor } = panel;
  const Icon = Headphones;
  const openLabel = demoContext ? copy.demoOpenLabel : copy.openLabel;

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
              <ChatDialog panel={panel} demoContext={demoContext} />
            </div>
          </>
        )}
        <Button
          type="button"
          size="lg"
          onClick={() => setOpen((v) => !v)}
          className="h-14 rounded-full px-6 text-white shadow-lg hover:opacity-90"
          style={{ backgroundColor: chromeColor }}
          aria-expanded={open}
          aria-label={open ? copy.closeAria : copy.openAria}
        >
          <Headphones className="size-5" />
          <span>{open ? copy.closeLabel : openLabel}</span>
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
        <ChatDialog panel={panel} demoContext={demoContext} />

        <Button
          type="button"
          size="lg"
          onClick={() => setOpen((v) => !v)}
          className="h-14 rounded-full px-5 text-white shadow-lg hover:opacity-90"
          style={{ backgroundColor: chromeColor }}
          aria-expanded={open}
          aria-label={open ? copy.closeAria : copy.openAria}
        >
          <Icon className="size-5" />
          <span className="hidden sm:inline">{open ? copy.closeLabel : openLabel}</span>
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
  // Demo pública: mismo Resta-AI (modo reserva) en landing y dashboard
  if (pathname === "/" || pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") return null;
    return <ChatbotPanel mode="reservation" placement="floating" demoContext />;
  }
  return <ChatbotPanel mode="sales" placement="floating" />;
}

/** Table booking demo bot — only on pöytävarauspalvelu hero */
export function BookingChatbotButton({ className }: { className?: string }) {
  return <ChatbotPanel mode="reservation" placement="inline" className={className} demoContext />;
}
