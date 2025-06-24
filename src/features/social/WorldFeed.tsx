import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useContext } from "react";
import { FarmInteraction } from "./PlayerModal";
import { InteractionBubble } from "./components/InteractionBubble";
import { getRelativeTime } from "lib/utils/time";

import promote from "assets/icons/promote.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { isMobile } from "mobile-device-detect";

type Props = {
  interactions: FarmInteraction[];
  showFeed: boolean;
  server?: string;
  setShowFeed: (showFeed: boolean) => void;
};

const _username = (state: MachineState) => state.context.state.username;

export const WorldFeed: React.FC<Props> = ({
  showFeed,
  setShowFeed,
  server,
  interactions = [],
}) => {
  const { gameService } = useContext(Context);
  const username = useSelector(gameService, _username);

  const showMobileFeed = showFeed && isMobile;
  const showDesktopFeed = showFeed && !isMobile;
  const hideMobileFeed = !showFeed && isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <InnerPanel
      className={classNames(
        `fixed ${isMobile ? "w-[75%]" : "w-[300px]"} top-0 left-0 m-2 bottom-0 z-30 transition-transform duration-300`,
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
            <Label type="default">{`World Feed`}</Label>
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
        <div className="scrollable overflow-y-auto">
          <div className="flex flex-col gap-1 pr-1">
            {interactions.map((interaction) => {
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
      </div>
    </InnerPanel>
  );
};
