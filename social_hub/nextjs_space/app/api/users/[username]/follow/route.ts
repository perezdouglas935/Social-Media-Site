import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: { username: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const target = await prisma.user.findUnique({ where: { username: params.username.toLowerCase() } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.id === me) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: me, followingId: target.id } },
    create: { followerId: me, followingId: target.id },
    update: {},
  });
  await prisma.notification
    .create({ data: { userId: target.id, actorId: me, type: "FOLLOW" } })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { username: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const target = await prisma.user.findUnique({ where: { username: params.username.toLowerCase() } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.follow
    .delete({ where: { followerId_followingId: { followerId: me, followingId: target.id } } })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}
