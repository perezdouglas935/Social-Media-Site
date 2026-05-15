import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const me = getSessionUserId();
  if (!q) return NextResponse.json({ posts: [], users: [], hashtag: null });

  const isHashtag = q.startsWith("#");
  const term = isHashtag ? q.slice(1).toLowerCase() : q;

  // posts: content contains term (case insensitive)
  const posts = await prisma.post.findMany({
    where: { content: { contains: term, mode: "insensitive" } },
    include: postIncludeForFeed,
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const states = await getViewerStates(me, posts.map((p) => p.id));

  // users: match username or displayName
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: term, mode: "insensitive" } },
        { displayName: { contains: term, mode: "insensitive" } },
      ],
    },
    take: 12,
    include: { _count: { select: { followers: true } } },
  });

  let following: Set<string> = new Set();
  if (me && users.length > 0) {
    const f = await prisma.follow.findMany({
      where: { followerId: me, followingId: { in: users.map((u) => u.id) } },
      select: { followingId: true },
    });
    following = new Set(f.map((x) => x.followingId));
  }

  return NextResponse.json({
    posts: posts.map((p) => serializePost(p, states)),
    users: users.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      bio: u.bio,
      avatarUrl: u.avatarUrl,
      isVerified: u.isVerified,
      isDemo: u.isDemo,
      followerCount: u._count.followers,
      initiallyFollowing: following.has(u.id),
    })),
    hashtag: isHashtag ? term : null,
  });
}
