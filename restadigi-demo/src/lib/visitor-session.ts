export const VISITOR_SESSION_KEY = "restadigi_visitor_session";
export const CHAT_SESSION_KEY = "restadigi_chat_session";
export const SALES_CHAT_SESSION_KEY = "restadigi_sales_chat_session";
export const BOOKING_CHAT_SESSION_KEY = "restadigi_booking_chat_session";

export function getOrCreateVisitorSessionId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VISITOR_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_SESSION_KEY, id);
  }
  return id;
}

export function getChatSessionId(mode: "sales" | "reservation" = "sales") {
  if (typeof window === "undefined") return null;
  const key = mode === "reservation" ? BOOKING_CHAT_SESSION_KEY : SALES_CHAT_SESSION_KEY;
  return localStorage.getItem(key) ?? localStorage.getItem(CHAT_SESSION_KEY);
}

export function setChatSessionId(id: string, mode: "sales" | "reservation" = "sales") {
  if (typeof window === "undefined") return;
  const key = mode === "reservation" ? BOOKING_CHAT_SESSION_KEY : SALES_CHAT_SESSION_KEY;
  localStorage.setItem(key, id);
}
