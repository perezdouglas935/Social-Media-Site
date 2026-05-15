"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, MessageSquare, User as UserIcon, Bookmark, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { useState } from "react";
import { CreateDemoModal } from "@/components/providers/create-demo-modal";
import { ComposeDialog } from "@/components/feed/compose-dialog";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore", icon: Compass, href: "/explore" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { user } = useSession();
  const [demoOpen, setDemoOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)] py-4 pr-4 w-56 shrink-0">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-[15px] transition group ${
                active
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-foreground/85 hover:bg-secondary/70 hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
        {user && (
          <Link
            href={`/${user.username}`}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-[15px] transition ${
              pathname === `/${user.username}`
                ? "bg-secondary text-foreground font-semibold"
                : "text-foreground/85 hover:bg-secondary/70 hover:text-foreground"
            }`}
          >
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
          </Link>
        )}
      </nav>
      <div className="mt-4">
        <Button
          size="lg"
          className="w-full rounded-full font-semibold gap-2 glow-violet hover:glow-violet-lg transition"
          onClick={() => (user ? setComposeOpen(true) : setDemoOpen(true))}
        >
          <PenSquare className="h-4 w-4" />
          {user ? "Post" : "Join to post"}
        </Button>
      </div>
      {user && (
        <Link
          href={`/${user.username}`}
          className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-secondary transition"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatarUrl ?? ""} alt={user.displayName} className="h-10 w-10 rounded-full object-cover ring-1 ring-border" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user.displayName}</div>
            <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
          </div>
        </Link>
      )}
      <CreateDemoModal open={demoOpen} onOpenChange={setDemoOpen} />
      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
    </aside>
  );
}
