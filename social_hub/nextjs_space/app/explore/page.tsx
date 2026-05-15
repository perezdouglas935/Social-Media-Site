import { AppShell } from "@/components/shell/app-shell";
import { PostCard } from "@/components/feed/post-card";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { Hash, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const me = getSessionUserId();

  // Top posts by like count + recency
  const topPosts = await prisma.post.findMany({
    where: { parentId: null },
    include: postIncludeForFeed,
    orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
    take: 12,
  });
  const states = await getViewerStates(me, topPosts.map((p) => p.id));
  const posts = topPosts.map((p) => serializePost(p, states));

  const trending = await prisma.hashtag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
    take: 12,
  });

  return (
    <AppShell>
      <PageHeaderBar title="Explore" subtitle="Top conversations across Social Hub right now" />
      <section className="px-4 py-5 border-b border-border/60 ambient-violet">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <TrendingUp className="h-4 w-4" />
          Trending topics
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {trending.map((t) => (
            <Link
              key={t.id}
              href={`/search?q=${encodeURIComponent("#" + t.tag)}`}
              className="group flex items-center gap-1.5 rounded-full bg-secondary hover:bg-primary/15 hover:text-primary border border-border/60 hover:border-primary/40 px-3 py-1.5 text-sm transition"
            >
              <Hash className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
              <span className="font-semibold">{t.tag}</span>
              <span className="text-xs text-muted-foreground">{formatNumber(t._count.posts)}</span>
            </Link>
          ))}
          {trending.length === 0 && <div className="text-sm text-muted-foreground">No hashtags yet.</div>}
        </div>
      </section>
      <section>
        <div className="px-4 py-3 flex items-center gap-2 text-sm font-semibold border-b border-border/60">
          <Sparkles className="h-4 w-4 text-primary" />
          Top posts
        </div>
        <div>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
