import Link from "next/link";
import { Fragment } from "react";

const URL_RE = /\b(https?:\/\/[^\s]+)/g;
const HASHTAG_RE = /#([a-zA-Z0-9_]+)/g;
const MENTION_RE = /@([a-zA-Z0-9_]+)/g;

export function renderRichText(text: string) {
  if (!text) return null;
  // Tokenize: split by hashtags, mentions, urls preserving them
  const combined = /(\bhttps?:\/\/[^\s]+|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g;
  const parts = text.split(combined).filter((p) => p !== undefined && p !== "");

  return (
    <>
      {parts.map((p, i) => {
        if (HASHTAG_RE.test(p)) {
          HASHTAG_RE.lastIndex = 0;
          const tag = p.slice(1);
          return (
            <Link
              key={i}
              href={`/search?q=${encodeURIComponent("#" + tag)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-primary hover:underline"
            >
              {p}
            </Link>
          );
        }
        if (MENTION_RE.test(p)) {
          MENTION_RE.lastIndex = 0;
          const handle = p.slice(1);
          return (
            <Link
              key={i}
              href={`/${handle}`}
              onClick={(e) => e.stopPropagation()}
              className="text-primary hover:underline"
            >
              {p}
            </Link>
          );
        }
        if (URL_RE.test(p)) {
          URL_RE.lastIndex = 0;
          return (
            <a
              key={i}
              href={p}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="text-primary hover:underline"
            >
              {p}
            </a>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}
