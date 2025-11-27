import React, { useContext, useRef, useState, type JSX } from "react";
import { v4 as uuidv4 } from "uuid";

import { Reward, CropPlot } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  getAffectedWeather,
  isPlotFertile,
} from "features/game/events/landExpansion/plant";
import Spritesheet from "components/animation/SpriteAnimator";
import { HARVEST_PROC_ANIMATION } from "features/island/plots/lib/plant";
import {
  getCropYieldAmount,
  isReadyToHarvest,
} from "features/game/events/landExpansion/harvest";
import { NonFertilePlot } from "./components/NonFertilePlot";
import { FertilePlot } from "./components/FertilePlot";
import { ChestReward } from "../common/chest-reward/ChestReward";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { ZoomContext } from "components/ZoomProvider";
import { CROP_COMPOST } from "features/game/types/composters";
import { gameAnalytics } from "lib/gameAnalytics";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  isCropSeed,
  SEASONAL_SEEDS,
  SeedName,
} from "features/game/types/seeds";
import { getBumpkinLevel } from "features/game/lib/level";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { getKeys } from "features/game/types/craftables";
import { Transition } from "@headlessui/react";
import { formatNumber } from "lib/utils/formatNumber";
import { useSound } from "lib/utils/hooks/useSound";
import { TornadoPlot } from "./components/TornadoPlot";
import { TsunamiPlot } from "./components/TsunamiPlot";
import { GreatFreezePlot } from "./components/GreatFreezePlot";
import { SeasonalSeed } from "./components/SeasonalSeed";
import { Modal } from "components/ui/Modal";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { useNow } from "lib/utils/hooks/useNow";

export function getYieldColour(yieldAmount: number) {
  if (yieldAmount < 2) {
    return "white";
  }

  if (yieldAmount < 10) {
    return "#ffeb37"; // Yellow
  }

  return "#71e358"; // Green
}

const _crops = (state: MachineState) => state.context.state.crops;
const _state = (state: MachineState) => state.context.state;

const selectHarvests = (state: MachineState) => {
  return getKeys(CROPS).reduce(
    (total, crop) =>
      total + (state.context.state.farmActivity?.[`${crop} Harvested`] ?? 0),
    0,
  );
};

const selectPlants = (state: MachineState) =>
  getKeys(CROPS).reduce(
    (total, crop) =>
      total + (state.context.state.farmActivity?.[`${crop} Planted`] ?? 0),
    0,
  );

const selectCropsSold = (state: MachineState) =>
  state.context.state.farmActivity?.["Sunflower Sold"] ?? 0;

// A player that has been vetted and is engaged in the season.
const isSeasonedPlayer = (state: MachineState): boolean =>
  // - level 60+
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 60 &&
  // - verified (personhood verification)
  (state.context.verified || isFaceVerified({ game: state.context.state })) &&
  // - has grower reputation
  hasReputation({ game: state.context.state, reputation: Reputation.Grower });

interface Props {
  id: string;
}

export const Plot: React.FC<Props> = ({ id }) => {
  const { scale } = useContext(ZoomContext);
  const { gameService, selectedItem, showAnimations, showTimers } =
    useContext(Context);
  const [procAnimation, setProcAnimation] = useState<JSX.Element>();
  const [touchCount, setTouchCount] = useState(0);
  const [showSeasonalSeed, setShowSeasonalSeed] = useState(false);
  const [reward, setReward] = useState<Omit<Reward, "sfl">>();
  const clickedAt = useRef<number>(0);

  const crops = useSelector(gameService, _crops, (prev, next) => {
    return JSON.stringify(prev[id]) === JSON.stringify(next[id]);
  });

  const harvestCount = useSelector(gameService, selectHarvests);
  const plantCount = useSelector(gameService, selectPlants);
  const soldCount = useSelector(gameService, selectCropsSold);
  const isSeasoned = useSelector(gameService, isSeasonedPlayer);
  const [showHarvested, setShowHarvested] = useState(false);
  const [cropAmount, setCropAmount] = useState(0);

  const now = useNow();

  const { openModal } = useContext(ModalContext);

  const { play: plantAudio } = useSound("plant");
  const { play: harvestAudio } = useSound("harvest");

  const state = useSelector(gameService, _state);
  const { inventory, waterWell, season } = state;
  const crop = crops?.[id]?.crop;
  const fertiliser = crops?.[id]?.fertiliser;

  const plot = crops[id];

  const isFertile = isPlotFertile({
    plotIndex: id,
    crops: crops,
    wellLevel: waterWell.level,
    buildings: state.buildings,
    upgradeReadyAt: waterWell.upgradeReadyAt ?? 0,
    createdAt: now,
    island: state.island.type,
  });

  if (!isFertile) return <NonFertilePlot />;

  const weather = getAffectedWeather({ id, game: state });

  if (weather === "tornado") return <TornadoPlot game={state} />;
  if (weather === "tsunami") return <TsunamiPlot game={state} />;
  if (weather === "greatFreeze") return <GreatFreezePlot game={state} />;

  const harvestCrop = async (plot: CropPlot) => {
    if (!plot.crop) return;
    const newState = gameService.send("crop.harvested", { index: id });

    if (newState.matches("hoarding")) return;

    harvestAudio();
    const cropAmount =
      plot.crop.amount ??
      getCropYieldAmount({
        crop: plot.crop.name,
        game: state,
        plot,
        createdAt: Date.now(),
        criticalDrop: (name) => !!plot.crop?.criticalHit?.[name],
      }).amount;

    // firework animation
    if (showAnimations && cropAmount >= 10) {
      setProcAnimation(
        <Spritesheet
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -23}px`,
            left: `${PIXEL_SCALE * -10}px`,
            width: `${PIXEL_SCALE * HARVEST_PROC_ANIMATION.size}px`,
            imageRendering: "pixelated",
          }}
          image={HARVEST_PROC_ANIMATION.sprites[plot.crop.name]}
          widthFrame={HARVEST_PROC_ANIMATION.size}
          heightFrame={HARVEST_PROC_ANIMATION.size}
          zoomScale={scale}
          fps={HARVEST_PROC_ANIMATION.fps}
          steps={HARVEST_PROC_ANIMATION.steps}
          onPause={() => setProcAnimation(<></>)}
        />,
      );
    }

    if (newState.context.state.farmActivity?.["Sunflower Harvested"] === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerHarvested:Completed",
      });
    }

    setCropAmount(cropAmount);

    if (showAnimations) {
      setShowHarvested(true);

      await new Promise((res) => setTimeout(res, 2000));

      setShowHarvested(false);
    }
  };

  const onClick = (seed: SeedName = selectedItem as SeedName) => {
    const now = Date.now();

    // small buffer to prevent accidental double clicks
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // already looking at a reward
    if (reward) {
      return;
    }

    // increase touch count if there is a reward
    const readyToHarvest =
      !!crop && isReadyToHarvest(now, crop, CROPS[crop.name]);

    if (crop?.reward && readyToHarvest) {
      if (!isSeasoned && touchCount < 1) {
        // Add to touch count for reward pickup
        setTouchCount((count) => count + 1);
        return;
      }

      // They have touched enough!
      if (isSeasoned) {
        gameService.send("cropReward.collected", { plotIndex: id });
        harvestCrop(plot);
      } else {
        setReward(crop.reward);
      }

      return;
    }

    // apply fertilisers
    if (!readyToHarvest && seed && seed in CROP_COMPOST) {
      const state = gameService.send("plot.fertilised", {
        plotID: id,
        fertiliser: seed,
      });

      if (state.context.state.farmActivity?.["Crop Fertilised"] === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:Fertilised:Completed",
        });
      }

      return;
    }

    // plant
    if (!crop) {
      if (isCropSeed(seed) && !SEASONAL_SEEDS[season.season].includes(seed)) {
        setShowSeasonalSeed(true);
      }

      const newState = gameService.send("seed.planted", {
        index: id,
        item: seed,
        cropId: uuidv4().slice(0, 8),
      });

      plantAudio();

      const planted =
        newState.context.state.farmActivity?.["Sunflower Planted"] ?? 0;

      if (planted === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerPlanted:Completed",
        });
      }

      if (
        planted >= 3 &&
        seed === "Sunflower Seed" &&
        !newState.context.state.inventory["Sunflower Seed"]?.gt(0) &&
        !newState.context.state.inventory["Basic Scarecrow"]
      ) {
        openModal("BLACKSMITH");
      }

      return;
    }

    // harvest crop when ready
    if (readyToHarvest) {
      harvestCrop(plot);
    }

    setTouchCount(0);
  };

  const onCollectReward = (success: boolean) => {
    setReward(undefined);
    setTouchCount(0);

    if (success && crop) {
      harvestCrop(plot);
    }
  };

  return (
    <>
      <Modal show={showSeasonalSeed} onHide={() => setShowSeasonalSeed(false)}>
        <SeasonalSeed
          seed={selectedItem as SeedName}
          season={season.season}
          onClose={() => setShowSeasonalSeed(false)}
        />
      </Modal>

      <div onClick={() => onClick()} className="w-full h-full relative">
        {harvestCount < 3 &&
          harvestCount + 1 === Number(id) &&
          !!inventory.Shovel && (
            <img
              className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
              src={SUNNYSIDE.icons.dig_icon}
              onClick={() => onClick()}
              style={{
                width: `${PIXEL_SCALE * 18}px`,
                right: `${PIXEL_SCALE * -8}px`,
                top: `${PIXEL_SCALE * -14}px`,
              }}
            />
          )}

        {plantCount < 3 && plantCount + 1 === Number(id) && soldCount > 0 && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
            src={SUNNYSIDE.icons.click_icon}
            onClick={() => onClick()}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -8}px`,
              top: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}

        <FertilePlot
          cropName={crop?.name}
          plot={plot}
          plantedAt={crop?.plantedAt}
          fertiliser={fertiliser}
          procAnimation={procAnimation}
          touchCount={touchCount}
          showTimers={showTimers}
        />
      </div>
      {reward && (
        <ChestReward
          collectedItem={crop?.name}
          reward={reward}
          onCollected={onCollectReward}
          onOpen={() =>
            gameService.send("cropReward.collected", { plotIndex: id })
          }
        />
      )}

      {/* Harvest Animation */}
      {showAnimations && (
        <Transition
          appear={true}
          id="oil-reserve-collected-amount"
          show={showHarvested}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 -translate-y-0"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex -top-2 left-[40%] absolute z-40 pointer-events-none"
          as="div"
        >
          <span
            className="text-sm yield-text"
            style={{ color: getYieldColour(cropAmount) }}
          >{`+${formatNumber(cropAmount)}`}</span>
        </Transition>
      )}
    </>
  );
};
