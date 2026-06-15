import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { NewsContent } from "./NewsContent";

import { Context } from "features/game/GameProvider";
import { useAuth } from "features/auth/lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";

import { NPCFixed } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MANAGER_IDS } from "lib/access";
import { CONFIG } from "lib/config";

import { PlayerModal } from "features/social/PlayerModal";
import { playerModalManager } from "features/social/lib/playerModalManager";

import { getShowcasedTweets } from "features/game/actions/getShowcasedTweets";
import type { ShowcasedTweet } from "features/game/types/social";
import type { Equipped } from "features/game/types/bumpkin";
import type { MachineState } from "features/game/lib/gameMachine";

import { SUNNYSIDE } from "assets/sunnyside";
import letter from "assets/icons/letter.png";

const _farmId = (state: MachineState) => state.context.farmId;
const _removing = (state: MachineState) => state.matches("removingShowcase");
const _removeSuccess = (state: MachineState) =>
  state.matches("removingShowcaseSuccess");
const _removeFailed = (state: MachineState) =>
  state.matches("removingShowcaseFailed");

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
  onRemoved: () => void;
}

export const CommunityFeed: React.FC<Props> = ({ onAddPost, onRemoved }) => {
  const { gameService } = useContext(Context);
  const { authState } = useAuth();
  const { t } = useAppTranslation();
  const now = useNow();

  const token = authState.context.user.rawToken as string;

  const farmId = useSelector(gameService, _farmId);
  // Admins can always showcase / remove posts. On non-production environments
  // (testnet / local dev) everyone can, to make manual testing easy.
  const isAdmin = MANAGER_IDS.includes(farmId) || CONFIG.NETWORK !== "mainnet";

  const removing = useSelector(gameService, _removing);
  const removeSuccess = useSelector(gameService, _removeSuccess);
  const removeFailed = useSelector(gameService, _removeFailed);

  const [tweets, setTweets] = useState<ShowcasedTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<ShowcasedTweet>();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const removeHandledRef = useRef(false);

  useEffect(() => {
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
  }, [token]);

  // On a successful removal, reset the machine and hand back to the parent,
  // which remounts the feed (refetching the now-updated list).
  useEffect(() => {
    if (removeSuccess && !removeHandledRef.current) {
      removeHandledRef.current = true;
      gameService.send("CONTINUE");
      onRemoved();
    }
    if (!removeSuccess) removeHandledRef.current = false;
  }, [removeSuccess, gameService, onRemoved]);

  const removePost = () => {
    if (!selected) return;
    gameService.send("showcase.removed", {
      effect: {
        type: "showcase.removed",
        tweetId: selected.tweetId,
      },
    });
  };

  // Reset the machine from the failed state back to the detail view.
  const dismissRemoveError = () => {
    gameService.send("CONTINUE");
    setConfirmRemove(false);
  };

  const authorName = (tweet: ShowcasedTweet) =>
    tweet.authorUsername ?? `@${tweet.twitterHandle}`;

  const openAuthor = (tweet: ShowcasedTweet) =>
    playerModalManager.open({
      farmId: tweet.authorFarmId,
      username: tweet.authorUsername,
      clothing: tweet.bumpkin,
    });

  // Detail view for a single post. Mirrors the Discord news detail layout:
  // back button, author/NPC header, body text, then the image.
  if (selected) {
    return (
      <>
        <InnerPanel className="p-1">
          <div className="max-h-[450px] overflow-y-auto scrollable">
            <div
              className="flex items-center cursor-pointer mb-2 w-fit"
              onClick={() => setSelected(undefined)}
            >
              <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
              <p className="text-xs underline">{t("back")}</p>
            </div>

            {removing ? (
              <Loading text={t("community.feed.removing")} />
            ) : removeFailed ? (
              <div className="p-1">
                <Label type="danger" className="mb-2">
                  {t("community.feed.removeError")}
                </Label>
                <Button onClick={dismissRemoveError}>
                  {t("community.addPost.tryAgain")}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 w-full">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => openAuthor(selected)}
                  >
                    <BumpkinAvatar
                      parts={selected.bumpkin}
                      size={PIXEL_SCALE * 12}
                    />
                    <div className="flex flex-col">
                      <p className="text-xs capitalize">
                        {authorName(selected)}
                      </p>
                      <a
                        href={selected.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xxs underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getRelativeTime(selected.postedAt, now)}
                      </a>
                    </div>
                  </div>
                </div>

                <NewsContent
                  content={selected.content}
                  variant="body"
                  nowMs={now}
                  className="mb-2 px-1"
                />

                {selected.image && (
                  <img
                    src={selected.image}
                    className="mb-2 max-h-96 object-contain"
                  />
                )}

                {isAdmin &&
                  (confirmRemove ? (
                    <div className="flex gap-1">
                      <Button onClick={() => setConfirmRemove(false)}>
                        {t("cancel")}
                      </Button>
                      <Button onClick={removePost}>
                        {t("community.feed.remove.confirm")}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setConfirmRemove(true)}>
                      {t("community.feed.remove")}
                    </Button>
                  ))}
              </>
            )}
          </div>
        </InnerPanel>
        <PlayerModal
          loggedInFarmId={farmId}
          token={token}
          hasAirdropAccess={false}
        />
      </>
    );
  }

  return (
    <InnerPanel>
      <div className="flex items-center justify-between p-1">
        <Label type="default">{t("community.feed.heading")}</Label>
        {isAdmin && (
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
                  <NewsContent
                    content={tweet.content}
                    variant="preview"
                    nowMs={now}
                    className="mb-1"
                  />
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
