import React, { useEffect, useState } from "react";

import {
  DiscordChannelName,
  getDiscordNewsDataCached,
  storeDiscordNewsReadAt,
} from "../actions/discordNews";
import { useAuth } from "features/auth/lib/Provider";
import useSWR from "swr";
import { Loading } from "features/auth/components";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import speakerIcon from "assets/icons/speaker.webp";
import likeIcon from "assets/icons/like.webp";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ITEM_DETAILS } from "features/game/types/images";
import { marked } from "marked";

const DISCORD_CHANNEL_ICONS: Record<DiscordChannelName, string> = {
  news: newsIcon,
  announcements: speakerIcon,
  updates: ITEM_DETAILS.Cheer.image,
};

const TEAM_NPCS: Record<string, BumpkinParts> = {
  Adam: NPC_WEARABLES.adam,
  Elias: {
    onesie: "Black Sheep Onesie",
    wings: "Crow Wings",
    body: "Beige Farmer Potion",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    hat: "Farmer Hat",
    background: "Farm Background",
    hair: "Basic Hair",
  },
  Aeon: NPC_WEARABLES.dreadhorn,
  Dcol: NPC_WEARABLES.grubnuk,
  Spencer: NPC_WEARABLES["farmer flesh"],
  Craig: NPC_WEARABLES.craig,
  Jammy: NPC_WEARABLES.goldtooth,
};

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

function ordinal(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function formatPostedDate(createdAtMs: number) {
  const date = new Date(createdAtMs);
  const day = date.getDate();
  const month = date.toLocaleString(undefined, { month: "long" });
  const year = date.getFullYear();

  return `${ordinal(day)} ${month} ${year}`;
}

function getDiscordPostedLabel(
  createdAtMs: number,
  nowMs: number,
  t: ReturnType<typeof useAppTranslation>["t"],
) {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  if (nowMs - createdAtMs > SEVEN_DAYS_MS) {
    return t("discordNews.postedOn", { date: formatPostedDate(createdAtMs) });
  }

  return t("discordNews.postedAgo", {
    time: getRelativeTime(createdAtMs, nowMs),
  });
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

export const DiscordNews: React.FC = () => {
  const { authState } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { t } = useAppTranslation();
  const now = useNow({ live: true });

  const { data, isLoading, error } = useSWR(
    ["/data?type=discordAnnouncements", authState.context.user.rawToken],
    () =>
      getDiscordNewsDataCached({
        token: authState.context.user.rawToken as string,
      }),
    {
      dedupingInterval: 10 * 60 * 1000,
    },
  );

  const announcements = data ?? [];
  const selectedAnnouncement = selectedId
    ? (announcements.find((announcement) => announcement.id === selectedId) ??
      null)
    : null;

  // Mark the latest announcement as "read" once they've opened the Discord news panel.
  useEffect(() => {
    if (!data) return;
    storeDiscordNewsReadAt(now);
  }, [data]);

  if (isLoading) return <Loading />;

  if (error || !data) return <p>{`Error`}</p>;

  if (selectedId) {
    if (!selectedAnnouncement) return <p>{t("error")}</p>;

    const createdAt = new Date(selectedAnnouncement.createdAt).getTime();
    const sender =
      selectedAnnouncement.sender.displayName ??
      selectedAnnouncement.sender.username;

    const postedLabel = getDiscordPostedLabel(createdAt, now, t);

    return (
      <div className="max-h-[450px] overflow-y-auto scrollable">
        <div
          className="flex items-center cursor-pointer mb-2"
          onClick={() => setSelectedId(null)}
        >
          <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
          <p className="text-xs underline">{t("back")}</p>
        </div>

        <div className="flex items-center justify-between mb-3 w-full">
          <div className="flex items-center gap-2">
            <NPCIcon
              width={PIXEL_SCALE * 12}
              parts={TEAM_NPCS[sender] ?? NPC_WEARABLES["pumpkin' pete"]}
            />
            <div className="flex flex-col">
              <p className="text-xs">{sender}</p>
              <a
                href={selectedAnnouncement.url}
                target="_blank"
                rel="noreferrer"
                className="text-xxs underline"
              >
                {postedLabel}
              </a>
              <span className="flex items-center gap-0.5 mt-0.5">
                <span className="text-xxs">
                  {selectedAnnouncement.likes ?? 0}
                </span>
                <img src={likeIcon} className="h-3.5  object-contain" alt="" />
              </span>
            </div>
          </div>
        </div>

        <div className="discord-news-body break-words mb-2 px-1">
          <DiscordMarkdown
            markdown={selectedAnnouncement.content}
            variant="block"
            nowMs={now}
          />
        </div>
        {selectedAnnouncement.images.map((image) => (
          <img
            key={image.url}
            src={image.url}
            className="mb-2 max-h-96 object-contain"
          />
        ))}
      </div>
    );
  }

  // TODO - put actual quests/announcements/actual news on top here (From Bumpkins)

  return (
    <div className="max-h-[450px] overflow-y-auto scrollable pr-0.5">
      {announcements.map((announcement) => {
        const createdAt = new Date(announcement.createdAt).getTime();
        const relativeTime =
          now - createdAt > 7 * 24 * 60 * 60 * 1000
            ? formatPostedDate(createdAt)
            : getRelativeTime(createdAt, now);

        const previewText = announcement.content
          .replace(/\r?\n/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim();

        return (
          <ButtonPanel
            key={announcement.id}
            onClick={() => setSelectedId(announcement.id)}
          >
            <div className="flex items-start">
              <img
                src={DISCORD_CHANNEL_ICONS[announcement.channelName]}
                className="w-6 object-contain mr-2"
              />
              <div className="flex-1 overflow-hidden pb-1">
                <p className="text-xs capitalize mb-1.5 flex items-center justify-between gap-2">
                  <span className="underline">{announcement.channelName}</span>
                </p>
                <div className="text-xxs discord-news-preview break-words">
                  <DiscordMarkdown
                    markdown={previewText}
                    variant="inline"
                    nowMs={now}
                  />
                </div>

                <div className="flex  justify-between ">
                  <span className="text-xxs">{relativeTime}</span>
                  <span className="flex items-center gap-0.5">
                    <span className="text-xxs">{announcement.likes ?? 0}</span>
                    <img
                      src={likeIcon}
                      className="h-3.5  object-contain"
                      alt=""
                    />
                  </span>
                </div>
              </div>
            </div>
          </ButtonPanel>
        );
      })}
    </div>
  );
};
