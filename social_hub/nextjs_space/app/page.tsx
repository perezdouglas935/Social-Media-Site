import { AppShell } from "@/components/shell/app-shell";
import { Feed } from "@/components/feed/feed";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const me = getSessionUserId();
  const posts = await prisma.post.findMany({
    where: { parentId: null },
    include: postIncludeForFeed,
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const states = await getViewerStates(me, posts.map((p) => p.id));
  const initialPosts = posts.map((p) => serializePost(p, states));

  return (
    <AppShell>
      <Feed initialPosts={initialPosts} scope="all" />
    </AppShell>
  );
}
