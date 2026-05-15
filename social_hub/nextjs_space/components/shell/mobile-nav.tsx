"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bell, MessageSquare, Bookmark, User as UserIcon, X, PenSquare } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore", icon: Compass, href: "/explore" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
];

export function MobileNav({
  open,
  onClose,
  onCreateDemo,
}: {
  open: boolean;
  onClose: () => void;
  onCreateDemo: () => void;
}) {
  const pathname = usePathname();
  const { user } = useSession();
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-72 p-0 bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Logo />
          <button onClick={onClose} className="p-2 rounded-md hover:bg-secondary" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] ${
                  active ? "bg-secondary font-semibold" : "hover:bg-secondary/70"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                {label}
              </Link>
            );
          })}
          {user && (
            <Link
              href={`/${user.username}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/70"
            >
              <UserIcon className="h-5 w-5" />
              Profile
            </Link>
          )}
        </div>
        <div className="p-4 border-t border-border">
          {user ? (
            <Link href="/" onClick={onClose}>
              <Button className="w-full gap-2">
                <PenSquare className="h-4 w-4" /> New Post
              </Button>
            </Link>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                onCreateDemo();
                onClose();
              }}
            >
              Create demo account
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
