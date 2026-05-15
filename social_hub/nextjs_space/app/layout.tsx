import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ChunkLoadErrorHandler } from "@/components/chunk-load-error-handler";
import { SessionProvider } from "@/components/providers/session-provider";
import { getCurrentUser } from "@/lib/session";
import Script from "next/script";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "Social Hub — The conversation never stops",
  description:
    "A modern social platform where ideas, art, and people connect. Browse the feed, follow creators, and join the conversation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Social Hub — The conversation never stops",
    description: "A modern social platform where ideas, art, and people connect.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Hub",
    description: "A modern social platform where ideas, art, and people connect.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const initialUser = user
    ? {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        isDemo: user.isDemo,
        isVerified: user.isVerified,
      }
    : null;
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased`}>
        <SessionProvider initialUser={initialUser}>
          {children}
          <Toaster theme="dark" position="bottom-right" />
          <ChunkLoadErrorHandler />
        </SessionProvider>
      </body>
    </html>
  );
}
