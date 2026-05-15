"use client";

import { useEffect } from "react";

export function MarkReadOnMount() {
  useEffect(() => {
    fetch("/api/notifications/read", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
