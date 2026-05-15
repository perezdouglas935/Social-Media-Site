import { AppShell } from "@/components/shell/app-shell";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import Link from "next/link";
import { Heart, Repeat2, MessageCircle, UserPlus, AtSign, Bell, BadgeCheck } from "lucide-react";
import { timeAgo } from "@/lib/format";
import { MarkReadOnMount } from "./mark-read";

export const dynamic = "force-dynamic";

const typeMap: Record<string, { icon: any; color: string; verb: string }> = {
  LIKE: { icon: Heart, color: "text-red-500", verb: "liked your post" },
  RETWEET: { icon: Repeat2, color: "text-emerald-400", verb: "reposted your post" },
  REPLY: { icon: MessageCircle, color: "text-primary", verb: "replied to your post" },
  FOLLOW: { icon: UserPlus, color: "text-primary", verb: "started following you" },
  MENTION: { icon: AtSign, color: "text-primary", verb: "mentioned you in a post" },
};

export default async function NotificationsPage() {
  const me = getSessionUserId();
  if (!me) {
    return (
      <AppShell>
        <PageHeaderBar title="Notifications" />
        <div className="py-16 text-center px-6">
          <Bell className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">You’re browsing as a guest</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Create a demo account from the header to receive likes, replies, and follows on your posts.
          </p>
        </div>
      </AppShell>
    );
  }

  const notifs = await prisma.notification.findMany({
    where: { userId: me },
    include: {
      actor: true,
      post: { select: { id: true, content: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AppShell>
      <PageHeaderBar title="Notifications" subtitle="All your activity in one place" />
      <MarkReadOnMount />
      {notifs.length === 0 ? (
        <div className="py-16 text-center px-6">
          <Bell className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-1">No notifications yet</h2>
          <p className="text-sm text-muted-foreground">When people interact with your posts, you’ll see it here.</p>
        </div>
      ) : (
        <ul>
          {notifs.map((n) => {
            const meta = typeMap[n.type];
            const Icon = meta.icon;
            const href = n.post ? `/post/${n.post.id}` : `/${n.actor.username}`;
            return (
              <li key={n.id}>
                <Link
                  href={href}
                  className={`flex items-start gap-3 px-4 py-4 hover:bg-secondary/40 transition border-b border-border/60 ${
                    n.read ? "" : "bg-primary/5"
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    <Icon className={`h-5 w-5 ${meta.color}`} fill={n.type === "LIKE" ? "currentColor" : "none"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={n.actor.avatarUrl ?? ""} alt={n.actor.displayName} className="h-8 w-8 rounded-full object-cover ring-1 ring-border" />
                    </div>
                    <div className="mt-2 text-sm">
                      <Link
                        href={`/${n.actor.username}`}
                        className="inline-flex items-center gap-1 font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {n.actor.displayName}
                        {n.actor.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                      </Link>{" "}
                      <span className="text-foreground/80">{meta.verb}</span>
                      <span className="text-muted-foreground"> · {timeAgo(n.createdAt)}</span>
                    </div>
                    {n.post?.content && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{n.post.content}</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
