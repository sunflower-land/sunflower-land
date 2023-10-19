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
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { CompostBuilding } from "features/game/types/game";

const getComposter = (type: BuildingName) => (state: MachineState) =>
  state.context.state.buildings[type]?.[0] as CompostBuilding;

const compare = (prev?: any, next?: any) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

interface Props {
  name: ComposterName;
}
export const Composter: React.FC<Props> = ({ name }) => {
  const { gameService, showTimers } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const composter = useSelector(gameService, getComposter(name), compare);

  const ready =
    !!composter?.producing && composter.producing.readyAt < Date.now();
  const composting =
    !!composter?.producing && composter.producing.readyAt > Date.now();

  useUiRefresher({ active: composting });

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
    gameService.send("compost.collected", {
      buildingId: composter!.id,
      building: name,
    });
    gameService.send("SAVE");
  };

  let image = COMPOSTER_IMAGES[name].idle;
  if (ready) {
    image = COMPOSTER_IMAGES[name].ready;
  } else if (composting) {
    image = COMPOSTER_IMAGES[name].composting;
  }

  let progressPercentage = 0;
  if (composter?.producing?.readyAt)
    progressPercentage =
      100 *
      ((Date.now() - composter?.producing?.startedAt) /
        (composter?.producing?.readyAt - composter?.producing?.startedAt));

  const width = COMPOSTER_IMAGES[name].width;
  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * width}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={image}
          style={{
            width: `${PIXEL_SCALE * width}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * ((32 - width) / 2)}px`,
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
            <ProgressBar
              formatLength="short"
              percentage={progressPercentage}
              seconds={(composter?.producing?.readyAt - Date.now()) / 1000}
              type="progress"
              className="relative"
              style={{
                width: `${PIXEL_SCALE * 14}px`,
              }}
            />
          </div>
        )}
      </div>
      <ComposterModal
        composterName={name}
        showModal={showModal}
        setShowModal={setShowModal}
        startComposter={startComposter}
        readyAt={composter?.producing?.readyAt}
        onCollect={handleCollect}
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
            className="ready"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
