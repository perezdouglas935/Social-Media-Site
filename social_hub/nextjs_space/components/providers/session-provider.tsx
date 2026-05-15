"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

export type SessionUser = {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  isDemo: boolean;
  isVerified: boolean;
};

type Ctx = {
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  refresh: () => Promise<void>;
};

const SessionCtx = createContext<Ctx>({ user: null, setUser: () => {}, refresh: async () => {} });

export function SessionProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      if (!r.ok) {
        setUser(null);
        return;
      }
      const data = await r.json();
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);
  return (
    <SessionCtx.Provider value={{ user, setUser, refresh }}>{children}</SessionCtx.Provider>
  );
}

export function useSession() {
  return useContext(SessionCtx);
}
