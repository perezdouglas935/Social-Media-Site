import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

// Convenience: switch demo session to an existing seeded user (used by 'sign in as' helper).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = String(body?.username ?? "").trim().toLowerCase();
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  await setSessionCookie(user.id);
  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      isDemo: user.isDemo,
      isVerified: user.isVerified,
    },
  });
}
