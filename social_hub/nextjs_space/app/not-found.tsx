import Link from "next/link";
import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <AppShell>
      <div className="py-24 text-center px-6 ambient-violet">
        <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Lost in the feed</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or was removed.
        </p>
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </AppShell>
  );
}
