import React, { useContext, useMemo, useState, type JSX } from "react";

import { CROPS, CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { GrowthStage, Soil } from "features/island/plots/components/Soil";
import { Bar, ProgressBar } from "components/ui/ProgressBar";

import powerup from "assets/icons/level_up.png";
import locust from "assets/icons/locust.webp";
import sunshower from "assets/icons/sunshower.webp";
import bee from "assets/icons/bee.webp";

import { TimerPopover } from "../../common/TimerPopover";
import classNames from "classnames";
import { CropFertiliser, CropPlot } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  cropName?: CropName;
  plot: CropPlot;
  plantedAt?: number;
  fertiliser?: CropFertiliser;
  procAnimation?: JSX.Element;
  touchCount: number;
  showTimers: boolean;
}

const _island = (state: MachineState) => state.context.state.island;
const _calendar = (state: MachineState) => state.context.state.calendar;

const clampPercentage = (value: number) => Math.min(Math.max(value, 0), 100);

const getGrowthStage = (
  cropName?: CropName,
  percentage?: number,
): GrowthStage | undefined => {
  if (!cropName || percentage === undefined) return undefined;
  if (percentage >= 100) return "ready";
  if (percentage >= 50) return "almost";
  if (percentage >= 25) return "halfway";
  return "seedling";
};

const getHarvestMetrics = ({
  cropName,
  plot,
  plantedAt,
}: {
  cropName?: CropName;
  plot: CropPlot;
  plantedAt?: number;
}): { harvestSeconds: number; readyAt: number; startAt: number } => {
  const plantedTimestamp = plantedAt ?? plot.crop?.plantedAt ?? 0;

  if (!cropName || !plantedTimestamp) {
    return { harvestSeconds: 0, readyAt: 0, startAt: 0 };
  }

  const baseHarvestSeconds = CROPS[cropName].harvestSeconds;
  const boostOffsetMs =
    plot.crop?.name === cropName ? (plot.crop?.boostedTime ?? 0) : 0;
  const harvestSeconds = Math.max(baseHarvestSeconds - boostOffsetMs / 1000, 0);
  const startAt = plantedTimestamp + boostOffsetMs;
  const readyAt = startAt + harvestSeconds * 1000;

  return { harvestSeconds, readyAt, startAt };
};

export const FertilePlot: React.FC<Props> = ({
  cropName,
  plot,
  plantedAt,
  fertiliser,
  procAnimation,
  touchCount,
  showTimers,
}) => {
  const { gameService } = useContext(Context);

  const island = useSelector(gameService, _island);
  const calendar = useSelector(gameService, _calendar);

  const [showTimerPopover, setShowTimerPopover] = useState(false);
  const { harvestSeconds, readyAt } = useMemo(
    () => getHarvestMetrics({ cropName, plot, plantedAt }),
    [cropName, plantedAt, plot],
  );
  const currentTime = useNow({ live: readyAt > 0, autoEndAt: readyAt });
  const timeLeft =
    readyAt > 0 && harvestSeconds > 0
      ? Math.max((readyAt - currentTime) / 1000, 0)
      : 0;
  const isGrowing = harvestSeconds > 0 ? readyAt > currentTime : false;

  const activeInsectPlague =
    getActiveCalendarEvent({ calendar }) === "insectPlague";
  const isProtected = calendar.insectPlague?.protected;

  const growPercentage =
    harvestSeconds > 0
      ? clampPercentage(100 - (timeLeft / harvestSeconds) * 100)
      : 100;
  const stage = getGrowthStage(cropName, growPercentage);

  const isSunshower = getActiveCalendarEvent({ calendar }) === "sunshower";

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
          <ProgressBar
            percentage={growPercentage}
            seconds={timeLeft}
            type="progress"
            formatLength="short"
          />
        </div>
      )}

      {/* Firework animation */}
      {procAnimation}
    </div>
  );
};
