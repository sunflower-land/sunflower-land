import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { COMPOSTER_IMAGES, ComposterModal } from "./ComposterModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { LiveProgressBar } from "components/ui/ProgressBar";
import { MachineState } from "features/game/lib/gameMachine";
import { BuildingName } from "features/game/types/buildings";
import { ComposterName } from "features/game/types/composters";
import { CompostBuilding } from "features/game/types/game";
import { gameAnalytics } from "lib/gameAnalytics";
import { BuildingImageWrapper } from "../BuildingImageWrapper";

const getComposter = (type: BuildingName) => (state: MachineState) =>
  state.context.state.buildings[type]?.[0] as CompostBuilding;

const compare = (prev?: any, next?: any) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

interface Props {
  name: ComposterName;
}
export const Composter: React.FC<Props> = ({ name }) => {
  const { gameService, showAnimations, showTimers } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const [renderKey, setRender] = useState<number>(0);

  const composter = useSelector(gameService, getComposter(name), compare);

  const ready =
    !!composter?.producing && composter.producing.readyAt < Date.now();
  const composting =
    !!composter?.producing && composter.producing.readyAt > Date.now();

  const startComposter = () => {
    setShowModal(false);

    // Simulate delayed closing of lid
    setTimeout(() => {
      gameService.send("composter.started", {
        buildingId: composter!.id,
        building: name,
      });
    }, 200);
  };

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCollect = () => {
    const state = gameService.send("compost.collected", {
      buildingId: composter!.id,
      building: name,
    });
    gameService.send("SAVE");

    if (
      name === "Compost Bin" &&
      state.context.state.bumpkin?.activity?.["Compost Bin Collected"] === 1
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
          className="absolute pointer-events-none"
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
              className="flex justify-center absolute bg-red-500"
              style={{
                bottom: "24px",
                width: `${PIXEL_SCALE * width}px`,

                left: `${PIXEL_SCALE * ((32 - width) / 2)}px`,
              }}
            >
              <LiveProgressBar
                key={renderKey}
                startAt={composter?.producing?.startedAt}
                endAt={composter?.producing?.readyAt}
                formatLength="short"
                className="relative"
                style={{
                  width: `${PIXEL_SCALE * 14}px`,
                }}
                onComplete={() => setRender((r) => r + 1)}
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
