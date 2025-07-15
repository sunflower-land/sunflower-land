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
import { getRelativeTime } from "lib/utils/time";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import promote from "assets/icons/promote.webp";
import { useScrollToBottom } from "lib/utils/hooks/useScrollToBottom";
import { ChatInput } from "./ChatInput";
import { isMobile } from "mobile-device-detect";
import { getChatMessages } from "../actions/getChatMessages";
import useSWRInfinite from "swr/infinite";
import { Interaction } from "../types/types";
import { AuthMachineState } from "features/auth/lib/authMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { useInView } from "react-intersection-observer";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  farmId: number;
  followedPlayerId: number;
  chatDisabled?: boolean;
  className?: string;
  onInteraction: (message: string) => void;
};

const PAGE_SIZE = 20;

export function useInteractions(
  token: string,
  farmId: number,
  followedPlayerId: number,
) {
  const getKey = (_: number, previousPageData: Interaction[]) => {
    if (previousPageData && previousPageData.length === 0) return null;
    const cursor =
      previousPageData?.[previousPageData.length - 1]?.createdAt ?? 0;
    return `chat-${farmId}-${followedPlayerId}-${cursor}`;
  };

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (key) => {
      const cursor = key.split("-")[3];
      return getChatMessages({
        token,
        farmId,
        followedPlayerId,
        cursor: Number(cursor),
      });
    },
    {
      revalidateFirstPage: false,
    },
  );

  const interactions = data ? data.flat() : [];

  return {
    interactions,
    isLoadingInitialData: !data && isValidating,
    isLoadingMore:
      isValidating && size > 0 && typeof data?.[size - 1] === "undefined",
    hasMore: data && data[data.length - 1]?.length === PAGE_SIZE,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}

const _username = (state: MachineState) => state.context.state.username;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const FollowerFeed: React.FC<Props> = ({
  chatDisabled,
  farmId,
  followedPlayerId,
  onInteraction,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { t } = useAppTranslation();

  const username = useSelector(gameService, _username);
  const token = useSelector(authService, _token);

  const {
    interactions,
    isLoadingInitialData,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useInteractions(token, farmId, followedPlayerId);

  const scrollContainerRef = useScrollToBottom([isLoadingInitialData]);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);
  const [prevScrollTop, setPrevScrollTop] = useState<number>(0);

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

  // Set the current scroll information and load more messages
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      setPrevScrollHeight(scrollContainerRef?.current?.scrollHeight ?? 0);
      setPrevScrollTop(scrollContainerRef?.current?.scrollTop ?? 0);
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore, scrollContainerRef]);

  // Restore the scroll position when new interactions are loaded
  useLayoutEffect(() => {
    if (!isLoadingMore && scrollContainerRef.current) {
      const currentScrollHeight = scrollContainerRef.current.scrollHeight;
      const loaderHeight = loaderRef.current?.clientHeight ?? 0;
      const scrollDifference = currentScrollHeight - prevScrollHeight;

      scrollContainerRef.current.scrollTop =
        prevScrollTop + scrollDifference - loaderHeight;
    }
  }, [isLoadingMore, prevScrollHeight, prevScrollTop, scrollContainerRef]);

  const handleInteraction = (message: string) => {
    onInteraction(message);
  };

  if (isLoadingInitialData) {
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
          <div className="text-xs loading">{t("loading")}</div>
        </div>
      </InnerPanel>
    );
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
      className={classNames("flex flex-col justify-between", {
        "w-full": isMobile,
        "w-2/5 h-auto": !isMobile,
      })}
    >
      <div
        className="flex flex-col gap-1 max-h-[70%] overflow-y-auto h-[270px] sm:h-auto"
        ref={scrollContainerRef}
      >
        <div className="sticky top-0 bg-brown-200 z-10 pb-1">
          <Label type="default">{t("activity")}</Label>
        </div>

        <div className="flex flex-col gap-1 -mt-2">
          <div
            ref={(el) => {
              (loaderRef as any).current = el;
              intersectionRef(el);
            }}
            id="loading-more"
            className="text-xs flex justify-center py-1"
          >
            {hasMore ? <Loading dotsOnly /> : t("playerModal.noMoreMessages")}
          </div>

          {interactions
            .slice()
            .reverse()
            .map((interaction, index) => {
              const direction =
                interaction?.sender.username === username ? "right" : "left";
              const sender =
                interaction?.sender.username === username
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
                    <div className="text-xxs">
                      <span className="flex items-center gap-1">
                        {interaction.type === "announcement" ? (
                          <img src={promote} />
                        ) : (
                          `${sender ?? ""} ${interaction.sender ? "- " : ""}`
                        )}
                        {`${getRelativeTime(interaction.createdAt)}`}
                      </span>
                    </div>
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
        <ChatInput disabled={chatDisabled} onEnter={handleInteraction} />
      )}
    </InnerPanel>
  );
};
