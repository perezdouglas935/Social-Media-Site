import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ ok: true });
  await prisma.notification.updateMany({ where: { userId: me, read: false }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
