import { AppShell } from "@/components/shell/app-shell";
import { PageHeaderBar } from "@/components/feed/page-header-bar";
import { MessagesUI } from "./messages-ui";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const me = getSessionUserId();
  // Surface a few seeded contacts for the mock inbox
  const contacts = await prisma.user.findMany({
    where: me ? { id: { not: me } } : {},
    take: 6,
    orderBy: { followers: { _count: "desc" } },
  });
  return (
    <AppShell>
      <PageHeaderBar title="Messages" subtitle="A quiet space for one-to-one chats" />
      <MessagesUI
        contacts={contacts.map((c) => ({
          id: c.id,
          username: c.username,
          displayName: c.displayName,
          avatarUrl: c.avatarUrl,
          isVerified: c.isVerified,
        }))}
        signedIn={!!me}
      />
    </AppShell>
  );
}
