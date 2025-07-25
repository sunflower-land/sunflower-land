import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, {
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
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";
import { Equipped } from "features/game/types/bumpkin";
import { FollowerFeedSkeleton } from "./skeletons/FollowerFeedSkeleton";
import { useChatInteractions } from "../hooks/useChatInteractions";
import { useSocial } from "../hooks/useSocial";
import { SUNNYSIDE } from "assets/sunnyside";
import { InteractionSenderMetadata } from "./InteractionSenderMetadata";

type Props = {
  farmId: number;
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
  farmId,
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

  const { scrollContainerRef, scrollToBottom, scrolledToBottom } =
    useScrollToBottom();
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const {
    interactions,
    isLoadingInitialData,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate,
  } = useChatInteractions(token, farmId, playerId);

  useEffect(() => {
    mutate();
  }, []);

  useSocial({
    farmId,
    callbacks: {
      onInteraction: async (update) => {
        await mutate(
          (current = []) => {
            return [[update, ...(current[0] ?? [])], ...current.slice(1)];
          },
          {
            revalidate: false,
          },
        );

        if (!scrolledToBottom) {
          setNewMessagesCount(newMessagesCount + 1);
        } else {
          scrollToBottom();
        }
      },
    },
  });

  // Scroll to bottom when the component mounts
  useLayoutEffect(() => {
    if (!isLoadingInitialData) {
      scrollToBottom();
    }
  }, [isLoadingInitialData, scrollToBottom]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [playerId, scrollToBottom]);

  // Set scroll container as the root for the intersection observer
  useEffect(() => {
    if (scrollContainerRef.current) {
      setRootElement(scrollContainerRef.current);
    }
  }, [scrollContainerRef]);

  // Intersection observer to load more interactions when the loader is in view
  const { ref: intersectionRef, inView } = useInView({
    root: rootElement,
    rootMargin: "0px",
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      // Set the current scroll information and load more messages
      setPrevScrollHeight(scrollContainerRef?.current?.scrollHeight ?? 0);
      setPrevScrollTop(scrollContainerRef?.current?.scrollTop ?? 0);
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore, scrollContainerRef]);

  useEffect(() => {
    if (scrolledToBottom && newMessagesCount > 0) {
      scrollToBottom();
      setNewMessagesCount(0);
    }
  }, [scrolledToBottom, newMessagesCount, scrollToBottom]);

  useEffect(() => {
    if (!chatDisabled) {
      scrollToBottom();
    }
  }, [chatDisabled, scrollToBottom]);

  useLayoutEffect(() => {
    if (!isLoadingMore && scrollContainerRef.current) {
      // Restore the scroll position when new interactions are loaded
      const currentScrollHeight = scrollContainerRef.current.scrollHeight;
      const loaderHeight = loaderRef.current?.clientHeight ?? 0;
      const scrollDifference = currentScrollHeight - prevScrollHeight;

      scrollContainerRef.current.scrollTop =
        prevScrollTop + scrollDifference - loaderHeight;
    }
  }, [isLoadingMore, prevScrollHeight, prevScrollTop, scrollContainerRef]);

  const handleMessage = async (message: string) => {
    const optimisticMessage: Interaction = {
      type: "chat",
      message,
      recipient: {
        id: playerId,
        tokenUri: tokenUriBuilder(playerClothing ?? {}),
        username: playerUsername ?? `#${playerId}`,
      },
      sender: {
        id: farmId,
        tokenUri: tokenUriBuilder(myClothing),
        username: myUsername ?? `#${farmId}`,
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
          farmId: farmId,
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

  const handleAcknowledgeNewMessages = () => {
    scrollToBottom();
    setNewMessagesCount(0);
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
        className="flex flex-col max-h-[70%] h-[270px] sm:max-h-none sm:h-auto sm:flex-grow gap-1 overflow-y-auto mb-1"
        ref={scrollContainerRef}
      >
        <div className="sticky top-0 bg-brown-200 z-10 pb-1 flex justify-between">
          <Label type="default">
            {t("activity")}
            {newMessagesCount > 0 && ` (${newMessagesCount})`}
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
            onClick={handleAcknowledgeNewMessages}
          />
        </div>

        <div className="flex flex-col gap-1 -mt-2">
          <div
            ref={(el) => {
              (loaderRef as any).current = el;
              intersectionRef(el);
            }}
            id="loading-more"
            className="text-xs flex justify-center py-1 h-5"
          >
            {hasMore ? <Loading dotsOnly /> : t("playerModal.noMoreMessages")}
          </div>

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
                    <InteractionSenderMetadata
                      sender={sender}
                      createdAt={interaction.createdAt}
                    />
                    <div className="text-xs break-all">
                      {interaction.message}
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
