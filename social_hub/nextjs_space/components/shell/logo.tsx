import { MessageCircleHeart } from "lucide-react";
import Link from "next/link";

export function Logo({ withText = true, className = "" }: { withText?: boolean; className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center group-hover:bg-primary/25 transition">
        <MessageCircleHeart className="h-5 w-5 text-primary" strokeWidth={2.5} />
        <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition" />
      </div>
      {withText && (
        <span className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-200">
          Social Hub
        </span>
      )}
    </Link>
  );
}
