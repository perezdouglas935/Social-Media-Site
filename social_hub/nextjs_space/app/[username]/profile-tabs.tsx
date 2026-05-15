"use client";

import { useState } from "react";
import { ApiPost } from "@/lib/types";
import { PostCard } from "@/components/feed/post-card";
import Link from "next/link";

export function ProfileTabs({
  posts,
  replies,
  media,
}: {
  posts: ApiPost[];
  replies: ApiPost[];
  media: ApiPost[];
}) {
  const [tab, setTab] = useState<"posts" | "replies" | "media">("posts");
  const tabs = [
    { id: "posts", label: "Posts", count: posts.length },
    { id: "replies", label: "Replies", count: replies.length },
    { id: "media", label: "Media", count: media.length },
  ] as const;
  return (
    <>
      <div className="flex border-b border-border/60 sticky top-16 bg-background/85 backdrop-blur-md z-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-sm font-semibold relative transition ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
      {tab === "posts" && (
        <div>
          {posts.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No posts yet.</div>
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      )}
      {tab === "replies" && (
        <div>
          {replies.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No replies yet.</div>
          ) : (
            replies.map((p) => <PostCard key={p.id} post={p} variant="reply" />)
          )}
        </div>
      )}
      {tab === "media" && (
        <div>
          {media.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No media yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-1">
              {media.map((p) => (
                <Link
                  key={p.id}
                  href={`/post/${p.id}`}
                  className="relative aspect-square rounded-md overflow-hidden bg-muted group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl ?? ""}
                    alt="media"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
