import crypto from "node:crypto";
import { cookies, headers } from "next/headers";

const SECRET = process.env.ADMIN_SESSION_SECRET ?? "prasanna-trends-local-dev-secret";
const COOKIE = "pt_admin";
/** 8 hour session timeout (SRS 13.1). */
export const SESSION_MAX_AGE = 60 * 60 * 8;

export const DEMO_ADMIN = {
  email: "admin@prasannatrends.in",
  password: "admin123",
  name: "Prasanna Admin",
};

export type AdminSession = { email: string; name: string; issuedAt: number };

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function hashPassword(plain: string) {
  return crypto.createHash("sha256").update(`${SECRET}:${plain}`).digest("hex");
}

export function createToken(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = sign(payload);
  if (mac.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (Date.now() - session.issuedAt > SESSION_MAX_AGE * 1000) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export async function setAdminCookie(session: AdminSession) {
  const jar = await cookies();
  jar.set(COOKIE, createToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function requestMeta() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "127.0.0.1";
  const ua = h.get("user-agent") ?? "unknown";
  const device = /iPhone|Android|iPad/i.test(ua)
    ? "Mobile browser"
    : /Mac/i.test(ua)
      ? "macOS · Desktop"
      : /Windows/i.test(ua)
        ? "Windows · Desktop"
        : "Desktop browser";
  return { ip, device };
}
