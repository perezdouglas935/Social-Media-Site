"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ComposeBox } from "./compose-box";

export function ComposeDialog({
  open,
  onOpenChange,
  parentId = null,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  parentId?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card border-border p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-base">{parentId ? "Reply" : "New post"}</DialogTitle>
        </DialogHeader>
        <ComposeBox
          parentId={parentId}
          autoFocus
          compact
          onPosted={() => onOpenChange(false)}
          placeholder={parentId ? "Post your reply" : "What's happening?"}
        />
      </DialogContent>
    </Dialog>
  );
}
