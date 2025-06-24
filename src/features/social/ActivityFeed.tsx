import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext, useLayoutEffect, useRef } from "react";
import { InteractionBubble } from "./InteractionBubble";
import { getRelativeTime } from "lib/utils/time";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ChatInput } from "./ChatInput";
import classNames from "classnames";
import { FarmInteraction } from "./PlayerModal";
import promote from "assets/icons/promote.webp";

type Props = {
  chatDisabled?: boolean;
  className?: string;
  interactions: FarmInteraction[];
  onInteraction: (interaction: FarmInteraction) => void;
};

const _username = (state: MachineState) => state.context.state.username;

export const ActivityFeed: React.FC<Props> = ({
  chatDisabled,
  className,
  interactions = [],
  onInteraction,
}) => {
  const { gameService } = useContext(Context);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const username = useSelector(gameService, _username);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [interactions]);

  const handleInteraction = (interaction: FarmInteraction) => {
    onInteraction({
      ...interaction,
      id: `${interaction.id}-${Date.now()}`,
      timestamp: Date.now(),
    });
  };

  return (
    <InnerPanel
      className={classNames("flex flex-col justify-between w-full", className)}
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
            .map((interaction) => {
              const direction =
                interaction?.sender === username ? "right" : "left";
              const sender =
                interaction?.sender === username ? "You" : interaction.sender;

              return (
                <div
                  key={interaction.id}
                  className={classNames({
                    "pl-1":
                      direction === "left" && interaction.type === "comment",
                    "pr-1":
                      direction === "right" && interaction.type === "comment",
                  })}
                >
                  <InteractionBubble
                    key={interaction.id}
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
                        {`${getRelativeTime(interaction.timestamp)}`}
                      </span>
                    </div>
                    <div className="text-xs break-all">{interaction.text}</div>
                  </InteractionBubble>
                </div>
              );
            })}
        </div>
      </div>
      <ChatInput disabled={chatDisabled} onEnter={handleInteraction} />
    </InnerPanel>
  );
};
