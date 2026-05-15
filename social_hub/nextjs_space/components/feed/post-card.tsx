"use client";

import Link from "next/link";
import { ApiPost } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { PostActions } from "./post-actions";
import { BadgeCheck, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { renderRichText } from "./rich-text";

export function PostCard({
  post,
  variant = "feed",
  onChange,
}: {
  post: ApiPost;
  variant?: "feed" | "detail" | "reply";
  onChange?: (p: ApiPost) => void;
}) {
  const router = useRouter();
  const goToPost = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    router.push(`/post/${post.id}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={goToPost}
      className={`relative px-4 py-3 cursor-pointer hover:bg-secondary/30 transition group ${
        variant === "feed" ? "border-b border-border/60" : ""
      }`}
    >
      {variant === "reply" && post.parent && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 pl-12">
          <MessageSquare className="h-3 w-3" />
          Replying to{" "}
          <Link
            href={`/${post.parent.author.username}`}
            onClick={(e) => e.stopPropagation()}
            className="text-primary hover:underline"
          >
            @{post.parent.author.username}
          </Link>
        </div>
      )}
      <div className="flex gap-3">
        <Link
          href={`/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.author.avatarUrl ?? ""}
            alt={post.author.displayName}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-border hover:ring-primary/50 transition"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-sm flex-wrap">
            <Link
              href={`/${post.author.username}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold hover:underline truncate"
            >
              {post.author.displayName}
            </Link>
            {post.author.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
            <span className="text-muted-foreground truncate">@{post.author.username}</span>
            {post.author.isDemo && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold border border-primary/30">
                Demo
              </span>
            )}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground hover:underline">{timeAgo(post.createdAt)}</span>
          </div>
          <div className="mt-1 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {renderRichText(post.content)}
          </div>
          {post.imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-border/60 bg-muted relative aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.imageUrl} alt="post media" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
          <div className="mt-2 -ml-2">
            <PostActions post={post} onChange={onChange} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
