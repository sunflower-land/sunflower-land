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
import followIcon from "assets/icons/follow.webp";
import helpIcon from "assets/icons/help.webp";

import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { isMobile } from "mobile-device-detect";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
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
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { Button } from "components/ui/Button";
import socialPointsIcon from "assets/icons/social_score.webp";
import { discoveryModalManager } from "./lib/discoveryModalManager";
import { FeedFilters } from "./components/FeedFilters";
import { getFilter, storeFilter } from "./lib/persistFilter";
import { HelpInfoPopover } from "./components/HelpInfoPopover";
import { SearchBar } from "./components/SearchBar";
import { Detail } from "./actions/getFollowNetworkDetails";
import { useNow } from "lib/utils/hooks/useNow";

type Props = {
  type: "world" | "local";
  showFeed: boolean;
  server?: string;
  setShowFeed: (showFeed: boolean) => void;
};

const _username = (state: MachineState) =>
  (state.context.visitorState ?? state.context.state).username;
const _farmId = (state: MachineState) =>
  state.context.visitorId ?? state.context.farmId;
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

export type FeedFilter = "all" | "help" | "chat" | "cheer" | "follow";
export type FeedFilterOption = {
  value: FeedFilter;
  label: string;
};

export const Feed: React.FC<Props> = ({
  showFeed,
  setShowFeed,
  server,
  type,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const [showFollowing, setShowFollowing] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<FeedFilter>(getFilter());
  const [searchResults, setSearchResults] = useState<Detail[]>([]);

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
  } = useFeedInteractions(token, farmId, selectedFilter, type === "world");
  const { setUnreadCount, lastAcknowledged, clearUnread } = useFeed();

  // Handle clicks outside the feed to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFeed &&
        feedRef.current &&
        !feedRef.current.contains(event.target as Node)
      ) {
        handleCloseFeed();
      }
    };

    if (showFeed) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFeed]);

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
  }, [showFeed]);

  useEffect(() => {
    storeFilter(selectedFilter);
  }, [selectedFilter]);

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

  useOnMachineTransition(
    gameService,
    "followingFarm",
    "followingFarmSuccess",
    mutate,
  );

  useOnMachineTransition(
    gameService,
    "followingFarmVisiting",
    "followingFarmVisitingSuccess",
    mutate,
  );

  useOnMachineTransition(
    gameService,
    "helpingFarm",
    "helpingFarmSuccess",
    mutate,
  );

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

  const handleFollowClick = (id: number) => {
    gameService.send("farm.followed", {
      effect: {
        type: "farm.followed",
        followedId: id,
      },
    });
  };

  const handleCloseFeed = (): void => {
    setShowFeed(false);
  };

  const showMobileFeed = showFeed && isMobile;
  const showDesktopFeed = showFeed && !isMobile;
  const hideMobileFeed = !showFeed && isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <InnerPanel
      className={classNames(
        `fixed ${isMobile ? "w-[75%]" : "w-[320px]"} inset-safe-area m-2 z-30 transition-transform duration-200`,
        {
          "translate-x-0": showDesktopFeed || showMobileFeed,
          "-translate-x-[330px]": hideDesktopFeed,
          // Account for the margin
          "-translate-x-[110%]": hideMobileFeed,
        },
      )}
      divRef={feedRef}
    >
      <div className="flex flex-col gap-2 h-full w-full">
        <div className="sticky top-0 flex flex-col z-10 bg-[#e4a672]">
          <div className="flex items-center gap-2 pb-1">
            <div className="flex items-center w-full gap-2">
              {showFollowing && (
                <img
                  src={SUNNYSIDE.icons.arrow_left}
                  className="w-6"
                  alt="Back"
                  onClick={() => setShowFollowing(false)}
                />
              )}
              <Label type="default">{t("feed")}</Label>
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
          <div className="flex items-center justify-between gap-1 w-full mb-2">
            <div
              className="flex ml-1.5 items-center gap-1 text-xs underline cursor-pointer"
              onClick={() => {
                setShowFollowing(false);
                setShowFeed(false);
                playerModalManager.open({
                  farmId,
                });
              }}
            >
              <img
                src={SUNNYSIDE.icons.player_small}
                className="w-4 mt-1 whitespace-nowrap"
              />
              {t("myProfile")}
            </div>
            <FollowsIndicator
              showSingleBumpkin
              count={following.length}
              onClick={() => setShowFollowing(!showFollowing)}
              type="following"
              className="ml-1 -mr-3.5"
            />
          </div>
          <div className="flex items-center justify-between gap-1 w-full">
            <div
              className="flex ml-1.5 items-center gap-1 text-xs underline cursor-pointer"
              onClick={() => {
                setShowFollowing(false);
                setShowFeed(false);
                discoveryModalManager.open("leaderboard");
              }}
            >
              <img
                src={socialPointsIcon}
                className="w-4 mt-1 whitespace-nowrap"
              />
              {t("leaderboard")}
            </div>
            <div
              className="flex ml-1.5 mr-1 items-center gap-1 text-xs underline cursor-pointer whitespace-nowrap"
              onClick={() => {
                setShowFollowing(false);
                setShowFeed(false);
                discoveryModalManager.open("search");
              }}
            >
              {t("playerSearch.searchPlayer")}
              <img src={SUNNYSIDE.icons.search} className="w-4" />
            </div>
          </div>
        </div>
        {!showFollowing && (
          <FeedFilters
            options={[
              { value: "all", label: "All" },
              {
                value: "help",
                label: "Helped",
              },
              { value: "chat", label: "Chat" },
              {
                value: "cheer",
                label: "Cheered",
              },
              { value: "follow", label: "Follows" },
            ]}
            value={selectedFilter}
            onChange={(value) => setSelectedFilter(value)}
          />
        )}

        {showFollowing && (
          <>
            <SearchBar context="following" onSearchResults={setSearchResults} />
            <div
              ref={scrollContainerRef}
              className="flex flex-col gap-2 overflow-hidden overflow-y-auto scrollable"
            >
              <FollowList
                loggedInFarmId={farmId}
                token={token}
                searchResults={searchResults}
                networkFarmId={farmId}
                networkList={following}
                networkCount={following.length}
                showLabel={false}
                networkType="following"
                scrollContainerRef={scrollContainerRef}
                navigateToPlayer={handleFollowingClick}
              />
            </div>
          </>
        )}

        {!showFollowing && (
          <FeedContent
            feed={feed}
            following={following ?? []}
            username={username ?? `#${farmId}`}
            isLoadingInitialData={isLoadingInitialData}
            isLoadingMore={isLoadingMore}
            onFollowClick={handleFollowClick}
            hasMore={hasMore}
            loadMore={loadMore}
            onInteractionClick={handleInteractionClick}
            filter={selectedFilter}
          />
        )}
      </div>
    </InnerPanel>
  );
};

const HelpIconWithPopover: React.FC<{
  helpedThemToday: boolean;
}> = ({ helpedThemToday }) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div
      className="relative flex h-8 w-10 cursor-pointer items-center justify-center"
      onPointerOver={(e) => {
        if (e.pointerType === "mouse") {
          setShowPopover(true);
        }
      }}
      onPointerOut={(e) => {
        if (e.pointerType === "mouse") {
          setShowPopover(false);
        }
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setShowPopover(!showPopover);
        setTimeout(() => {
          setShowPopover(false);
        }, 1500);
      }}
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <img src={helpIcon} className="w-5 h-5" />
      <HelpInfoPopover
        className="absolute right-0 -top-6 z-20 w-max text-black"
        showPopover={showPopover}
        onHide={() => setShowPopover(false)}
        helpedThemToday={helpedThemToday}
      />
    </div>
  );
};

type FeedContentProps = {
  feed: Interaction[];
  following: number[];
  username: string;
  isLoadingInitialData: boolean;
  isLoadingMore: boolean;
  hasMore: boolean | undefined;
  filter: FeedFilter;
  onInteractionClick: (interaction: Interaction) => void;
  onFollowClick: (id: number) => void;
  loadMore: () => void;
};

const FeedContent: React.FC<FeedContentProps> = ({
  feed,
  following,
  username,
  isLoadingInitialData,
  onInteractionClick,
  onFollowClick,
  isLoadingMore,
  hasMore,
  loadMore,
  filter,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslation();
  const [canPaginate, setCanPaginate] = useState(false);

  // Intersection observer to load more interactions when the loader is in view
  const { ref: intersectionRef, inView } = useInView({
    root: scrollContainerRef.current,
    rootMargin: "0px",
    threshold: 0.1,
  });

  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // tiny buffer so off-by-1 doesn’t trigger
    setCanPaginate(el.scrollHeight > el.clientHeight + 2);
  }, [feed.length, filter]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
      });
    }
  }, [filter]);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && canPaginate) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore, scrollContainerRef]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Ref's from useRef needs to have the node assigned to `current`
      (loaderRef as any).current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      intersectionRef(node);
      return undefined;
    },
    [intersectionRef],
  );

  const handleFollowClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    e.stopPropagation();
    onFollowClick(id);
  };

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
    <div
      ref={scrollContainerRef}
      className="scrollable overflow-hidden overflow-y-auto"
    >
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
          const isFollowing = following.includes(interaction.sender.id);
          const isAtMaxFollowing = !isFollowing && following.length >= 5000;

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
                  <div className="flex flex-col w-full gap-1">
                    <span className="flex items-center gap-1">
                      {interaction.type === "announcement" ? (
                        <img src={promote} />
                      ) : (
                        `${sender ?? ""} ${interaction.sender ? "- " : ""}`
                      )}
                      <RelativeTime createdAt={interaction.createdAt} />
                    </span>
                    <div className="flex justify-between items-center w-full">
                      <div
                        className="text-xs break-words w-full"
                        style={{
                          lineHeight: 1,
                        }}
                      >
                        {interaction.message}
                      </div>
                      {!!interaction.helpedThemToday && (
                        <HelpIconWithPopover
                          helpedThemToday={interaction.helpedThemToday}
                        />
                      )}
                    </div>
                  </div>
                  {!isAtMaxFollowing && (
                    <div className="flex items-center justify-end flex-grow cursor-pointer">
                      {interaction.type === "follow" && !isFollowing && (
                        <Button
                          className="text-xs flex h-10 w-10 justify-center items-center"
                          onClick={(e) =>
                            handleFollowClick(e, interaction.sender.id)
                          }
                        >
                          <img
                            src={followIcon}
                            className="w-6 object-contain"
                          />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </InteractionBubble>
            </div>
          );
        })}
      </div>
      {canPaginate && (
        <div
          ref={setRefs}
          id="loading-more"
          className="text-xs flex justify-center py-1 h-6"
        >
          {hasMore ? <Loading dotsOnly /> : t("playerModal.noMoreMessages")}
        </div>
      )}
    </div>
  );
};

const RelativeTime: React.FC<{ createdAt: number }> = ({ createdAt }) => {
  const now = useNow({ live: true });
  return <>{getRelativeTime(createdAt, now)}</>;
};
