"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "@/components/providers/session-provider";
import { Camera, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PRESET_AVATARS = [
  "https://cdn.abacus.ai/images/c92911bf-6397-4717-bbc6-de788c6c7c16.png",
  "https://cdn.abacus.ai/images/7a85bb4a-a64a-4fc0-9b51-1a01313902cf.png",
  "https://cdn.abacus.ai/images/a372ef26-7e2b-4f13-95bb-c9aa8b9e4de7.png",
  "https://cdn.abacus.ai/images/9f4c4a6e-8e36-408f-b4e8-59dd2d48c151.png",
  "https://cdn.abacus.ai/images/4b8c9ba1-7c44-4b32-aeff-52f4b2c1633a.png",
  "https://cdn.abacus.ai/images/4f9d1ccf-a0fc-4610-a98f-cd809a8a2058.png",
];

export function CreateDemoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const { setUser } = useSession();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>(PRESET_AVATARS[0]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 10MB");
      return;
    }
    setUploading(true);
    try {
      const presignRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: true }),
      });
      if (!presignRes.ok) throw new Error("presign failed");
      const { uploadUrl, cloud_storage_path } = await presignRes.json();
      const upload = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!upload.ok) throw new Error("upload failed");
      const urlRes = await fetch("/api/upload/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloud_storage_path, isPublic: true }),
      });
      const { url } = await urlRes.json();
      setAvatarUrl(url);
      toast.success("Avatar uploaded");
    } catch (e) {
      toast.error("Upload failed. Try again or pick a preset.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) {
      toast.error("Username and display name are required");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      toast.error("Username: 3-20 chars, letters/numbers/underscores only");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          displayName: displayName.trim(),
          bio: bio.trim() || null,
          avatarUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Could not create demo account");
        return;
      }
      setUser(data.user);
      toast.success(`Welcome, @${data.user.username}!`);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">Create your demo account</DialogTitle>
          </div>
          <DialogDescription>
            No password needed. Pick a handle and start posting in seconds.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary/40 hover:border-primary transition"
              aria-label="Upload avatar"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="avatar preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Camera className="h-5 w-5 text-white" />
                )}
              </div>
            </button>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Or pick a preset</Label>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {PRESET_AVATARS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`h-8 w-8 rounded-full overflow-hidden border-2 transition ${
                      avatarUrl === url ? "border-primary scale-110" : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="preset" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatarUpload(f);
              }}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="yourhandle"
                className="pl-8"
                maxLength={20}
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              maxLength={40}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A line or two about yourself"
              maxLength={160}
              className="mt-1 min-h-[72px]"
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/160</div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting || uploading}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create demo account"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo accounts are clearly labeled and exist only inside this preview.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
