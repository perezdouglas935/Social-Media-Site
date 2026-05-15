import { AppShell } from "@/components/shell/app-shell";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";
import { notFound } from "next/navigation";
import { ThreadView } from "./thread-view";

export const dynamic = "force-dynamic";

async function buildAncestors(startId: string) {
  const chain: any[] = [];
  let current = await prisma.post.findUnique({
    where: { id: startId },
    include: postIncludeForFeed,
  });
  while (current?.parentId) {
    const parent = await prisma.post.findUnique({
      where: { id: current.parentId },
      include: postIncludeForFeed,
    });
    if (!parent) break;
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const me = getSessionUserId();
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: postIncludeForFeed,
  });
  if (!post) notFound();

  const ancestors = await buildAncestors(post.id);
  const replies = await prisma.post.findMany({
    where: { parentId: post.id },
    include: postIncludeForFeed,
    orderBy: { createdAt: "asc" },
  });

  const all = [...ancestors, post, ...replies];
  const states = await getViewerStates(
    me,
    all.map((p) => p.id),
  );

  return (
    <AppShell>
      <PageHeaderBar title="Post" subtitle={`@${post.author.username}`} showBack />
      <ThreadView
        ancestors={ancestors.map((p) => serializePost(p, states))}
        post={serializePost(post, states)}
        initialReplies={replies.map((p) => serializePost(p, states))}
      />
    </AppShell>
  );
}
