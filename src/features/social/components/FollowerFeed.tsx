/* eslint-disable react-hooks/exhaustive-deps */
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { InteractionBubble } from "./InteractionBubble";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { useScrollToBottom } from "lib/utils/hooks/useScrollToBottom";
import { ChatInput } from "./ChatInput";
import { isMobile } from "mobile-device-detect";
import { Interaction } from "../types/types";
import { AuthMachineState } from "features/auth/lib/authMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { useInView } from "react-intersection-observer";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";
import { Equipped } from "features/game/types/bumpkin";
import { FollowerFeedSkeleton } from "./skeletons/FollowerFeedSkeleton";
import { useChatInteractions } from "../hooks/useChatInteractions";
import { useSocial } from "../hooks/useSocial";
import { SUNNYSIDE } from "assets/sunnyside";
import { InteractionSenderMetadata } from "./InteractionSenderMetadata";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useFeed } from "../FeedContext";
import silhouette from "assets/npcs/silhouette.webp";

type Props = {
  loggedInFarmId: number;
  playerId: number;
  playerClothing?: Equipped;
  playerUsername?: string;
  playerLoading: boolean;
  chatDisabled?: boolean;
  className?: string;
  onInteraction?: (message: string) => void;
};

const _myUsername = (state: MachineState) => state.context.state.username;
const _myClothing = (state: MachineState) =>
  state.context.state.bumpkin.equipped;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const FollowerFeed: React.FC<Props> = ({
  chatDisabled,
  loggedInFarmId,
  playerId,
  playerClothing,
  playerUsername,
  playerLoading,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { t } = useAppTranslation();

  const myUsername = useSelector(gameService, _myUsername);
  const myClothing = useSelector(gameService, _myClothing);
  const token = useSelector(authService, _token);

  const {
    scrollContainerRef,
    scrollToBottom,
    isScrolledToBottomRef,
    scrolledToBottom,
    scrollNode,
  } = useScrollToBottom();

  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
  const [newLocalMessagesCount, setNewLocalMessagesCount] = useState(0);

  const { lastAcknowledged, unreadCount, clearUnread } = useFeed();

  const {
    interactions,
    isLoadingInitialData,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate,
  } = useChatInteractions(token, loggedInFarmId, playerId);

  useEffect(() => {
    // Always refetch when the component mounts
    mutate();
  }, []);

  useEffect(() => {
    if (interactions.length > 0) {
      const localUnread = interactions.filter(
        (interaction) => interaction.createdAt > (lastAcknowledged ?? 0),
      ).length;

      // Subtract the local unread count from the global unread count
      if (localUnread > 0 && scrolledToBottom) {
        clearUnread(unreadCount - localUnread);
      }
    }
  }, [interactions[0]?.createdAt]);

  useEffect(() => {
    if (newLocalMessagesCount > 0 && scrolledToBottom) {
      clearUnread(unreadCount - newLocalMessagesCount);
      setNewLocalMessagesCount(0);
    }
  }, [scrolledToBottom, newLocalMessagesCount]);

  useSocial({
    farmId: loggedInFarmId,
    callbacks: {
      onInteraction: async (update) => {
        if (update.sender.id !== playerId) return;

        await mutate(
          (current = []) => {
            return [[update, ...(current[0] ?? [])], ...current.slice(1)];
          },
          {
            revalidate: false,
          },
        );

        // Use the ref to determine the scrolled state to avoid it being caught in a closure
        if (!isScrolledToBottomRef.current) {
          setNewLocalMessagesCount(newLocalMessagesCount + 1);
        } else {
          scrollToBottom();
        }
      },
      onMilestone: async (update) => {
        if (update.sender.id !== playerId) return;

        await mutate((current = []) => {
          return [[update, ...(current[0] ?? [])], ...current.slice(1)];
        });
      },
    },
  });

  // Scroll to bottom when the component mounts
  useLayoutEffect(() => {
    if (!isLoadingInitialData) return;

    scrollToBottom();
  }, [isLoadingInitialData, playerId]);

  // Scroll to bottom when the chat box is toggled
  useEffect(() => {
    if (!scrolledToBottom) {
      scrollToBottom();
    }
  }, [chatDisabled]);

  // Intersection observer to load more interactions when the loader is in view
  const { ref: intersectionRef, inView } = useInView({
    root: scrollNode,
    rootMargin: "0px",
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      // Set the current scroll information and load more messages
      setPrevScrollHeight(scrollNode?.scrollHeight ?? 0);
      setPrevScrollTop(scrollNode?.scrollTop ?? 0);
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore, scrollNode]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      // Ref's from useRef needs to have the node assigned to `current`
      (loaderRef as any).current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      intersectionRef(node);
    },
    [intersectionRef],
  );

  useLayoutEffect(() => {
    if (!isLoadingMore && scrollNode) {
      // Restore the scroll position when new interactions are loaded
      const currentScrollHeight = scrollNode.scrollHeight;
      const loaderHeight = loaderRef.current?.clientHeight ?? 0;
      const scrollDifference = currentScrollHeight - prevScrollHeight;

      scrollNode.scrollTop = prevScrollTop + scrollDifference - loaderHeight;
    }
  }, [isLoadingMore, prevScrollHeight, prevScrollTop, scrollNode]);

  const handleMessage = async (message: string) => {
    const optimisticMessage: Interaction = {
      type: "chat",
      message,
      recipient: {
        id: playerId,
        clothing: playerClothing,
        username: playerUsername ?? `#${playerId}`,
      },
      sender: {
        id: loggedInFarmId,
        clothing: myClothing,
        username: myUsername ?? `#${loggedInFarmId}`,
      },
      createdAt: Date.now(),
    };

    // Optimistically update the messages
    mutate(
      async () => {
        const { data: response } = await postEffect({
          effect: {
            type: "message.sent",
            recipientId: playerId,
            message,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: loggedInFarmId,
        });

        // Replace page 0 with latest messages. The rest will become invalid as the
        // cursor will be changed
        return [response.interactions];
      },
      {
        revalidate: false,
        optimisticData: (_, current = []) => {
          return [
            [optimisticMessage, ...(current[0] ?? [])],
            ...current.slice(1),
          ];
        },
      },
    );

    scrollToBottom();
  };

  const scrollToBottomAndClearUnread = () => {
    scrollToBottom();

    if (newLocalMessagesCount > 0) {
      clearUnread(unreadCount - newLocalMessagesCount);
      setNewLocalMessagesCount(0);
    }
  };

  if (isLoadingInitialData || playerLoading) {
    return <FollowerFeedSkeleton />;
  }

  if (interactions.length === 0) {
    return (
      <InnerPanel
        className={classNames("flex flex-col justify-between", {
          "w-full": isMobile,
          "w-2/5 h-auto": !isMobile,
        })}
      >
        <div className="flex flex-col gap-1 pl-1">
          <div className="sticky top-0 bg-brown-200 z-10 pb-1">
            <Label type="default">{t("activity")}</Label>
          </div>
          <div className="text-xs">{t("noActivity")}</div>
        </div>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel
      id="follower-feed"
      className={classNames("flex flex-col", {
        "w-full": isMobile,
        "w-2/5": !isMobile,
      })}
    >
      <div
        id="scroll-container"
        className="flex flex-col max-h-[70%] h-[260px] sm:max-h-none sm:h-auto sm:flex-grow gap-1 overflow-y-auto mb-1"
        ref={scrollContainerRef}
      >
        <div className="sticky -top-0.5 bg-brown-200 z-10 pb-1 pt-1 flex justify-between">
          <Label type="default">
            {t("activity")}
            {newLocalMessagesCount > 0 && ` (${newLocalMessagesCount})`}
          </Label>

          <img
            src={SUNNYSIDE.icons.arrow_down}
            alt="arrow-down"
            className={classNames(
              "w-5 mr-2 object-contain cursor-pointer transition-opacity duration-100",
              {
                "opacity-0": scrolledToBottom,
              },
            )}
            onClick={scrollToBottomAndClearUnread}
          />
        </div>

        <div className="flex flex-col gap-1">
          {interactions.length > 3 && (
            <div
              ref={setRefs}
              id="loading-more"
              className="text-xs flex justify-center py-1 h-6"
            >
              {hasMore ? <Loading dotsOnly /> : t("playerModal.noMoreMessages")}
            </div>
          )}

          {interactions
            .slice()
            .reverse()
            .map((interaction, index) => {
              const direction =
                interaction.sender.username === myUsername ? "right" : "left";

              const sender =
                interaction.sender.username === myUsername
                  ? t("you")
                  : interaction.sender.username;

              return (
                <div
                  key={`${interaction.createdAt}-${index}`}
                  className={classNames({
                    "pl-1": direction === "left" && interaction.type === "chat",
                    "pr-1":
                      direction === "right" && interaction.type === "chat",
                  })}
                >
                  <InteractionBubble
                    key={`${interaction.sender.id}-${interaction.createdAt}-${index}`}
                    direction={direction}
                    type={interaction.type}
                  >
                    <div className="flex">
                      <div className="-ml-1 mr-1 relative">
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
                        <InteractionSenderMetadata
                          sender={sender}
                          createdAt={interaction.createdAt}
                        />
                        <div
                          className="text-xs break-words"
                          style={{
                            lineHeight: 1,
                            userSelect: "text",
                          }}
                        >
                          {interaction.message}
                        </div>
                      </div>
                    </div>
                  </InteractionBubble>
                </div>
              );
            })}
        </div>
      </div>
      {!chatDisabled && (
        <ChatInput disabled={chatDisabled} onEnter={handleMessage} />
      )}
    </InnerPanel>
  );
};
