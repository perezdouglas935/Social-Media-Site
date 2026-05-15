import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE_NAME = "sh_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function setSessionCookie(userId: string) {
  const store = cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearSessionCookie() {
  const store = cookies();
  store.delete(COOKIE_NAME);
}

export function getSessionUserId(): string | null {
  try {
    const store = cookies();
    const token = store.get(COOKIE_NAME)?.value;
    return token ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = getSessionUserId();
  if (!userId) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}
