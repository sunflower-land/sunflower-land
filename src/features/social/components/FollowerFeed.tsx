import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext } from "react";
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
import { Interaction } from "../types/types";

type Props = {
  chatDisabled?: boolean;
  className?: string;
  interactions: Interaction[];
  onInteraction: (message: string) => void;
};

const _username = (state: MachineState) => state.context.state.username;

export const FollowerFeed: React.FC<Props> = ({
  chatDisabled,
  interactions = [],
  onInteraction,
}) => {
  const { gameService } = useContext(Context);
  const username = useSelector(gameService, _username);

  const scrollContainerRef = useScrollToBottom([interactions.length]);

  const handleInteraction = (message: string) => {
    onInteraction(message);
  };

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
          <Label type="default">{`Activity`}</Label>
        </div>

        {interactions.length === 0 && (
          <div className="flex flex-col gap-1 pl-1">
            <div className="text-xs">{`No activity yet.`}</div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {interactions
            .slice()
            .reverse()
            .map((interaction, index) => {
              const direction =
                interaction?.sender.username === username ? "right" : "left";
              const sender =
                interaction?.sender.username === username
                  ? "You"
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
