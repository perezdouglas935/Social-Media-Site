import { ReactNode, Suspense } from "react";
import { Header } from "./header";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1200px] px-2 sm:px-4 flex gap-0 lg:gap-2">
        <LeftSidebar />
        <main className="flex-1 min-w-0 border-x border-border/60 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <Suspense fallback={null}>
          <RightSidebar />
        </Suspense>
      </div>
    </div>
  );
}
