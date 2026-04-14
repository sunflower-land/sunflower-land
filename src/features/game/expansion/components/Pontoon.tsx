import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { ExpansionConstruction } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { Modal } from "components/ui/Modal";
import { Expanding } from "components/ui/layouts/ExpansionRequirements";
import { gameAnalytics } from "lib/gameAnalytics";
import { Panel } from "components/ui/Panel";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { useRealTimeInstantGems } from "features/game/lib/getInstantGems";

const _state = (state: MachineState) => state.context.state;

interface Props {
  expansion: ExpansionConstruction;
}

/**
 * Goblins working hard constructing a piece of land
 */
export const Pontoon: React.FC<Props> = ({ expansion }) => {
  const { gameService, showTimers } = useContext(Context);
  const state = useSelector(gameService, _state);
  const readyAt = expansion.readyAt;

  const { totalSeconds: secondsLeft } = useCountdown(readyAt);

  const [showModal, setShowModal] = useState(false);
  const gems = useRealTimeInstantGems({ readyAt, game: state });

  const onInstantExpand = () => {
    gameService.send("expansion.spedUp");

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gems,
      item: "Instant Expand",
      type: "Fee",
    });

    setShowModal(false);
  };

  // Land is still being built
  const constructionTime = (expansion.readyAt - expansion.createdAt) / 1000;

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <Expanding
            onClose={() => setShowModal(false)}
            state={state}
            readyAt={readyAt}
            gems={gems}
            onInstantExpanded={onInstantExpand}
          />
        </Panel>
      </Modal>
      <div
        onClick={() => setShowModal(true)}
        className="w-full h-full cursor-pointer"
      >
        <img
          src={SUNNYSIDE.land.pontoon}
          style={{
            top: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * -10}px`,
            width: `${PIXEL_SCALE * 129}px`,
          }}
          className="relative max-w-none"
        />

        {showTimers && (
          <ProgressBar
            seconds={secondsLeft}
            percentage={
              ((constructionTime - secondsLeft) / constructionTime) * 100
            }
            type="progress"
            formatLength="medium"
            style={{
              top: `${PIXEL_SCALE * 82}px`,
              left: `${PIXEL_SCALE * 45}px`,
              whiteSpace: "nowrap",
            }}
          />
        )}
      </div>
    </>
  );
};
