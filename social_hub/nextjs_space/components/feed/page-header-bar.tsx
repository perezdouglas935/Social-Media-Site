"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function PageHeaderBar({
  title,
  subtitle,
  showBack = false,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="sticky top-16 z-20 bg-background/85 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center gap-4">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="text-lg font-bold leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
    </div>
  );
}
