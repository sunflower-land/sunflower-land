import React, { useEffect, useMemo, useState } from "react";

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
import newsIcon from "assets/icons/chapter_icon_2.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import { NPCFixed } from "features/island/bumpkin/components/NPC";
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
  Elias: NPC_WEARABLES["pumpkin' pete"],
  Aeon: NPC_WEARABLES.dreadhorn,
  Dcol: NPC_WEARABLES.grubnuk,
  Spencer: NPC_WEARABLES["farmer flesh"],
  Craig: NPC_WEARABLES.craig,
  Jammy: NPC_WEARABLES.goldtooth,
};

function isSafeHttpUrl(href: string) {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type AnyToken = any;

function renderInlineToken(token: AnyToken, key: React.Key): React.ReactNode {
  switch (token?.type) {
    case "text":
    case "escape":
      return <React.Fragment key={key}>{token.text}</React.Fragment>;
    case "strong":
      return (
        <strong key={key}>
          {renderInlineTokens(token.tokens ?? [], `${String(key)}-s`)}
        </strong>
      );
    case "em":
      return (
        <em key={key}>
          {renderInlineTokens(token.tokens ?? [], `${String(key)}-e`)}
        </em>
      );
    case "del":
      return (
        <del key={key}>
          {renderInlineTokens(token.tokens ?? [], `${String(key)}-d`)}
        </del>
      );
    case "codespan":
      return (
        <code key={key} className="px-1 rounded-sm bg-brown-200">
          {token.text}
        </code>
      );
    case "br":
      return <br key={key} />;
    case "link": {
      const href = token.href as string | undefined;
      const safe = href && isSafeHttpUrl(href);
      const children =
        token.tokens && token.tokens.length
          ? renderInlineTokens(token.tokens, `${String(key)}-l`)
          : token.text;

      return safe ? (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
          title={token.title}
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
          {token?.text ?? token?.raw ?? ""}
        </React.Fragment>
      );
  }
}

function renderInlineTokens(
  tokens: AnyToken[],
  keyPrefix: string,
): React.ReactNode {
  return (
    <>{tokens.map((t, idx) => renderInlineToken(t, `${keyPrefix}-${idx}`))}</>
  );
}

function renderBlockTokens(
  tokens: AnyToken[],
  keyPrefix: string,
): React.ReactNode {
  return (
    <>
      {tokens.map((token, idx) => {
        const key = `${keyPrefix}-${idx}`;

        switch (token?.type) {
          case "paragraph":
            return (
              <div key={key} className="mb-2 last:mb-0">
                {renderInlineTokens(token.tokens ?? [], `${key}-p`)}
              </div>
            );
          case "text":
            // In some cases `lexer` yields top-level "text"
            return (
              <div key={key} className="mb-2 last:mb-0">
                {renderInlineTokens(
                  token.tokens ?? [{ type: "text", text: token.text }],
                  `${key}-t`,
                )}
              </div>
            );
          case "code":
            return (
              <pre
                key={key}
                className="mb-2 last:mb-0 p-2 rounded-sm bg-brown-200 overflow-x-auto"
              >
                <code>{token.text}</code>
              </pre>
            );
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="mb-2 last:mb-0 border-l-2 border-brown-300 pl-2"
              >
                {renderBlockTokens(token.tokens ?? [], `${key}-bq`)}
              </blockquote>
            );
          case "list": {
            const ListTag = token.ordered ? "ol" : "ul";
            return (
              <ListTag key={key} className="mb-2 last:mb-0 pl-4 list-disc">
                {(token.items ?? []).map((item: AnyToken, itemIdx: number) => (
                  <li key={`${key}-li-${itemIdx}`}>
                    {item.tokens
                      ? renderBlockTokens(item.tokens, `${key}-li-${itemIdx}`)
                      : item.text}
                  </li>
                ))}
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

function DiscordMarkdown({
  markdown,
  variant,
}: {
  markdown: string;
  variant: "block" | "inline";
}) {
  const nodes = useMemo(() => {
    const tokens = marked.lexer(markdown, {
      gfm: true,
      breaks: true,
    }) as AnyToken[];

    if (variant === "inline") {
      const firstParagraph =
        tokens.find((t) => t.type === "paragraph") ?? tokens[0];
      const inlineTokens = firstParagraph?.tokens ?? [];
      return renderInlineTokens(inlineTokens, "md-inline");
    }

    return renderBlockTokens(tokens, "md-block");
  }, [markdown, variant]);

  return <>{nodes}</>;
}

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
    storeDiscordNewsReadAt(Date.now());
  }, [data]);

  if (isLoading) return <Loading />;

  if (error || !data) return <p>{`Error`}</p>;

  if (selectedId) {
    if (!selectedAnnouncement) return <p>{t("error")}</p>;

    const createdAt = new Date(selectedAnnouncement.createdAt).getTime();
    const relativeTime = getRelativeTime(createdAt, now);
    const sender =
      selectedAnnouncement.sender.displayName ??
      selectedAnnouncement.sender.username;

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
            <NPCFixed
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
                {`${relativeTime} on Discord`}
              </a>
            </div>
          </div>
        </div>

        <div className="text-sm discord-news-body break-words mb-2 px-1">
          <DiscordMarkdown
            markdown={selectedAnnouncement.content}
            variant="block"
          />
        </div>
        {selectedAnnouncement.images.map((image) => (
          <img key={image.url} src={image.url} className="w-full mb-2" />
        ))}
      </div>
    );
  }

  // TODO - put actual quests/announcements/actual news on top here (From Bumpkins)

  return (
    <div className="max-h-[450px] overflow-y-auto scrollable pr-0.5">
      {announcements.map((announcement) => {
        const createdAt = new Date(announcement.createdAt).getTime();
        const relativeTime = getRelativeTime(createdAt, now);
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
                <p className="text-xxs capitalize mb-1.5 flex items-center justify-between gap-2">
                  <span className="underline">{announcement.channelName}</span>
                  <span>{relativeTime}</span>
                </p>
                <div className="text-sm discord-news-preview break-words">
                  <DiscordMarkdown markdown={previewText} variant="inline" />
                </div>
              </div>
            </div>
          </ButtonPanel>
        );
      })}
    </div>
  );
};
