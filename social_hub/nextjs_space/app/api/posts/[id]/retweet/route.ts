import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { id: true, authorId: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.retweet.upsert({
    where: { userId_postId: { userId: me, postId: params.id } },
    create: { userId: me, postId: params.id },
    update: {},
  });
  if (post.authorId !== me) {
    await prisma.notification.create({
      data: { userId: post.authorId, actorId: me, type: "RETWEET", postId: post.id },
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.retweet
    .delete({ where: { userId_postId: { userId: me, postId: params.id } } })
    .catch(() => {});
  return NextResponse.json({ ok: true });
}
