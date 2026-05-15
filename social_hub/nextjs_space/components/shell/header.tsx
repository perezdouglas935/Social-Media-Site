"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut, User as UserIcon, Menu } from "lucide-react";
import { Logo } from "./logo";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateDemoModal } from "@/components/providers/create-demo-modal";
import { toast } from "sonner";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const router = useRouter();
  const { user, setUser } = useSession();
  const [search, setSearch] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setUnread(0);
      return;
    }
    const tick = async () => {
      try {
        const r = await fetch("/api/notifications/unread-count", { cache: "no-store" });
        if (!r.ok) return;
        const data = await r.json();
        if (mounted) setUnread(data?.count ?? 0);
      } catch {}
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [user]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("Signed out of demo session");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Sign out failed");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1200px] px-4 h-16 flex items-center gap-4">
          <button
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-secondary text-foreground/80"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Social Hub"
                className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background transition"
              />
            </div>
          </form>
          <div className="flex md:hidden flex-1" />
          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative p-2 rounded-full hover:bg-secondary text-foreground/80 transition"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-full p-1 hover:bg-secondary transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Profile menu"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatarUrl ?? ""}
                      alt={user.displayName}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight">{user.displayName}</span>
                      <span className="text-xs text-muted-foreground">@{user.username}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.username}`} className="cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" /> View profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks" className="cursor-pointer">
                      Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setDemoOpen(true)} size="sm" className="font-semibold">
                Create demo account
              </Button>
            )}
          </div>
        </div>
      </header>
      <CreateDemoModal open={demoOpen} onOpenChange={setDemoOpen} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} onCreateDemo={() => setDemoOpen(true)} />
    </>
  );
}
