"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { FollowButton } from "./follow-button";

type Suggestion = {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  followerCount: number;
  initiallyFollowing: boolean;
};

export function WhoToFollowList({ users }: { users: Suggestion[] }) {
  if (users.length === 0) {
    return <div className="px-4 py-4 text-sm text-muted-foreground">You’re following everyone we know!</div>;
  }
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id} className="px-4 py-3 hover:bg-secondary/60 transition flex items-center gap-3">
          <Link href={`/${u.username}`} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.avatarUrl ?? ""}
              alt={u.displayName}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/${u.username}`} className="flex items-center gap-1 group">
              <span className="text-sm font-semibold truncate group-hover:underline">{u.displayName}</span>
              {u.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
            </Link>
            <div className="text-xs text-muted-foreground truncate">@{u.username}</div>
          </div>
          <FollowButton username={u.username} initiallyFollowing={u.initiallyFollowing} />
        </li>
      ))}
    </ul>
  );
}
