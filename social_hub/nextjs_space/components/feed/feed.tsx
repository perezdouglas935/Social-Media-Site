"use client";

import { useEffect, useState, useCallback } from "react";
import { ApiPost } from "@/lib/types";
import { PostCard } from "./post-card";
import { ComposeBox } from "./compose-box";
import { Loader2, Sparkles } from "lucide-react";
import { useSession } from "@/components/providers/session-provider";

export function Feed({ initialPosts, scope = "all" }: { initialPosts: ApiPost[]; scope?: "all" | "following" }) {
  const { user } = useSession();
  const [posts, setPosts] = useState<ApiPost[]>(initialPosts);
  const [tab, setTab] = useState<"all" | "following">(scope);
  const [loading, setLoading] = useState(false);

  const loadPosts = useCallback(
    async (which: "all" | "following") => {
      setLoading(true);
      try {
        const r = await fetch(`/api/posts?scope=${which}`, { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          setPosts(data?.posts ?? []);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (tab !== scope) loadPosts(tab);
  }, [tab, scope, loadPosts]);

  const handlePosted = (post: ApiPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <>
      <div className="sticky top-16 z-20 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="flex">
          <button
            onClick={() => setTab("all")}
            className={`flex-1 py-4 text-sm font-semibold relative transition ${
              tab === "all" ? "text-foreground" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            For you
            {tab === "all" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-primary" />}
          </button>
          <button
            onClick={() => setTab("following")}
            className={`flex-1 py-4 text-sm font-semibold relative transition ${
              tab === "following" ? "text-foreground" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            Following
            {tab === "following" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-primary" />}
          </button>
        </div>
      </div>
      <ComposeBox onPosted={handlePosted} />
      {loading && (
        <div className="py-10 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {!loading && posts.length === 0 && (
        <div className="py-12 text-center px-6">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">
            {tab === "following" ? "Your timeline is quiet" : "No posts yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {tab === "following"
              ? "Follow a few people to see their posts here — try the suggestions on the right."
              : "Be the first to post something."}
          </p>
        </div>
      )}
      <div>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}
