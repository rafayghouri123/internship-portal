import crypto from "node:crypto";
import { SignedSessionPayload } from "@/lib/test/types";

const SESSION_COOKIE = "test_session_token";
const TOKEN_VERSION = "v1";

function getSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret";
}

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSignedTestSession(payload: SignedSessionPayload) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const data = `${TOKEN_VERSION}.${body}`;
  const signature = sign(data);
  return `${data}.${signature}`;
}

export function verifySignedTestSession(token: string | null | undefined): SignedSessionPayload | null {
  if (!token) {
    return null;
  }

  const [version, body, signature] = token.split(".");
  if (!version || !body || !signature || version !== TOKEN_VERSION) {
    return null;
  }

  const data = `${version}.${body}`;
  const expected = sign(data);
  if (expected !== signature) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(body)) as SignedSessionPayload;
  } catch {
    return null;
  }
}

export function sessionTokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const testSessionCookieName = SESSION_COOKIE;
