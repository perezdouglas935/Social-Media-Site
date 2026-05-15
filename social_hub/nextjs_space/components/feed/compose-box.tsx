"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Smile, MapPin, Globe, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { toast } from "sonner";
import { CreateDemoModal } from "@/components/providers/create-demo-modal";

const MAX_LEN = 280;

export function ComposeBox({
  parentId = null,
  placeholder = "What's happening?",
  onPosted,
  autoFocus = false,
  compact = false,
}: {
  parentId?: string | null;
  placeholder?: string;
  onPosted?: (post: any) => void;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const { user } = useSession();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const charsLeft = MAX_LEN - content.length;
  const overLimit = charsLeft < 0;
  const canPost = !!user && content.trim().length > 0 && !overLimit && !posting && !uploading;

  const handleFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only images are supported");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");
      return;
    }
    setUploading(true);
    try {
      const presignRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: true }),
      });
      if (!presignRes.ok) throw new Error();
      const { uploadUrl, cloud_storage_path } = await presignRes.json();
      const upload = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!upload.ok) throw new Error();
      const urlRes = await fetch("/api/upload/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloud_storage_path, isPublic: true }),
      });
      const { url } = await urlRes.json();
      setImageUrl(url);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setDemoOpen(true);
      return;
    }
    if (!canPost) return;
    setPosting(true);
    try {
      const r = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), imageUrl, parentId }),
      });
      const data = await r.json();
      if (!r.ok) {
        toast.error(data?.error ?? "Couldn't post");
        return;
      }
      setContent("");
      setImageUrl(null);
      toast.success(parentId ? "Reply posted" : "Post sent");
      onPosted?.(data.post);
      if (!parentId) router.refresh();
    } catch {
      toast.error("Network error");
    } finally {
      setPosting(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className={`px-4 py-4 border-b border-border/60 flex items-center gap-3 ${compact ? "" : ""}`}>
          <div className="h-11 w-11 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">You're browsing as a guest. Create a demo account to post and interact.</div>
          </div>
          <Button size="sm" onClick={() => setDemoOpen(true)} className="font-semibold">
            Create demo
          </Button>
        </div>
        <CreateDemoModal open={demoOpen} onOpenChange={setDemoOpen} />
      </>
    );
  }

  return (
    <div className={`px-4 py-4 ${compact ? "" : "border-b border-border/60"}`}>
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatarUrl ?? ""} alt={user.displayName} className="h-11 w-11 rounded-full object-cover ring-1 ring-border shrink-0" />
        <div className="flex-1 min-w-0">
          <textarea
            autoFocus={autoFocus}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full bg-transparent text-[17px] placeholder:text-muted-foreground focus:outline-none resize-none min-h-[56px] max-h-[300px]"
          />
          {imageUrl && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-border/60 aspect-[16/9] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="upload preview" className="absolute inset-0 h-full w-full object-cover" />
              <button
                onClick={() => setImageUrl(null)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="mt-3 pt-3 flex items-center justify-between border-t border-border/60">
            <div className="flex items-center gap-1">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="p-2 rounded-full text-primary hover:bg-primary/10 transition disabled:opacity-50"
                aria-label="Add image"
              >
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
              </button>
              <button
                disabled
                className="p-2 rounded-full text-primary/50 cursor-not-allowed"
                aria-label="Add emoji (coming soon)"
                title="Coming soon"
              >
                <Smile className="h-5 w-5" />
              </button>
              <button
                disabled
                className="p-2 rounded-full text-primary/50 cursor-not-allowed"
                aria-label="Add location (coming soon)"
                title="Coming soon"
              >
                <MapPin className="h-5 w-5" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <span
                  className={`text-xs font-medium tabular-nums ${
                    overLimit ? "text-destructive" : charsLeft <= 20 ? "text-amber-400" : "text-muted-foreground"
                  }`}
                >
                  {charsLeft}
                </span>
              )}
              <Button onClick={handleSubmit} disabled={!canPost} size="sm" className="rounded-full px-5 font-semibold">
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : parentId ? "Reply" : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
