import { AppShell } from "@/components/shell/app-shell";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { notFound } from "next/navigation";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const handle = params.username.toLowerCase();
  const me = getSessionUserId();

  const user = await prisma.user.findUnique({
    where: { username: handle },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
  if (!user) notFound();

  const isFollowing = me
    ? !!(await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: me, followingId: user.id } },
      }))
    : false;

  // Posts (top-level only)
  const posts = await prisma.post.findMany({
    where: { authorId: user.id, parentId: null },
    include: postIncludeForFeed,
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  // Replies
  const replies = await prisma.post.findMany({
    where: { authorId: user.id, parentId: { not: null } },
    include: postIncludeForFeed,
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  // Media (only with images)
  const media = await prisma.post.findMany({
    where: { authorId: user.id, imageUrl: { not: null } },
    include: postIncludeForFeed,
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const all = [...posts, ...replies, ...media];
  const ids = Array.from(new Set(all.map((p) => p.id)));
  const states = await getViewerStates(me, ids);

  return (
    <AppShell>
      <PageHeaderBar
        title={user.displayName}
        subtitle={`${user._count.posts} ${user._count.posts === 1 ? "post" : "posts"}`}
        showBack
      />
      <ProfileHeader
        user={{
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          bannerUrl: user.bannerUrl,
          location: user.location,
          website: user.website,
          isVerified: user.isVerified,
          isDemo: user.isDemo,
          createdAt: user.createdAt.toISOString(),
          followerCount: user._count.followers,
          followingCount: user._count.following,
          postCount: user._count.posts,
          isFollowing,
          isMe: me === user.id,
        }}
      />
      <ProfileTabs
        posts={posts.map((p) => serializePost(p, states))}
        replies={replies.map((p) => serializePost(p, states))}
        media={media.map((p) => serializePost(p, states))}
      />
    </AppShell>
  );
}
