import React from "react";
import { marked } from "marked";

const DISCORD_TIMESTAMP_STYLES = [
  "t",
  "T",
  "d",
  "D",
  "f",
  "F",
  "R",
  "s",
  "S",
] as const;

type DiscordTimestampStyle = (typeof DISCORD_TIMESTAMP_STYLES)[number];

function isSafeHttpUrl(href: string) {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function decodeDiscordHtmlEntities(text: string) {
  // Discord content sometimes arrives HTML-entity encoded (e.g. `year&#39;s`).
  // Decode a small, safe subset of entities without ever rendering HTML.
  // This keeps the output as plain text while fixing common Discord encodings.
  return (
    text
      // Apostrophes / quotes
      .replace(/&#39;|&#x27;|&apos;/gi, "'")
      .replace(/&#8217;|&#x2019;/gi, "’")
      .replace(/&amp;?/g, "&")
      .replace(/&quot;|&#34;/g, '"')
      .replace(/&#8220;|&#x201C;/gi, "“")
      .replace(/&#8221;|&#x201D;/gi, "”")
      .replace(/&lt;|&#60;/g, "<")
      .replace(/&gt;|&#62;/g, ">")
      // Spaces / punctuation
      .replace(/&nbsp;|&#160;|&#xA0;/gi, " ")
      .replace(/&#8230;|&#x2026;/gi, "…")
      .replace(/&#8211;|&#x2013;/gi, "–")
      .replace(/&#8212;|&#x2014;/gi, "—")
  );
}

function normalizeDiscordTimestampStyle(
  styleRaw: string | undefined,
): DiscordTimestampStyle | undefined {
  if (!styleRaw) return undefined;

  const style = styleRaw as DiscordTimestampStyle;
  if (DISCORD_TIMESTAMP_STYLES.includes(style)) {
    return style;
  }

  return undefined;
}

function formatRelativeTime(targetMs: number, nowMs: number) {
  const diffSeconds = Math.round((targetMs - nowMs) / 1000);
  const abs = Math.abs(diffSeconds);

  const rtf =
    typeof Intl !== "undefined" && "RelativeTimeFormat" in Intl
      ? new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
      : null;

  const format = (value: number, unit: Intl.RelativeTimeFormatUnit) =>
    rtf
      ? rtf.format(value, unit)
      : `${value} ${unit}${Math.abs(value) === 1 ? "" : "s"}`;

  if (abs < 60) return format(diffSeconds, "second");
  if (abs < 60 * 60) return format(Math.round(diffSeconds / 60), "minute");
  if (abs < 60 * 60 * 24) return format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 60 * 60 * 24 * 30)
    return format(Math.round(diffSeconds / 86400), "day");
  if (abs < 60 * 60 * 24 * 365)
    return format(Math.round(diffSeconds / (86400 * 30)), "month");

  return format(Math.round(diffSeconds / (86400 * 365)), "year");
}

function formatDiscordTimestamp(
  epochSeconds: number,
  style: DiscordTimestampStyle | undefined,
  nowMs: number,
) {
  const date = new Date(epochSeconds * 1000);

  // IMPORTANT: Use the player's locale + timezone by leaving locale undefined.
  switch (style) {
    case "t":
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    case "T":
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      });
    case "d":
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    case "D":
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "f":
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    case "F":
      return date.toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    case "R":
      return formatRelativeTime(date.getTime(), nowMs);
    case "s":
      // Custom/legacy: compact local date+time (numeric)
      return date.toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      });
    case "S":
      // Custom/legacy: more readable local date+time
      return date.toLocaleString(undefined, {
        dateStyle: "long",
        timeStyle: "short",
      });
    default:
      return date.toLocaleString();
  }
}

function replaceDiscordTimestamps(text: string, nowMs: number) {
  // Replace timestamps *before* markdown parsing so `<t:...>` can't be treated as raw HTML.
  const replacer = (
    match: string,
    epochSecondsRaw: string,
    styleRaw?: string,
  ) => {
    const epochSeconds = Number(epochSecondsRaw);
    if (!Number.isFinite(epochSeconds)) return match;

    const style = normalizeDiscordTimestampStyle(styleRaw);
    return formatDiscordTimestamp(epochSeconds, style, nowMs);
  };

  return text
    .replace(/<t:(\d+)(?::([a-zA-Z]))?>/g, replacer)
    .replace(/&lt;t:(\d+)(?::([a-zA-Z]))?&gt;/g, replacer);
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getStringProp(obj: UnknownRecord, key: string): string | undefined {
  const value = obj[key];
  return typeof value === "string" ? value : undefined;
}

function getBooleanProp(obj: UnknownRecord, key: string): boolean | undefined {
  const value = obj[key];
  return typeof value === "boolean" ? value : undefined;
}

function getArrayProp(obj: UnknownRecord, key: string): unknown[] {
  const value = obj[key];
  return Array.isArray(value) ? value : [];
}

function shouldWrapCodeBlock(text: string) {
  /**
   * Discord announcements sometimes fence "code" blocks for both:
   * - plain-text lists (should wrap nicely in the panel)
   * - JSON/JS-ish objects/arrays (should overflow horizontally to preserve structure)
   *
   * Heuristic: if it looks like JSON/JS data structures, keep it non-wrapping.
   */
  const trimmed = text.trim();
  if (!trimmed) return true;

  // JSON/JS-ish: starts with { or [ OR contains multiple object/array punctuation.
  const looksLikeData =
    trimmed.startsWith("{") ||
    trimmed.startsWith("[") ||
    /[{[\]}]:/.test(trimmed) ||
    /{\s*\w+/.test(trimmed);

  return !looksLikeData;
}

function renderInlineToken(token: unknown, key: React.Key): React.ReactNode {
  if (!isRecord(token)) return null;

  const type = getStringProp(token, "type");
  switch (type) {
    case "text":
    case "escape":
      return (
        <React.Fragment key={key}>
          {decodeDiscordHtmlEntities(getStringProp(token, "text") ?? "")}
        </React.Fragment>
      );
    case "strong":
      return (
        <strong key={key}>
          {renderInlineTokens(
            getArrayProp(token, "tokens"),
            `${String(key)}-s`,
          )}
        </strong>
      );
    case "em":
      return (
        <em key={key}>
          {renderInlineTokens(
            getArrayProp(token, "tokens"),
            `${String(key)}-e`,
          )}
        </em>
      );
    case "del":
      return (
        <del key={key}>
          {renderInlineTokens(
            getArrayProp(token, "tokens"),
            `${String(key)}-d`,
          )}
        </del>
      );
    case "codespan":
      return (
        <code key={key} className="px-1 rounded-sm bg-brown-200">
          {decodeDiscordHtmlEntities(getStringProp(token, "text") ?? "")}
        </code>
      );
    case "br":
      return <br key={key} />;
    case "link": {
      const href = getStringProp(token, "href");
      const safe = href && isSafeHttpUrl(href);
      const linkTokens = getArrayProp(token, "tokens");
      const children = linkTokens.length
        ? renderInlineTokens(linkTokens, `${String(key)}-l`)
        : decodeDiscordHtmlEntities(getStringProp(token, "text") ?? "");

      return safe ? (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
          title={getStringProp(token, "title")}
        >
          {children}
        </a>
      ) : (
        <React.Fragment key={key}>{children}</React.Fragment>
      );
    }
    case "image":
    case "html":
      // Never render raw HTML/images from markdown (attachments are rendered separately).
      return null;
    default:
      // Fallback to safest plain text-ish output
      return (
        <React.Fragment key={key}>
          {decodeDiscordHtmlEntities(
            getStringProp(token, "text") ?? getStringProp(token, "raw") ?? "",
          )}
        </React.Fragment>
      );
  }
}

function renderInlineTokens(
  tokens: unknown[],
  keyPrefix: string,
): React.ReactNode {
  return (
    <>{tokens.map((t, idx) => renderInlineToken(t, `${keyPrefix}-${idx}`))}</>
  );
}

function renderBlockTokens(
  tokens: unknown[],
  keyPrefix: string,
): React.ReactNode {
  return (
    <>
      {tokens.map((token, idx) => {
        const key = `${keyPrefix}-${idx}`;

        if (!isRecord(token)) return null;

        const type = getStringProp(token, "type");
        switch (type) {
          case "paragraph":
            return (
              <div key={key} className="mb-2 last:mb-0">
                {renderInlineTokens(getArrayProp(token, "tokens"), `${key}-p`)}
              </div>
            );
          case "text":
            // In some cases `lexer` yields top-level "text"
            return (
              <div key={key} className="mb-2 last:mb-0">
                {renderInlineTokens(
                  getArrayProp(token, "tokens").length
                    ? getArrayProp(token, "tokens")
                    : [{ type: "text", text: getStringProp(token, "text") }],
                  `${key}-t`,
                )}
              </div>
            );
          case "code":
            return (
              <pre
                key={key}
                className={`mb-2 last:mb-0 p-2 rounded-sm bg-brown-300 border border-brown-400 max-w-full ${
                  shouldWrapCodeBlock(getStringProp(token, "text") ?? "")
                    ? "overflow-x-hidden whitespace-pre-wrap break-words"
                    : "overflow-x-auto scrollable whitespace-pre"
                }`}
              >
                <code>
                  {decodeDiscordHtmlEntities(
                    getStringProp(token, "text") ?? "",
                  )}
                </code>
              </pre>
            );
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="mb-2 last:mb-0 border-l-2 border-brown-300 pl-2"
              >
                {renderBlockTokens(getArrayProp(token, "tokens"), `${key}-bq`)}
              </blockquote>
            );
          case "list": {
            const ListTag = getBooleanProp(token, "ordered") ? "ol" : "ul";
            const items = getArrayProp(token, "items");
            return (
              <ListTag key={key} className="mb-2 last:mb-0 pl-4 list-disc">
                {items.map((item, itemIdx) => {
                  if (!isRecord(item)) return null;

                  const itemTokens = getArrayProp(item, "tokens");
                  return (
                    <li key={`${key}-li-${itemIdx}`}>
                      {itemTokens.length
                        ? renderBlockTokens(itemTokens, `${key}-li-${itemIdx}`)
                        : decodeDiscordHtmlEntities(
                            getStringProp(item, "text") ?? "",
                          )}
                    </li>
                  );
                })}
              </ListTag>
            );
          }
          case "space":
          case "hr":
          case "heading":
          case "html":
          default:
            return null;
        }
      })}
    </>
  );
}

const DiscordMarkdown: React.FC<{
  markdown: string;
  variant: "block" | "inline";
  nowMs: number;
}> = ({ markdown, variant, nowMs }) => {
  const safeMarkdown = replaceDiscordTimestamps(markdown, nowMs);

  const tokens: unknown[] = marked.lexer(safeMarkdown, {
    gfm: true,
    breaks: true,
  });

  if (variant === "inline") {
    const firstParagraph =
      tokens.find(
        (t) => isRecord(t) && getStringProp(t, "type") === "paragraph",
      ) ?? tokens[0];
    const inlineTokens = isRecord(firstParagraph)
      ? getArrayProp(firstParagraph, "tokens")
      : [];
    return renderInlineTokens(inlineTokens, "md-inline");
  }

  return renderBlockTokens(tokens, "md-block");
};

/**
 * Renders rich text (Discord announcements, X posts, ...) with the shared
 * in-game news styling defined in styles.css:
 * - `preview`: locked to two lines for list cards (`.discord-news-preview`).
 * - `body`: full, pre-wrapped text for detail views (`.discord-news-body`).
 *
 * Both lock the text to a sans-serif font, which avoids the emoji clipping and
 * ragged sizing you get with the default pixel font.
 */
export const NewsContent: React.FC<{
  content: string;
  variant: "preview" | "body";
  nowMs: number;
  className?: string;
}> = ({ content, variant, nowMs, className = "" }) =>
  variant === "preview" ? (
    <div className={`text-xxs discord-news-preview break-words ${className}`}>
      <DiscordMarkdown markdown={content} variant="inline" nowMs={nowMs} />
    </div>
  ) : (
    <div className={`discord-news-body break-words ${className}`}>
      <DiscordMarkdown markdown={content} variant="block" nowMs={nowMs} />
    </div>
  );
