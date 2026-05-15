import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { extractHashtags } from "@/lib/format";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") ?? "all";
  const limit = Math.min(50, parseInt(url.searchParams.get("limit") ?? "30", 10));
  const me = getSessionUserId();

  let where: any = { parentId: null };
  if (scope === "following" && me) {
    const following = await prisma.follow.findMany({
      where: { followerId: me },
      select: { followingId: true },
    });
    const ids = following.map((f) => f.followingId);
    ids.push(me);
    where = { parentId: null, authorId: { in: ids } };
  }

  const posts = await prisma.post.findMany({
    where,
    include: postIncludeForFeed,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  const states = await getViewerStates(
    me,
    posts.map((p) => p.id),
  );
  return NextResponse.json({ posts: posts.map((p) => serializePost(p, states)) });
}

export async function POST(request: Request) {
  const me = getSessionUserId();
  if (!me) return NextResponse.json({ error: "Sign in to post" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const content = String(body?.content ?? "").trim();
  const imageUrl = body?.imageUrl ? String(body.imageUrl) : null;
  const parentId = body?.parentId ? String(body.parentId) : null;

  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
  if (content.length > 280) return NextResponse.json({ error: "Max 280 characters" }, { status: 400 });

  let parent: { id: string; authorId: string } | null = null;
  if (parentId) {
    parent = await prisma.post.findUnique({ where: { id: parentId }, select: { id: true, authorId: true } });
    if (!parent) return NextResponse.json({ error: "Parent post not found" }, { status: 404 });
  }

  const created = await prisma.post.create({
    data: { authorId: me, content, imageUrl, parentId },
    include: postIncludeForFeed,
  });

  // hashtags
  const tags = extractHashtags(content);
  for (const tag of tags) {
    const ht = await prisma.hashtag.upsert({ where: { tag }, create: { tag }, update: {} });
    await prisma.postHashtag
      .create({ data: { postId: created.id, hashtagId: ht.id } })
      .catch(() => {});
  }

  // notify on reply
  if (parent && parent.authorId !== me) {
    await prisma.notification.create({
      data: { userId: parent.authorId, actorId: me, type: "REPLY", postId: created.id },
    });
  }

  // mention notifications
  const mentions = (content.match(/@[a-zA-Z0-9_]+/g) ?? []).map((m) => m.toLowerCase().slice(1));
  if (mentions.length > 0) {
    const mentioned = await prisma.user.findMany({
      where: { username: { in: mentions } },
      select: { id: true },
    });
    for (const u of mentioned) {
      if (u.id === me) continue;
      await prisma.notification.create({
        data: { userId: u.id, actorId: me, type: "MENTION", postId: created.id },
      });
    }
  }

  const states = await getViewerStates(me, [created.id]);
  return NextResponse.json({ post: serializePost(created, states) });
}
