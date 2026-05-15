import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getViewerStates, postIncludeForFeed, serializePost } from "@/lib/post-helpers";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const me = getSessionUserId();
  const replies = await prisma.post.findMany({
    where: { parentId: params.id },
    include: postIncludeForFeed,
    orderBy: { createdAt: "asc" },
  });
  const states = await getViewerStates(
    me,
    replies.map((r) => r.id),
  );
  return NextResponse.json({ posts: replies.map((r) => serializePost(r, states)) });
}
