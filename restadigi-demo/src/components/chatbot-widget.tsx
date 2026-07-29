import { useRouterState } from "@tanstack/react-router";
import { Headphones, RefreshCw, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import restadigiIcon from "@/assets/restadigi-logo-icon.png";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocale, useMessages } from "@/i18n";
import type { ChatMessage } from "@/lib/chatbot-prompt";
import {
  accentChipText,
  accentHintBackground,
  accentPanelBackground,
  accentSoftBorder,
  readDemoTheme,
  subscribeDemoTheme,
} from "@/lib/demo-theme";
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
  placement: "floating" | "inline";
  className?: string;
  demoContext?: boolean;
};

const FALLBACK_ACCENT = "#c46a32";
const SALES_ACCENT = "#c46a32";

function useChatbot(mode: ChatMode, demoContext: boolean) {
  const t = useMessages();
  const { locale } = useLocale();
  const copy = mode === "sales" ? t.widget.sales : t.widget.booking;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [siteSettings, setSiteSettings] = useState<PublicRestaurantSettings | null>(null);
  const [liveAccent, setLiveAccent] = useState<string | null>(() => readDemoTheme()?.accentColor ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(() => getChatSessionId(mode));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const accentColor =
    mode === "reservation"
      ? liveAccent || siteSettings?.accentColor || FALLBACK_ACCENT
      : SALES_ACCENT;

  // Demo: always follow language selector (never force Finnish DB welcome)
  const welcomeText = copy.welcome;
  const headerTitle = copy.title;

  useEffect(() => {
    return subscribeDemoTheme((theme) => {
      if (theme.accentColor) setLiveAccent(theme.accentColor);
    });
  }, []);

  useEffect(() => {
    if (mode !== "reservation") return;

    function loadSettings() {
      void fetch("/api/restaurant/settings")
        .then(async (res) => {
          if (!res.ok) return null;
          return res.json() as Promise<{ settings: PublicRestaurantSettings }>;
        })
        .then((data) => {
          if (data?.settings) {
            setSiteSettings(data.settings);
            if (!readDemoTheme()?.accentColor && data.settings.accentColor) {
              setLiveAccent(data.settings.accentColor);
            }
          }
        })
        .catch(() => undefined);
    }

    loadSettings();
    if (open) loadSettings();
  }, [mode, open]);

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
    accentColor,
    headerTitle,
    welcomeText,
    demoContext,
    sendMessage,
    handleKeyDown,
    resetConversation,
  };
}

function ChatDialog({
  panel,
  panelClassName,
}: {
  panel: ReturnType<typeof useChatbot>;
  panelClassName?: string;
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
    demoContext,
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
  const chipColor = accentChipText(accentColor);

  return (
    <div
      className={cn(
        "flex w-[min(100vw-1.25rem,22.5rem)] flex-col overflow-hidden rounded-2xl text-white shadow-2xl",
        "animate-in fade-in slide-in-from-bottom-4 duration-200",
        panelClassName,
      )}
      style={{
        background: accentPanelBackground(accentColor),
        border: `1px solid ${accentSoftBorder(accentColor)}`,
      }}
      role="dialog"
      aria-label={copy.dialogAria}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src={restadigiIcon}
            alt="Restadigi"
            className="size-9 shrink-0 rounded-full border border-white/20 object-cover shadow-sm"
            style={{ backgroundColor: accentColor }}
          />
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold tracking-[0.14em]"
              style={{ color: accentColor }}
            >
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
        <p
          className="mx-3 mb-1 rounded-lg px-3 py-1.5 text-[11px] leading-snug text-white/85"
          style={{
            background: accentHintBackground(accentColor),
            border: `1px solid ${accentSoftBorder(accentColor)}`,
          }}
        >
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
                className="mb-0.5 size-8 shrink-0 rounded-full border border-white/15 object-cover"
                style={{ backgroundColor: accentColor }}
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
              className="size-8 shrink-0 rounded-full border border-white/15 object-cover"
              style={{ backgroundColor: accentColor }}
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
                className="rounded-full px-3 py-1.5 text-xs font-medium transition hover:brightness-110"
                style={{
                  color: chipColor,
                  border: `1px solid ${accentSoftBorder(accentColor)}`,
                  background: "rgba(0,0,0,0.35)",
                }}
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

      <div
        className="p-3"
        style={{
          borderTop: `1px solid ${accentSoftBorder(accentColor)}`,
          background: "rgba(0,0,0,0.28)",
        }}
      >
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
            style={{ backgroundColor: accentColor }}
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
  const panel = useChatbot(mode, demoContext);
  const { copy, open, setOpen, accentColor } = panel;
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
              <ChatDialog panel={panel} />
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

      <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6", className)}>
        <ChatDialog panel={panel} />

        <Button
          type="button"
          size="lg"
          onClick={() => setOpen((v) => !v)}
          className="h-12 rounded-full px-4 text-white shadow-lg hover:opacity-90 sm:h-14 sm:px-5"
          style={{ backgroundColor: accentColor }}
          aria-expanded={open}
          aria-label={open ? copy.closeAria : copy.openAria}
        >
          <Headphones className="size-5" />
          <span className="hidden sm:inline">{open ? copy.closeLabel : openLabel}</span>
        </Button>
      </div>
    </>
  );
}

export const OPEN_SALES_CHAT_EVENT = "restadigi:open-sales-chat";

export function openSalesChatbot() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_SALES_CHAT_EVENT));
}

export function ChatbotWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/dashboard/login") return null;

  const host =
    typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
  const isChatShowcase =
    pathname.startsWith("/restachat") || host.startsWith("chat.");

  if (isChatShowcase) {
    return <ChatbotPanel mode="sales" placement="floating" demoContext />;
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/hotel") ||
    pathname.startsWith("/dashboard")
  ) {
    return <ChatbotPanel mode="reservation" placement="floating" demoContext />;
  }

  return <ChatbotPanel mode="sales" placement="floating" />;
}

export function BookingChatbotButton({ className }: { className?: string }) {
  return <ChatbotPanel mode="reservation" placement="inline" className={className} demoContext />;
}
