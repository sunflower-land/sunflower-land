import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";

import { Context } from "features/game/GameProvider";
import { useAuth } from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";

import { NPCFixed } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MANAGER_IDS } from "lib/access";
import { CONFIG } from "lib/config";

import { getShowcasedTweets } from "features/game/actions/getShowcasedTweets";
import type { ShowcasedTweet } from "features/game/types/social";
import type { Equipped } from "features/game/types/bumpkin";
import type { MachineState } from "features/game/lib/gameMachine";

import { SUNNYSIDE } from "assets/sunnyside";
import letter from "assets/icons/letter.png";

const _farmId = (state: MachineState) => state.context.farmId;

const IMAGE_SIZE = 50;

// NPCFixed renders the bumpkin correctly at this width; we CSS-scale it down
// for smaller avatars rather than passing a tiny width (which would crop it).
const NPC_BASE_WIDTH = PIXEL_SCALE * 16;

const BumpkinAvatar: React.FC<{ parts: Equipped; size: number }> = ({
  parts,
  size,
}) => (
  <div
    className="overflow-hidden flex-shrink-0"
    style={{ width: size, height: size }}
  >
    <div
      style={{
        width: NPC_BASE_WIDTH,
        height: NPC_BASE_WIDTH,
        transform: `scale(${size / NPC_BASE_WIDTH})`,
        transformOrigin: "top left",
      }}
    >
      <NPCFixed parts={parts} width={NPC_BASE_WIDTH} />
    </div>
  </div>
);

interface Props {
  onAddPost: () => void;
}

export const CommunityFeed: React.FC<Props> = ({ onAddPost }) => {
  const { gameService } = useContext(Context);
  const { authState } = useAuth();
  const { t } = useAppTranslation();
  const now = useNow();

  const farmId = useSelector(gameService, _farmId);
  // Admins can always showcase posts. On non-production environments
  // (testnet / local dev) everyone can, to make manual testing easy.
  const canAddPost =
    MANAGER_IDS.includes(farmId) || CONFIG.NETWORK !== "mainnet";

  const [tweets, setTweets] = useState<ShowcasedTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<ShowcasedTweet>();

  useEffect(() => {
    const token = authState.context.user.rawToken as string | undefined;
    if (!token) return;

    let active = true;

    getShowcasedTweets({ token })
      .then((data) => {
        if (!active) return;
        setTweets(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authState.context.user.rawToken]);

  const authorName = (tweet: ShowcasedTweet) =>
    tweet.authorUsername ?? `@${tweet.twitterHandle}`;

  // Detail view for a single post.
  if (selected) {
    return (
      <InnerPanel className="p-1">
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer w-fit"
            onClick={() => setSelected(undefined)}
          >
            <img src={SUNNYSIDE.icons.arrow_left} className="h-5 mr-1" />
            <span className="text-sm underline">{t("back")}</span>
          </div>
          <span
            className="text-sm underline cursor-pointer"
            onClick={() => window.open(selected.url, "_blank")}
          >
            {t("community.feed.viewOnX")}
          </span>
        </div>

        <div className="flex items-center mb-2">
          <div className="mr-2">
            <BumpkinAvatar parts={selected.bumpkin} size={32} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm capitalize truncate">
              {authorName(selected)}
            </p>
            <p className="text-xxs">
              {getRelativeTime(selected.postedAt, now)}
            </p>
          </div>
        </div>

        <p className="text-sm break-words whitespace-pre-wrap mb-2 p-2">
          {selected.content}
        </p>

        {selected.image && (
          <img src={selected.image} className="w-full rounded mb-2 p-2" />
        )}
      </InnerPanel>
    );
  }

  return (
    <InnerPanel>
      <div className="flex items-center justify-between p-1">
        <Label type="default">{t("community.feed.heading")}</Label>
        {canAddPost && (
          <Button className="w-auto px-3" onClick={onAddPost}>
            {t("community.feed.addPost")}
          </Button>
        )}
      </div>
      <p className="text-xs px-1 mb-2">{t("community.feed.description")}</p>

      <div
        className="overflow-y-auto scrollable pr-1"
        style={{ maxHeight: "350px" }}
      >
        {loading && <Loading />}

        {!loading && error && (
          <p className="text-sm p-2">{t("community.feed.error")}</p>
        )}

        {!loading && !error && tweets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-4">
            <img
              src={letter}
              className="my-2"
              style={{ width: `${PIXEL_SCALE * 14}px` }}
            />
            <p className="text-sm">{t("community.feed.empty")}</p>
          </div>
        )}

        {!loading &&
          !error &&
          tweets.map((tweet) => (
            <ButtonPanel
              key={tweet.tweetId}
              onClick={() => setSelected(tweet)}
              className="mb-1"
            >
              <div className="flex items-start">
                <div
                  className="mr-2 flex-shrink-0 flex items-center justify-center overflow-hidden rounded bg-brown-300"
                  style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                >
                  {tweet.image ? (
                    <img
                      src={tweet.image}
                      className="w-full h-full object-cover"
                      alt={t("community.feed.title")}
                    />
                  ) : (
                    <BumpkinAvatar parts={tweet.bumpkin} size={IMAGE_SIZE} />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-xs break-words line-clamp-2 mb-1">
                    {tweet.content}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 overflow-hidden">
                      <BumpkinAvatar parts={tweet.bumpkin} size={20} />
                      <span className="text-xxs capitalize truncate">
                        {authorName(tweet)}
                      </span>
                    </div>
                    <span className="text-xxs flex-shrink-0">
                      {getRelativeTime(tweet.postedAt, now)}
                    </span>
                  </div>
                </div>
              </div>
            </ButtonPanel>
          ))}
      </div>
    </InnerPanel>
  );
};
