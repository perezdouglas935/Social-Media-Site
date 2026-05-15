import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: postIncludeForFeed,
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const states = await getViewerStates(me, [post.id]);
  return NextResponse.json({ post: serializePost(post, states) });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { authorId: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
