import Link from "next/link";
import { TrendingUp, Hash, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { WhoToFollowList } from "@/components/user/who-to-follow";
import { formatNumber } from "@/lib/format";

export async function RightSidebar() {
  const me = getSessionUserId();

  // Trending hashtags by post count
  const trending = await prisma.hashtag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
    take: 6,
  });

  // Suggested users — not the current user, ordered by follower count desc
  const userExclude = me ? [me] : [];
  const followingIds = me
    ? (await prisma.follow.findMany({ where: { followerId: me }, select: { followingId: true } })).map(
        (f) => f.followingId,
      )
    : [];
  const suggestions = await prisma.user.findMany({
    where: { id: { notIn: [...userExclude, ...followingIds] } },
    include: { _count: { select: { followers: true } } },
    orderBy: { followers: { _count: "desc" } },
    take: 4,
  });

  return (
    <aside className="hidden xl:flex flex-col gap-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-4 pl-4 w-80 shrink-0">
      <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border/60">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Trending</h2>
        </div>
        <ul>
          {trending.length === 0 && (
            <li className="px-4 py-4 text-sm text-muted-foreground">No trends yet — start a conversation.</li>
          )}
          {trending.map((t, i) => (
            <li key={t.id}>
              <Link
                href={`/search?q=${encodeURIComponent("#" + t.tag)}`}
                className="flex items-start justify-between gap-2 px-4 py-3 hover:bg-secondary/60 transition group"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground font-medium">Trending · #{i + 1}</div>
                  <div className="text-[15px] font-semibold mt-0.5 truncate group-hover:text-primary transition">
                    #{t.tag}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatNumber(t._count.posts)} {t._count.posts === 1 ? "post" : "posts"}
                  </div>
                </div>
                <Hash className="h-4 w-4 text-muted-foreground/60 mt-1 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border/60">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">Who to follow</h2>
        </div>
        <WhoToFollowList
          users={suggestions.map((u) => ({
            id: u.id,
            username: u.username,
            displayName: u.displayName,
            bio: u.bio,
            avatarUrl: u.avatarUrl,
            isVerified: u.isVerified,
            followerCount: u._count.followers,
            initiallyFollowing: false,
          }))}
        />
      </div>

      <div className="px-4 text-[11px] text-muted-foreground/80 leading-relaxed">
        Social Hub is a portfolio demo. Accounts are labeled “Demo” — anyone can browse, and creating a demo account lets you post and interact.
      </div>
    </aside>
  );
}
