"use client";

import { useState } from "react";
import { ApiPost } from "@/lib/types";
import { PostCard } from "@/components/feed/post-card";
import { UserCard } from "@/components/user/user-card";
import { Hash } from "lucide-react";

export function SearchTabs({
  query,
  initialTab,
  posts,
  users,
  hashtag,
}: {
  query: string;
  initialTab: "top" | "posts" | "people";
  posts: ApiPost[];
  users: any[];
  hashtag: string | null;
}) {
  const [tab, setTab] = useState(initialTab);

  const tabs = [
    { id: "top", label: "Top" },
    { id: "posts", label: "Posts" },
    { id: "people", label: "People" },
  ] as const;

  return (
    <>
      <div className="flex border-b border-border/60">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-sm font-semibold relative transition ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            {t.label}
            {tab === t.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
      {hashtag && (
        <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2 ambient-violet">
          <Hash className="h-4 w-4 text-primary" />
          <span className="font-semibold">#{hashtag}</span>
          <span className="text-xs text-muted-foreground">
            · {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
      )}
      {(tab === "top" || tab === "people") && users.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">People</div>
          {users.slice(0, tab === "people" ? users.length : 3).map((u) => (
            <UserCard
              key={u.id}
              user={{
                username: u.username,
                displayName: u.displayName,
                bio: u.bio,
                avatarUrl: u.avatarUrl,
                isVerified: u.isVerified,
                isDemo: u.isDemo,
                initiallyFollowing: u.initiallyFollowing,
              }}
            />
          ))}
        </div>
      )}
      {(tab === "top" || tab === "posts") && (
        <div>
          {posts.length > 0 && tab === "top" && (
            <div className="px-4 pt-3 pb-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Posts</div>
          )}
          {posts.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No posts found for <span className="font-semibold text-foreground">{query}</span>
            </div>
          )}
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
      {tab === "people" && users.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">No people found.</div>
      )}
    </>
  );
}
