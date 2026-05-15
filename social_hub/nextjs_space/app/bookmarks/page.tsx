import { AppShell } from "@/components/shell/app-shell";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { PostCard } from "@/components/feed/post-card";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const me = getSessionUserId();
  if (!me) {
    return (
      <AppShell>
        <PageHeaderBar title="Bookmarks" />
        <div className="py-16 text-center px-6">
          <Bookmark className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">Save what you love</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Create a demo account to bookmark posts and revisit them anytime.
          </p>
        </div>
      </AppShell>
    );
  }
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: me },
    include: { post: { include: postIncludeForFeed } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const posts = bookmarks.map((b) => b.post);
  const states = await getViewerStates(me, posts.map((p) => p.id));
  return (
    <AppShell>
      <PageHeaderBar title="Bookmarks" subtitle="Posts you saved for later" />
      {posts.length === 0 ? (
        <div className="py-16 text-center px-6">
          <Bookmark className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">No bookmarks yet</h2>
          <p className="text-sm text-muted-foreground">Tap the bookmark icon on any post to save it here.</p>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={serializePost(p, states)} />)
      )}
    </AppShell>
  );
}
