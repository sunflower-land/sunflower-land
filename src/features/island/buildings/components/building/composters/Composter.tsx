import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { COMPOSTER_IMAGES, ComposterModal } from "./ComposterModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { MachineState } from "features/game/lib/gameMachine";
import { BuildingName } from "features/game/types/buildings";
import { ComposterName } from "features/game/types/composters";
import { CompostBuilding } from "features/game/types/game";
import { gameAnalytics } from "lib/gameAnalytics";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useCountdown } from "lib/utils/hooks/useCountdown";

const getComposter = (type: BuildingName) => (state: MachineState) =>
  state.context.state.buildings[type]?.[0] as CompostBuilding;

const compare = (prev?: CompostBuilding, next?: CompostBuilding) => {
  // Force update if readyAt time changed (for boost updates)
  if (prev?.producing?.readyAt !== next?.producing?.readyAt) {
    return false;
  }
  // Force update if boost state changed
  if (!!prev?.boost !== !!next?.boost) {
    return false;
  }
  return JSON.stringify(prev) === JSON.stringify(next);
};

interface Props {
  name: ComposterName;
}
export const Composter: React.FC<Props> = ({ name }) => {
  const { gameService, showAnimations, showTimers } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const [_, setRender] = useState<number>(0);

  const composter = useSelector(gameService, getComposter(name), compare);
  const { totalSeconds: secondsLeft } = useCountdown(
    composter?.producing?.readyAt ?? 0,
  );

  const startedAt = composter?.producing?.startedAt ?? 0;
  const readyAt = composter?.producing?.readyAt ?? 0;
  const totalRunningSeconds = Math.max((readyAt - startedAt) / 1000, 1);
  const elapsedSeconds = Math.max(totalRunningSeconds - secondsLeft, 0);
  const percentage = Math.min(
    (elapsedSeconds / totalRunningSeconds) * 100,
    100,
  );
  const ready = !!readyAt && secondsLeft <= 0;
  const composting = secondsLeft > 0;

  const startComposter = () => {
    // Simulate delayed closing of lid
    setTimeout(() => {
      gameService.send({
        type: "composter.started",
        buildingId: composter!.id,
        building: name,
      });
    }, 200);
  };

  const handleClick = () => setShowModal(true);

  const handleCollect = () => {
    const state = gameService.send({
      type: "compost.collected",
      buildingId: composter!.id,
      building: name,
    });

    if (
      name === "Compost Bin" &&
      state.context.state.farmActivity["Compost Bin Collected"] === 1
    ) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:Composting:Completed",
      });
    }
  };

  let image = COMPOSTER_IMAGES[name].idle;
  if (ready) {
    image = COMPOSTER_IMAGES[name].ready;
  } else if (composting) {
    image = COMPOSTER_IMAGES[name].composting;
  }

  const width = COMPOSTER_IMAGES[name].width;

  return (
    <>
      <BuildingImageWrapper name={name} onClick={handleClick} ready={ready}>
        <div
          className="absolute pointer-events-none bg-black"
          style={{
            width: `${PIXEL_SCALE * width}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        >
          <img
            src={image}
            style={{
              width: `${PIXEL_SCALE * width}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
              left: `${PIXEL_SCALE * Math.round((32 - width) / 2)}px`,
            }}
            className="absolute"
            alt={name}
          />
          {showTimers && composting && composter?.producing?.readyAt && (
            <div
              className="flex justify-center absolute"
              style={{
                bottom: "24px",
                width: `${PIXEL_SCALE * width}px`,

                left: `${PIXEL_SCALE * ((32 - width) / 2)}px`,
              }}
            >
              <ProgressBar
                percentage={percentage}
                type="progress"
                formatLength="short"
                seconds={secondsLeft}
                style={{
                  width: `${PIXEL_SCALE * 14}px`,
                }}
              />
            </div>
          )}
          {composter.boost && (
            <>
              <img
                src={SUNNYSIDE.icons.stopwatch}
                className="absolute z-10"
                style={{
                  width: `${PIXEL_SCALE * 10}px`,
                  bottom: `${PIXEL_SCALE * 22}px`,
                  right: `${PIXEL_SCALE * -4}px`,
                }}
              />
            </>
          )}
        </div>
      </BuildingImageWrapper>

      <ComposterModal
        composterName={name}
        showModal={showModal}
        setShowModal={setShowModal}
        startComposter={startComposter}
        readyAt={composter?.producing?.readyAt}
        onCollect={handleCollect}
        onBoost={() => setRender((r) => r + 1)}
      />
      {ready && (
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={showAnimations ? "ready" : ""}
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
