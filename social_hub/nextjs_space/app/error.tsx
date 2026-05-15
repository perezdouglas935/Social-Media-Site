"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-6 ambient-violet">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-10 w-10 text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Something went sideways</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We hit an unexpected hiccup. Try again, or head back to the feed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="outline">Try again</Button>
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
