"use client";

import { useState } from "react";
import { ApiPost } from "@/lib/types";
import { PostCard } from "@/components/feed/post-card";
import { ComposeBox } from "@/components/feed/compose-box";
import { renderRichText } from "@/components/feed/rich-text";
import { PostActions } from "@/components/feed/post-actions";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export function ThreadView({
  ancestors,
  post,
  initialReplies,
}: {
  ancestors: ApiPost[];
  post: ApiPost;
  initialReplies: ApiPost[];
}) {
  const [main, setMain] = useState(post);
  const [replies, setReplies] = useState(initialReplies);
  const dt = new Date(main.createdAt);
  const dateStr = dt.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {ancestors.map((a) => (
        <PostCard key={a.id} post={a} />
      ))}

      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-4 border-b border-border/60"
      >
        <div className="flex items-center gap-3">
          <Link href={`/${main.author.username}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={main.author.avatarUrl ?? ""}
              alt={main.author.displayName}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-border"
            />
          </Link>
          <div className="min-w-0">
            <Link href={`/${main.author.username}`} className="flex items-center gap-1 group">
              <span className="font-semibold truncate group-hover:underline">{main.author.displayName}</span>
              {main.author.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
              {main.author.isDemo && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold border border-primary/30">
                  Demo
                </span>
              )}
            </Link>
            <div className="text-sm text-muted-foreground">@{main.author.username}</div>
          </div>
        </div>
        <div className="mt-3 text-[18px] leading-relaxed whitespace-pre-wrap break-words">
          {renderRichText(main.content)}
        </div>
        {main.imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-border/60 bg-muted relative aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main.imageUrl} alt="post media" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}
        <div className="mt-3 text-sm text-muted-foreground">{dateStr}</div>
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-6 text-sm">
          <span>
            <span className="font-semibold text-foreground">{main.counts.replies}</span>{" "}
            <span className="text-muted-foreground">Replies</span>
          </span>
          <span>
            <span className="font-semibold text-foreground">{main.counts.retweets}</span>{" "}
            <span className="text-muted-foreground">Reposts</span>
          </span>
          <span>
            <span className="font-semibold text-foreground">{main.counts.likes}</span>{" "}
            <span className="text-muted-foreground">Likes</span>
          </span>
        </div>
        <div className="mt-2 -ml-2">
          <PostActions post={main} onChange={setMain} />
        </div>
      </motion.article>

      <div className="border-b border-border/60">
        <ComposeBox
          parentId={main.id}
          placeholder="Post your reply"
          onPosted={(p: ApiPost) => {
            setReplies((r) => [...r, p]);
            setMain((m) => ({ ...m, counts: { ...m.counts, replies: m.counts.replies + 1 } }));
          }}
        />
      </div>
      <div>
        {replies.map((r) => (
          <PostCard key={r.id} post={r} />
        ))}
        {replies.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">No replies yet — be the first.</div>
        )}
      </div>
    </div>
  );
}
