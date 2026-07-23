import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "restadigi_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  email: string;
  exp: number;
};

export function isPublicDemo() {
  const v = String(process.env.PUBLIC_DEMO || "").toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    if (isPublicDemo()) {
      return "public-demo-session-secret-min16";
    }
    throw new Error("SESSION_SECRET must be set (min 16 characters)");
  }
  return secret;
}

function sign(data: string) {
  return createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}

export function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  try {
    const expected = sign(data);
    if (
      signature.length !== expected.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return verifySessionToken(match?.[1]);
}

export function sessionCookieHeader(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearSessionCookieHeader() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function verifyAdminCredentials(email: string, password: string) {
  if (isPublicDemo()) return true;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}

export function requireAdmin(request: Request) {
  if (isPublicDemo()) {
    return {
      email: process.env.ADMIN_EMAIL || "demo@restadigi.public",
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    };
  }
  const session = getSessionFromRequest(request);
  if (!session) return null;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || session.email !== adminEmail) return null;
  return session;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
