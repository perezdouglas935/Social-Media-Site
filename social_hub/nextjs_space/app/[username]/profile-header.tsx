"use client";

import { BadgeCheck, Calendar, Link2, MapPin } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "@/components/user/follow-button";
import { formatNumber } from "@/lib/format";
import { motion } from "framer-motion";

export function ProfileHeader({
  user,
}: {
  user: {
    id: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    location: string | null;
    website: string | null;
    isVerified: boolean;
    isDemo: boolean;
    createdAt: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    isFollowing: boolean;
    isMe: boolean;
  };
}) {
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <div>
      <div
        className="relative h-44 sm:h-52 bg-secondary"
        style={{
          background: user.bannerUrl
            ? `url(${user.bannerUrl}) center/cover`
            : "linear-gradient(135deg, hsl(252 84% 35%) 0%, hsl(252 84% 50%) 50%, hsl(280 70% 45%) 100%)",
        }}
      />
      <div className="px-4 pb-4 -mt-16 sm:-mt-20">
        <div className="flex items-end justify-between">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden ring-4 ring-background bg-secondary shadow-[var(--shadow-lg)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatarUrl ?? ""} alt={user.displayName} className="h-full w-full object-cover" />
          </motion.div>
          <div className="mb-3">
            {user.isMe ? (
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border">This is you</span>
            ) : (
              <FollowButton username={user.username} initiallyFollowing={user.isFollowing} size="default" />
            )}
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{user.displayName}</h1>
            {user.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
            {user.isDemo && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold border border-primary/30">
                Demo
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
          {user.bio && <p className="mt-3 text-[15px] whitespace-pre-wrap">{user.bio}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Link2 className="h-4 w-4" /> {user.website}
              </a>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Joined {joined}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-5 text-sm">
            <Link href={`/${user.username}?tab=following`} className="hover:underline">
              <span className="font-semibold">{formatNumber(user.followingCount)}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </Link>
            <Link href={`/${user.username}?tab=followers`} className="hover:underline">
              <span className="font-semibold">{formatNumber(user.followerCount)}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
