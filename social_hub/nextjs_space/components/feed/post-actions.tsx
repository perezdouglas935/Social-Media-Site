"use client";

import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Share, Bookmark } from "lucide-react";
import { ApiPost } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { useSession } from "@/components/providers/session-provider";
import { toast } from "sonner";
import { ReplyDialog } from "./reply-dialog";
import { CreateDemoModal } from "@/components/providers/create-demo-modal";

export function PostActions({
  post,
  onChange,
}: {
  post: ApiPost;
  onChange?: (p: ApiPost) => void;
}) {
  const { user } = useSession();
  const [state, setState] = useState(post);
  const [pulseLike, setPulseLike] = useState(false);
  const [spinRT, setSpinRT] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const requireAuth = () => {
    if (!user) {
      setDemoOpen(true);
      return false;
    }
    return true;
  };

  const update = (next: ApiPost) => {
    setState(next);
    onChange?.(next);
  };

  const handleLike = async () => {
    if (!requireAuth()) return;
    const wasLiked = state.viewer.liked;
    // optimistic
    update({
      ...state,
      viewer: { ...state.viewer, liked: !wasLiked },
      counts: { ...state.counts, likes: state.counts.likes + (wasLiked ? -1 : 1) },
    });
    if (!wasLiked) {
      setPulseLike(true);
      setTimeout(() => setPulseLike(false), 600);
    }
    try {
      const r = await fetch(`/api/posts/${state.id}/like`, { method: wasLiked ? "DELETE" : "POST" });
      if (!r.ok) throw new Error();
    } catch {
      // revert
      update(state);
      toast.error("Couldn't update like");
    }
  };

  const handleRetweet = async () => {
    if (!requireAuth()) return;
    const wasRT = state.viewer.retweeted;
    update({
      ...state,
      viewer: { ...state.viewer, retweeted: !wasRT },
      counts: { ...state.counts, retweets: state.counts.retweets + (wasRT ? -1 : 1) },
    });
    if (!wasRT) {
      setSpinRT(true);
      setTimeout(() => setSpinRT(false), 600);
      toast.success("Reposted");
    } else {
      toast.success("Removed repost");
    }
    try {
      const r = await fetch(`/api/posts/${state.id}/retweet`, { method: wasRT ? "DELETE" : "POST" });
      if (!r.ok) throw new Error();
    } catch {
      update(state);
      toast.error("Couldn't repost");
    }
  };

  const handleBookmark = async () => {
    if (!requireAuth()) return;
    const wasBM = state.viewer.bookmarked;
    update({
      ...state,
      viewer: { ...state.viewer, bookmarked: !wasBM },
      counts: { ...state.counts, bookmarks: state.counts.bookmarks + (wasBM ? -1 : 1) },
    });
    toast.success(wasBM ? "Removed bookmark" : "Bookmarked");
    try {
      const r = await fetch(`/api/posts/${state.id}/bookmark`, { method: wasBM ? "DELETE" : "POST" });
      if (!r.ok) throw new Error();
    } catch {
      update(state);
      toast.error("Couldn't bookmark");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${state.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${state.author.displayName} on Social Hub`,
          text: state.content,
          url,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleReply = () => {
    if (!requireAuth()) return;
    setReplyOpen(true);
  };

  // colorTheme is a static-class palette so Tailwind's JIT can pick them up.
  const palettes = {
    primary: {
      base: "text-muted-foreground hover:text-primary hover:bg-primary/10",
      active: "text-primary",
      fill: false,
    },
    red: {
      base: "text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
      active: "text-red-500",
      fill: true,
    },
    emerald: {
      base: "text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10",
      active: "text-emerald-400",
      fill: false,
    },
  } as const;

  const ActionBtn = ({
    icon: Icon,
    count,
    active,
    color,
    onClick,
    label,
    iconClass = "",
    forceFill = false,
  }: {
    icon: any;
    count?: number;
    active?: boolean;
    color: keyof typeof palettes;
    onClick: (e: React.MouseEvent) => void;
    label: string;
    iconClass?: string;
    forceFill?: boolean;
  }) => {
    const p = palettes[color];
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        aria-label={label}
        className={`group/btn flex items-center gap-1.5 px-2 py-1.5 rounded-full transition ${p.base} ${active ? p.active : ""}`}
      >
        <Icon
          className={`h-[18px] w-[18px] ${iconClass}`}
          fill={(active && p.fill) || forceFill ? "currentColor" : "none"}
        />
        {typeof count === "number" && count > 0 && (
          <span className="text-xs font-medium">{formatNumber(count)}</span>
        )}
      </button>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between max-w-md">
        <ActionBtn
          icon={MessageCircle}
          count={state.counts.replies}
          color="primary"
          onClick={handleReply}
          label="Reply"
        />
        <ActionBtn
          icon={Repeat2}
          count={state.counts.retweets}
          active={state.viewer.retweeted}
          color="emerald"
          onClick={handleRetweet}
          label="Repost"
          iconClass={spinRT ? "animate-retweet-spin" : ""}
        />
        <ActionBtn
          icon={Heart}
          count={state.counts.likes}
          active={state.viewer.liked}
          color="red"
          onClick={handleLike}
          label="Like"
          iconClass={pulseLike ? "animate-heart-pulse" : ""}
        />
        <ActionBtn
          icon={Bookmark}
          active={state.viewer.bookmarked}
          color="primary"
          onClick={handleBookmark}
          label="Bookmark"
          forceFill={state.viewer.bookmarked}
        />
        <ActionBtn icon={Share} color="primary" onClick={handleShare} label="Share" />
      </div>
      <ReplyDialog
        parent={state}
        open={replyOpen}
        onOpenChange={setReplyOpen}
        onPosted={() => update({ ...state, counts: { ...state.counts, replies: state.counts.replies + 1 } })}
      />
      <CreateDemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
}
