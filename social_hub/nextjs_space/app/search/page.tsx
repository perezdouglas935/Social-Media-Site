import { AppShell } from "@/components/shell/app-shell";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";
import { PostCard } from "@/components/feed/post-card";
import { UserCard } from "@/components/user/user-card";
import { Search as SearchIcon, Hash } from "lucide-react";
import { SearchTabs } from "./search-tabs";
import { SearchHeader } from "./search-header";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; tab?: string };
}) {
  const me = getSessionUserId();
  const q = (searchParams.q ?? "").trim();
  const tab = (searchParams.tab ?? "top") as "top" | "posts" | "people";
  const isHashtag = q.startsWith("#");
  const term = isHashtag ? q.slice(1).toLowerCase() : q;

  let posts: any[] = [];
  let users: any[] = [];

  if (q) {
    const dbPosts = await prisma.post.findMany({
      where: { content: { contains: term, mode: "insensitive" } },
      include: postIncludeForFeed,
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const states = await getViewerStates(me, dbPosts.map((p) => p.id));
    posts = dbPosts.map((p) => serializePost(p, states));

    const dbUsers = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: term, mode: "insensitive" } },
          { displayName: { contains: term, mode: "insensitive" } },
        ],
      },
      take: 12,
    });
    let following = new Set<string>();
    if (me && dbUsers.length > 0) {
      const f = await prisma.follow.findMany({
        where: { followerId: me, followingId: { in: dbUsers.map((u) => u.id) } },
        select: { followingId: true },
      });
      following = new Set(f.map((x) => x.followingId));
    }
    users = dbUsers.map((u) => ({
      ...u,
      initiallyFollowing: following.has(u.id),
    }));
  }

  return (
    <AppShell>
      <PageHeaderBar
        title={q ? `Results for ${q}` : "Search"}
        subtitle={q ? `${posts.length} posts · ${users.length} people` : "Find people, hashtags, and posts"}
        showBack
      />
      <SearchHeader initialQuery={q} />
      {!q ? (
        <div className="py-16 text-center px-6">
          <SearchIcon className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Try searching for something</h2>
          <p className="text-sm text-muted-foreground">Use #hashtag for topics, @handle for people, or keywords for posts.</p>
        </div>
      ) : (
        <SearchTabs query={q} initialTab={tab} posts={posts} users={users} hashtag={isHashtag ? term : null} />
      )}
    </AppShell>
  );
}
