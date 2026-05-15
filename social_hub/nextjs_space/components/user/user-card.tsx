import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { FollowButton } from "./follow-button";

export function UserCard({
  user,
}: {
  user: {
    username: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
    isDemo: boolean;
    initiallyFollowing: boolean;
  };
}) {
  return (
    <div className="px-4 py-3 hover:bg-secondary/30 transition border-b border-border/60 last:border-0">
      <div className="flex items-start gap-3">
        <Link href={`/${user.username}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl ?? ""}
            alt={user.displayName}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-border"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/${user.username}`} className="flex items-center gap-1 group">
                <span className="font-semibold truncate group-hover:underline">{user.displayName}</span>
                {user.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                {user.isDemo && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold border border-primary/30">
                    Demo
                  </span>
                )}
              </Link>
              <div className="text-sm text-muted-foreground">@{user.username}</div>
            </div>
            <FollowButton username={user.username} initiallyFollowing={user.initiallyFollowing} />
          </div>
          {user.bio && <p className="mt-1 text-sm text-foreground/90 line-clamp-2">{user.bio}</p>}
        </div>
      </div>
    </div>
  );
}
