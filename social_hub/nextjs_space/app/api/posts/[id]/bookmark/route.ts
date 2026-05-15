import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.bookmark.upsert({
    where: { userId_postId: { userId: me, postId: params.id } },
    create: { userId: me, postId: params.id },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.bookmark
    .delete({ where: { userId_postId: { userId: me, postId: params.id } } })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}
