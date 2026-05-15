"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ComposeBox } from "./compose-box";
import { ApiPost } from "@/lib/types";
import { renderRichText } from "./rich-text";
import { timeAgo } from "@/lib/format";
import { BadgeCheck } from "lucide-react";

export function ReplyDialog({
  parent,
  open,
  onOpenChange,
  onPosted,
}: {
  parent: ApiPost;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPosted?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card border-border p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-base">Reply to @{parent.author.username}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pt-3 flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="flex flex-col items-center shrink-0">
            <img src={parent.author.avatarUrl ?? ""} alt={parent.author.displayName} className="h-11 w-11 rounded-full object-cover ring-1 ring-border" />
            <div className="flex-1 w-px bg-border my-2" />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-1 text-sm flex-wrap">
              <span className="font-semibold">{parent.author.displayName}</span>
              {parent.author.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
              <span className="text-muted-foreground">@{parent.author.username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{timeAgo(parent.createdAt)}</span>
            </div>
            <div className="mt-1 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {renderRichText(parent.content)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Replying to <span className="text-primary">@{parent.author.username}</span>
            </div>
          </div>
        </div>
        <ComposeBox
          parentId={parent.id}
          autoFocus
          compact
          placeholder="Post your reply"
          onPosted={() => {
            onOpenChange(false);
            onPosted?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
