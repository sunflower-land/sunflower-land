import React, { useContext, useState, type JSX } from "react";

import { CROPS, CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { GrowthStage, Soil } from "features/island/plots/components/Soil";
import { Bar, LiveProgressBar } from "components/ui/ProgressBar";

import powerup from "assets/icons/level_up.png";
import locust from "assets/icons/locust.webp";
import sunshower from "assets/icons/sunshower.webp";
import bee from "assets/icons/bee.webp";

import { TimerPopover } from "../../common/TimerPopover";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import classNames from "classnames";
import { CropFertiliser, CropPlot, GameState } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

interface Props {
  cropName?: CropName;
  game: GameState;
  plot: CropPlot;
  plantedAt?: number;
  fertiliser?: CropFertiliser;
  procAnimation?: JSX.Element;
  touchCount: number;
  showTimers: boolean;
}

const _island = (state: MachineState) => state.context.state.island;

const FertilePlotComponent: React.FC<Props> = ({
  cropName,
  game,
  plot,
  plantedAt,
  fertiliser,
  procAnimation,
  touchCount,
  showTimers,
}) => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  const [showTimerPopover, setShowTimerPopover] = useState(false);
  const [, setRender] = useState<number>(0);

  let harvestSeconds = cropName ? CROPS[cropName].harvestSeconds : 0;
  const readyAt = plantedAt ? plantedAt + harvestSeconds * 1000 : 0;

  let startAt = plantedAt ?? 0;
  if (cropName && game.bumpkin) {
    harvestSeconds = getCropPlotTime({
      crop: cropName,
      game,
      plot,
      createdAt: Date.now(),
    }).time;
    startAt = readyAt - harvestSeconds * 1000;
  }
  const timeLeft = readyAt > 0 ? (readyAt - Date.now()) / 1000 : 0;
  const isGrowing = timeLeft > 0;

  const activeInsectPlague =
    getActiveCalendarEvent({ calendar: game.calendar }) === "insectPlague";
  const isProtected = game.calendar.insectPlague?.protected;

  // REVIEW: Is this still needed after changing to LiveProgressBar?
  useUiRefresher({ active: isGrowing });

  const growPercentage = 100 - (timeLeft / harvestSeconds) * 100;
  const stage: GrowthStage | undefined = !cropName
    ? undefined
    : growPercentage >= 100
      ? "ready"
      : growPercentage >= 50
        ? "almost"
        : growPercentage >= 25
          ? "halfway"
          : "seedling";

  const isSunshower =
    getActiveCalendarEvent({ calendar: game.calendar }) === "sunshower";

  const handleMouseEnter = () => {
    // show details if field is growing
    if (isGrowing) {
      // set state to show details
      setShowTimerPopover(true);
    }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowTimerPopover(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative"
    >
      <div
        className={classNames("w-full h-full relative", {
          "cursor-pointer hover:img-highlight": !stage || stage === "ready",
        })}
      >
        {/* Crop base image */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        >
          <Soil cropName={cropName} stage={stage} island={island} />
        </div>
      </div>
      {activeInsectPlague && !isProtected && (
        <img
          src={locust}
          alt="locust"
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            top: `${PIXEL_SCALE * -4}px`,
          }}
        />
      )}

      {isSunshower && (
        <img
          src={sunshower}
          alt="sunshower"
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            top: `${PIXEL_SCALE * -4}px`,
            right: `${PIXEL_SCALE * -2}px`,
          }}
        />
      )}
      {/* Fertiliser */}
      {fertiliser?.name === "Sprout Mix" && (
        <img
          key={fertiliser.name}
          className="absolute z-10 pointer-events-none"
          src={powerup}
          style={{
            width: `${PIXEL_SCALE * 5}px`,
            bottom: `${PIXEL_SCALE * 9}px`,
            right: `${PIXEL_SCALE * 0}px`,
          }}
        />
      )}
      {fertiliser?.name === "Rapid Root" && (
        <img
          key={fertiliser.name}
          className="absolute z-10 pointer-events-none"
          src={SUNNYSIDE.icons.stopwatch}
          style={{
            width: `${PIXEL_SCALE * 6}px`,
            bottom: `${PIXEL_SCALE * 9}px`,
            right: `${PIXEL_SCALE * 0}px`,
          }}
        />
      )}

      {/* Bee Swarm */}
      {plot.beeSwarm && (
        <img
          className="absolute z-10 pointer-events-none"
          src={bee}
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            top: `${PIXEL_SCALE * -2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      )}

      {/* Time popover */}
      {!!cropName && isGrowing && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -18}px`,
          }}
        >
          <TimerPopover
            image={ITEM_DETAILS[cropName].image}
            description={cropName}
            showPopover={showTimerPopover}
            timeLeft={timeLeft}
          />
        </div>
      )}

      {/* Health bar for collecting rewards */}
      {!!touchCount && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <Bar percentage={100 - touchCount * 50} type="health" />
        </div>
      )}

      {/* Progress bar for growing crops */}
      {showTimers && isGrowing && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 9}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <LiveProgressBar
            key={`${startAt}-${readyAt}`}
            startAt={startAt}
            endAt={readyAt}
            formatLength="short"
            onComplete={() => setRender((r) => r + 1)}
          />
        </div>
      )}

      {/* Firework animation */}
      {procAnimation}
    </div>
  );
};

export const FertilePlot = React.memo(FertilePlotComponent);
