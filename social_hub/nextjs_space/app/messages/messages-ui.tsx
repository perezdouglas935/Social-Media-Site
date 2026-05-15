"use client";

import { useState } from "react";
import { BadgeCheck, MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { CreateDemoModal } from "@/components/providers/create-demo-modal";

type Contact = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
};

const SEED_THREADS: Record<string, { fromMe: boolean; text: string; ago: string }[]> = {
  default: [
    { fromMe: false, text: "Hey! Loved your latest post — is the design system you mentioned open source?", ago: "2h" },
    { fromMe: true, text: "Thanks! It’s internal for now, but we’re thinking about extracting a few primitives.", ago: "2h" },
    { fromMe: false, text: "That would be amazing. The token approach you described matches what we’re trying to do.", ago: "2h" },
    { fromMe: true, text: "I’ll DM you a sample tokens file later. 👍", ago: "1h" },
  ],
};

export function MessagesUI({ contacts, signedIn }: { contacts: Contact[]; signedIn: boolean }) {
  const { user } = useSession();
  const [activeId, setActiveId] = useState<string | null>(contacts[0]?.id ?? null);
  const [thread, setThread] = useState(SEED_THREADS.default);
  const [draft, setDraft] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);
  const active = contacts.find((c) => c.id === activeId) ?? null;

  const send = () => {
    if (!signedIn) {
      setDemoOpen(true);
      return;
    }
    if (!draft.trim()) return;
    setThread((t) => [...t, { fromMe: true, text: draft.trim(), ago: "now" }]);
    setDraft("");
    // simulate a reply
    setTimeout(() => {
      setThread((t) => [...t, { fromMe: false, text: "Got it — thanks for sharing!", ago: "now" }]);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] min-h-[calc(100vh-7rem)]">
      <aside className="border-r border-border/60 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <div className="px-4 py-3 text-sm font-semibold border-b border-border/60">Inbox</div>
        {contacts.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">No contacts yet — follow people to start chatting.</div>
        )}
        <ul>
          {contacts.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition ${
                  activeId === c.id ? "bg-secondary/80" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.avatarUrl ?? ""} alt={c.displayName} className="h-10 w-10 rounded-full object-cover ring-1 ring-border" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold truncate">{c.displayName}</span>
                    {c.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">@{c.username}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex flex-col min-h-[calc(100vh-7rem)]">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center px-6 ambient-violet">
            <div>
              <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold mb-1">Select a conversation</h2>
              <p className="text-sm text-muted-foreground">Choose someone from your inbox to view the chat.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-border/60 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.avatarUrl ?? ""} alt={active.displayName} className="h-9 w-9 rounded-full object-cover ring-1 ring-border" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate flex items-center gap-1">
                  {active.displayName}
                  {active.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                </div>
                <div className="text-xs text-muted-foreground">@{active.username}</div>
              </div>
              <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-semibold">
                Demo conversation
              </span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {thread.map((m, i) => (
                <div key={i} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[15px] ${
                      m.fromMe ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.text}
                    <div className={`mt-1 text-[10px] ${m.fromMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {m.ago}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border/60">
              {!signedIn && (
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Create a demo account to send messages.
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Start a new message"
                  className="flex-1 h-11 px-4 rounded-full bg-secondary text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button onClick={send} size="icon" className="rounded-full h-11 w-11">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
      <CreateDemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
