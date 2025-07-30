/* eslint-disable react-hooks/exhaustive-deps */
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { InteractionBubble } from "./components/InteractionBubble";
import { getRelativeTime } from "lib/utils/time";

import promote from "assets/icons/promote.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { isMobile } from "mobile-device-detect";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { capitalize } from "lib/utils/capitalize";
import { useFeedInteractions } from "./hooks/useFeedInteractions";
import { AuthMachineState } from "features/auth/lib/authMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { FeedSkeleton } from "./components/skeletons/FeedSkeleton";
import { Interaction } from "./types/types";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import silhouette from "assets/npcs/silhouette.webp";
import { playerModalManager } from "./lib/playerModalManager";
import { useSocial } from "./hooks/useSocial";
import { useInView } from "react-intersection-observer";
import { Loading } from "features/auth/components";
import { FollowsIndicator } from "./components/FollowsIndicator";
import { FollowList } from "./components/FollowList";
import { useFeed } from "./FeedContext";

type Props = {
  type: "world" | "local";
  showFeed: boolean;
  server?: string;
  setShowFeed: (showFeed: boolean) => void;
};

const _username = (state: MachineState) => state.context.state.username;
const _farmId = (state: MachineState) => state.context.farmId;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

const mergeUpdates = (
  current: { feed: Interaction[]; following: number[] }[] | undefined,
  update: Interaction,
) => {
  if (!current || current.length === 0) {
    return [{ feed: [update], following: [] }];
  }
  return [
    {
      feed: [update, ...(current[0]?.feed ?? [])],
      following: current[0]?.following ?? [],
    },
    ...current.slice(1),
  ];
};

export const Feed: React.FC<Props> = ({
  showFeed,
  setShowFeed,
  server,
  type,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const [showFollowing, setShowFollowing] = useState(false);

  const username = useSelector(gameService, _username);
  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);

  const { t } = useAppTranslation();

  const {
    feed,
    following,
    isLoadingInitialData,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate,
  } = useFeedInteractions(token, farmId, type === "world");
  const { setUnreadCount, lastAcknowledged, clearUnread } = useFeed();

  // Find number of unread and set unread count when the feed loads
  useEffect(() => {
    if (feed.length > 0 && !showFeed) {
      const unreadCount = feed.filter(
        (interaction) => interaction.createdAt > (lastAcknowledged ?? 0),
      ).length;

      setUnreadCount(unreadCount);
    }
  }, [feed.length]);

  useEffect(() => {
    if (showFeed) {
      clearUnread(0);
    }
  }, [showFeed, setUnreadCount]);

  useLayoutEffect(() => {
    if (showFeed && !isLoadingInitialData) {
      mutate();
    }
  }, [showFeed, isLoadingInitialData, mutate]);

  useSocial({
    farmId,
    callbacks: {
      onInteraction: async (update) => {
        await mutate((current) => mergeUpdates(current, update), {
          revalidate: false,
        });
      },
      onMilestone: async (update) => {
        // Don't show global milestones for non-world feeds if you are not following the sender
        if (update.isGlobal && !following.includes(update.sender.id)) return;

        await mutate((current) => mergeUpdates(current, update), {
          revalidate: false,
        });
      },
      onUnfollow: async () => {
        await mutate();
      },
      onFollow: async () => {
        await mutate();
      },
    },
  });

  const handleInteractionClick = (interaction: Interaction) => {
    setShowFeed(false);
    playerModalManager.open({
      farmId: interaction.sender.id,
      username: interaction.sender.username,
      clothing: interaction.sender.clothing,
    });
  };

  const handleFollowingClick = (playerId: number) => {
    setShowFeed(false);
    setShowFollowing(true);
    playerModalManager.open({
      farmId: playerId,
    });
  };

  const handleCloseFeed = (): void => {
    setShowFeed(false);
    setShowFollowing(false);
  };

  const showMobileFeed = showFeed && isMobile;
  const showDesktopFeed = showFeed && !isMobile;
  const hideMobileFeed = !showFeed && isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <InnerPanel
      className={classNames(
        `fixed ${isMobile ? "w-[75%]" : "w-[300px]"} top-0 left-0 m-2 bottom-0 z-30 transition-transform duration-200`,
        {
          "translate-x-0": showDesktopFeed || showMobileFeed,
          "-translate-x-[320px]": hideDesktopFeed,
          // Account for the margin
          "-translate-x-[110%]": hideMobileFeed,
        },
      )}
    >
      <div className="flex flex-col gap-2 h-full w-full">
        <div className="sticky top-0 flex flex-col z-10 bg-[#e4a672]">
          <div className="flex items-center gap-2 pb-1">
            <div className="flex items-center w-full gap-2">
              <Label type="default">
                {t("social.feed", { type: capitalize(type) })}
              </Label>
              {server && <span className="text-xxs">{server}</span>}
            </div>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              alt="Close"
              style={{
                width: `${PIXEL_SCALE * 9}px`,
                height: `${PIXEL_SCALE * 9}px`,
              }}
              onClick={handleCloseFeed}
            />
          </div>
          <div className="flex items-center gap-2">
            {showFollowing && (
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="w-6"
                alt="Back"
                onClick={() => setShowFollowing(false)}
              />
            )}
            <FollowsIndicator
              count={following.length}
              onClick={() => setShowFollowing(!showFollowing)}
              type="following"
              className="ml-1"
            />
          </div>
        </div>

        {showFollowing && (
          <div className="flex flex-col gap-2 -mt-2">
            <FollowList
              farmId={farmId}
              token={token}
              networkFarmId={farmId}
              networkList={following}
              networkCount={following.length}
              showLabel={false}
              type="following"
              navigateToPlayer={handleFollowingClick}
            />
          </div>
        )}

        {!showFollowing && (
          <FeedContent
            feed={feed}
            username={username ?? `#${farmId}`}
            isLoadingInitialData={isLoadingInitialData}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            loadMore={loadMore}
            onInteractionClick={handleInteractionClick}
          />
        )}
      </div>
    </InnerPanel>
  );
};

type FeedContentProps = {
  feed: Interaction[];
  username: string;
  isLoadingInitialData: boolean;
  isLoadingMore: boolean;
  hasMore: boolean | undefined;
  onInteractionClick: (interaction: Interaction) => void;
  loadMore: () => void;
};

const FeedContent: React.FC<FeedContentProps> = ({
  feed,
  username,
  isLoadingInitialData,
  onInteractionClick,
  isLoadingMore,
  hasMore,
  loadMore,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslation();

  // Intersection observer to load more interactions when the loader is in view
  const { ref: intersectionRef, inView } = useInView({
    root: scrollContainerRef.current,
    rootMargin: "0px",
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore, scrollContainerRef]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Ref's from useRef needs to have the node assigned to `current`
      (loaderRef as any).current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      intersectionRef(node);
    },
    [intersectionRef],
  );

  if (isLoadingInitialData) {
    return <FeedSkeleton />;
  }

  if (feed.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Label type="default">{t("noActivity")}</Label>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="scrollable overflow-y-auto">
      <div className="flex flex-col gap-1 pr-1">
        {feed.map((interaction, index) => {
          const direction =
            interaction?.sender.username === username ? "right" : "left";
          const sender =
            interaction?.sender.username === username
              ? "You"
              : interaction.sender.username;
          const onClick =
            interaction.type === "announcement"
              ? undefined
              : () => onInteractionClick(interaction);

          return (
            <div
              key={`${interaction.createdAt}-${index}`}
              className={classNames({
                "pl-1": direction === "left" && interaction.type === "chat",
                "pr-1": direction === "right" && interaction.type === "chat",
              })}
            >
              <InteractionBubble
                key={`${interaction.sender.id}-${interaction.createdAt}-${index}`}
                direction={direction}
                type={interaction.type}
                onClick={onClick}
              >
                <div className="text-xxs flex">
                  <div className="-ml-1 mr-1">
                    {interaction.sender.clothing ? (
                      <NPCIcon
                        parts={interaction.sender.clothing}
                        width={PIXEL_SCALE * 14}
                      />
                    ) : (
                      <img
                        id="silhouette"
                        src={silhouette}
                        className="w-3/5 absolute top-1.5 left-1.5"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      {interaction.type === "announcement" ? (
                        <img src={promote} />
                      ) : (
                        `${sender ?? ""} ${interaction.sender ? "- " : ""}`
                      )}
                      {`${getRelativeTime(interaction.createdAt)}`}
                    </span>
                    <div className="text-xs break-all">
                      {interaction.message}
                    </div>
                  </div>
                </div>
              </InteractionBubble>
            </div>
          );
        })}
      </div>
      <div
        ref={setRefs}
        id="loading-more"
        className="text-xs flex justify-center py-1 h-5"
      >
        {hasMore ? <Loading dotsOnly /> : t("playerModal.noMoreMessages")}
      </div>
    </div>
  );
};
