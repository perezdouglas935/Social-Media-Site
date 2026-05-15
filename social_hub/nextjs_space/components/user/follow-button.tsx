"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { CreateDemoModal } from "@/components/providers/create-demo-modal";
import { toast } from "sonner";
import { Check, UserPlus } from "lucide-react";

export function FollowButton({
  username,
  initiallyFollowing,
  size = "sm",
  variant = "primary",
  onChange,
}: {
  username: string;
  initiallyFollowing: boolean;
  size?: "sm" | "default";
  variant?: "primary" | "outline";
  onChange?: (following: boolean) => void;
}) {
  const { user } = useSession();
  const [following, setFollowing] = useState(initiallyFollowing);
  const [busy, setBusy] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setDemoOpen(true);
      return;
    }
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    onChange?.(next);
    try {
      const r = await fetch(`/api/users/${username}/follow`, { method: next ? "POST" : "DELETE" });
      if (!r.ok) throw new Error();
    } catch {
      setFollowing(!next);
      onChange?.(!next);
      toast.error("Couldn't update follow");
    } finally {
      setBusy(false);
    }
  };

  if (user && user.username === username) return null;

  return (
    <>
      <Button
        size={size}
        onClick={handle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={busy}
        variant={following ? "outline" : variant === "outline" ? "outline" : "default"}
        className={`rounded-full font-semibold min-w-[100px] transition ${
          following && hover ? "text-destructive border-destructive/60 hover:bg-destructive/10" : ""
        }`}
      >
        {following ? (
          hover ? (
            "Unfollow"
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Following
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" /> Follow
          </span>
        )}
      </Button>
      <CreateDemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
}
