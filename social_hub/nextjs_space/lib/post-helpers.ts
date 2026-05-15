import { prisma } from "./db";
import { ApiPost } from "./types";
import { Prisma } from "@prisma/client";

const includeForFeed = {
  author: true,
  parent: { include: { author: true } },
  _count: { select: { likes: true, retweets: true, bookmarks: true, replies: true } },
} satisfies Prisma.PostInclude;

type PostWithIncludes = Prisma.PostGetPayload<{ include: typeof includeForFeed }>;

export function serializePost(
  p: PostWithIncludes,
  viewerStates: { liked: Set<string>; retweeted: Set<string>; bookmarked: Set<string> },
): ApiPost {
  return {
    id: p.id,
    content: p.content,
    imageUrl: p.imageUrl,
    parentId: p.parentId,
    createdAt: p.createdAt.toISOString(),
    author: {
      id: p.author.id,
      username: p.author.username,
      displayName: p.author.displayName,
      bio: p.author.bio,
      avatarUrl: p.author.avatarUrl,
      isDemo: p.author.isDemo,
      isVerified: p.author.isVerified,
    },
    parent: p.parent
      ? {
          id: p.parent.id,
          author: {
            username: p.parent.author.username,
            displayName: p.parent.author.displayName,
            avatarUrl: p.parent.author.avatarUrl,
          },
        }
      : null,
    counts: {
      likes: p._count.likes,
      retweets: p._count.retweets,
      bookmarks: p._count.bookmarks,
      replies: p._count.replies,
    },
    viewer: {
      liked: viewerStates.liked.has(p.id),
      retweeted: viewerStates.retweeted.has(p.id),
      bookmarked: viewerStates.bookmarked.has(p.id),
    },
  };
}

export async function getViewerStates(viewerId: string | null, postIds: string[]) {
  if (!viewerId || postIds.length === 0) {
    return {
      liked: new Set<string>(),
      retweeted: new Set<string>(),
      bookmarked: new Set<string>(),
    };
  }
  const [likes, retweets, bookmarks] = await Promise.all([
    prisma.like.findMany({ where: { userId: viewerId, postId: { in: postIds } }, select: { postId: true } }),
    prisma.retweet.findMany({ where: { userId: viewerId, postId: { in: postIds } }, select: { postId: true } }),
    prisma.bookmark.findMany({ where: { userId: viewerId, postId: { in: postIds } }, select: { postId: true } }),
  ]);
  return {
    liked: new Set(likes.map((l) => l.postId)),
    retweeted: new Set(retweets.map((r) => r.postId)),
    bookmarked: new Set(bookmarks.map((b) => b.postId)),
  };
}

export const postIncludeForFeed = includeForFeed;
