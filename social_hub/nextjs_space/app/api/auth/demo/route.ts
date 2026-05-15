import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const username = String(body?.username ?? "").trim().toLowerCase();
    const displayName = String(body?.displayName ?? "").trim();
    const bio = body?.bio ? String(body.bio).trim() : null;
    const avatarUrl = body?.avatarUrl ? String(body.avatarUrl) : null;

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    if (!displayName || displayName.length > 40) {
      return NextResponse.json({ error: "Invalid display name" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: { username, displayName, bio, avatarUrl, isDemo: true },
    });
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
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
