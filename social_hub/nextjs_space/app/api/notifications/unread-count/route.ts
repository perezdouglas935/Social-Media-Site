import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ count: 0 });
  const count = await prisma.notification.count({ where: { userId: me, read: false } });
  return NextResponse.json({ count });
}
