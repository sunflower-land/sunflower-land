import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useContext, useRef } from "react";
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
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { playerModalManager } from "./lib/playerModalManager";

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

export const Feed: React.FC<Props> = ({
  showFeed,
  setShowFeed,
  server,
  type,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);

  const username = useSelector(gameService, _username);
  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);

  const { t } = useAppTranslation();

  const {
    interactions,
    isLoadingInitialData,
    isLoadingMore,
    hasMore,
    loadMore,
    mutate,
  } = useFeedInteractions(token, farmId, type === "world");

  const handleInteractionClick = (interaction: Interaction) => {
    setShowFeed(false);
    playerModalManager.open({
      farmId: interaction.sender.id,
      username: interaction.sender.username,
      clothing: interpretTokenUri(interaction.sender.tokenUri).equipped,
    });
  };

  const showMobileFeed = showFeed && isMobile;
  const showDesktopFeed = showFeed && !isMobile;
  const hideMobileFeed = !showFeed && isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <InnerPanel
      id="hello-feed"
      className={classNames(
        `fixed ${isMobile ? "w-[75%]" : "w-[300px]"} top-0 left-0 m-2 bottom-0 z-30 transition-transform duration-200`,
        {
          "translate-x-0 w-[300px]": showDesktopFeed,
          "-translate-x-[320px]": hideDesktopFeed,
          "translate-x-0 w-full": showMobileFeed,
          // Account for the margin
          "-translate-x-[110%]": hideMobileFeed,
        },
      )}
    >
      <div className="flex flex-col gap-2 h-full w-full">
        <div className="sticky pb-1.5 top-0 flex justify-between items-center z-10 bg-[#e4a672]">
          <div className="flex items-center w-full gap-2">
            <Label type="default">
              {t("social.feed", { type: capitalize(type) })}
            </Label>
            {server && <span className="text-xxs">{server}</span>}
          </div>
          <img
            src={SUNNYSIDE.icons.close}
            alt="Close"
            style={{
              width: `${PIXEL_SCALE * 9}px`,
              height: `${PIXEL_SCALE * 9}px`,
            }}
            onClick={() => setShowFeed(false)}
          />
        </div>
        <FeedContent
          interactions={interactions}
          username={username ?? `#${farmId}`}
          isLoadingInitialData={isLoadingInitialData}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          loadMore={loadMore}
          mutate={mutate}
          onInteractionClick={handleInteractionClick}
        />
      </div>
    </InnerPanel>
  );
};

type FeedContentProps = {
  interactions: Interaction[];
  username: string;
  isLoadingInitialData: boolean;
  isLoadingMore: boolean;
  hasMore: boolean | undefined;
  onInteractionClick: (interaction: Interaction) => void;
  loadMore: () => void;
  mutate: () => void;
};

const FeedContent: React.FC<FeedContentProps> = ({
  interactions,
  username,
  isLoadingInitialData,
  onInteractionClick,
  isLoadingMore,
  hasMore,
  loadMore,
  mutate,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslation();

  if (isLoadingInitialData) {
    return <FeedSkeleton />;
  }

  if (interactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Label type="default">{t("noActivity")}</Label>
      </div>
    );
  }

  return (
    <div className="scrollable overflow-y-auto">
      <div className="flex flex-col gap-1 pr-1">
        {interactions.map((interaction, index) => {
          const direction =
            interaction?.sender.username === username ? "right" : "left";
          const sender =
            interaction?.sender.username === username
              ? "You"
              : interaction.sender.username;
          const parts = interpretTokenUri(interaction.sender.tokenUri).equipped;
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
                    <NPCIcon parts={parts} />
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
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};
