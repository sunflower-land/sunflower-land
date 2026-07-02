import React, { useContext, useState } from "react";
import { Transition } from "@headlessui/react";

import emptyPot from "assets/greenhouse/greenhouse_pot.webp";
import grapeSeedling from "assets/greenhouse/grape_seedling.webp";
import grapeGrowing from "assets/greenhouse/grape_growing.webp";
import grapeAlmost from "assets/greenhouse/grape_almost.webp";
import grapeReady from "assets/greenhouse/grape_ready.webp";
import oliveSeedling from "assets/greenhouse/olive_seedling.webp";
import oliveGrowing from "assets/greenhouse/olive_growing.webp";
import oliveAlmost from "assets/greenhouse/olive_almost.webp";
import oliveReady from "assets/greenhouse/olive_ready.webp";
import riceSeedling from "assets/greenhouse/rice_seedling.webp";
import riceGrowing from "assets/greenhouse/rice_growing.webp";
import riceAlmost from "assets/greenhouse/rice_almost.webp";
import riceReady from "assets/greenhouse/rice_ready.webp";
import barrelIcon from "assets/resources/oil_barrel.webp";
import powerup from "assets/icons/level_up.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import type {
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import type { GreenHouseFruitName } from "features/game/types/fruits";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { ProgressBar } from "components/ui/ProgressBar";
import { getGreenhouseCropYieldAmount } from "features/game/events/landExpansion/harvestGreenHouse";
import { getGreenhouseReadyAt } from "features/game/events/landExpansion/greenhouseReadiness";
import {
  getEffectiveSpeedAt,
  getGreenhouseBoostWindows,
  getGreenhouseGlowWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getOilUsage,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { QuickSelect } from "./QuickSelect";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import { useNow } from "lib/utils/hooks/useNow";
import {
  GREENHOUSE_COMPOST,
  type GreenhouseCompostName,
} from "features/game/types/composters";
import type {
  GreenhouseFertiliser,
  InventoryItemName,
} from "features/game/types/game";
import { TimerPopover } from "features/island/common/TimerPopover";

type Stage = "seedling" | "growing" | "almost" | "ready";
const PLANT_STAGES: Record<
  GreenHouseCropName | GreenHouseFruitName,
  Record<Stage, string>
> = {
  Grape: {
    seedling: grapeSeedling,
    almost: grapeAlmost,
    growing: grapeGrowing,
    ready: grapeReady,
  },
  Olive: {
    almost: oliveAlmost,
    growing: oliveGrowing,
    ready: oliveReady,
    seedling: oliveSeedling,
  },
  Rice: {
    almost: riceAlmost,
    growing: riceGrowing,
    ready: riceReady,
    seedling: riceSeedling,
  },
};

interface Props {
  id: number;
}

const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;
const clampPercentage = (value: number) => Math.min(Math.max(value, 0), 100);

const GreenhousePotFertiliserBadges: React.FC<{
  fertiliser?: GreenhouseFertiliser;
}> = ({ fertiliser }) => {
  const name = fertiliser?.name;
  if (!name) return null;

  return (
    <>
      {name === "Greenhouse Goodie" && (
        <img
          src={powerup}
          alt=""
          className="absolute z-10 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 5}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            right: `${PIXEL_SCALE * 0}px`,
          }}
        />
      )}
      {name === "Greenhouse Glow" && (
        <img
          src={SUNNYSIDE.icons.stopwatch}
          alt=""
          className="absolute z-10 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 6}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            right: `${PIXEL_SCALE * 0}px`,
          }}
        />
      )}
    </>
  );
};

export const GreenhousePot: React.FC<Props> = ({ id }) => {
  const {
    gameService,
    selectedItem,
    showAnimations,
    enableQuickSelect,
    showTimers,
  } = useContext(Context);

  const { t } = useAppTranslation();
  const [showHarvested, setShowHarvested] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showTimeRemaining, setShowTimeRemaining] = useState(false);
  const [showOilWarning, setShowOilWarning] = useState(false);
  const [harvestedName, setHarvestedName] = useState<
    GreenHouseCropName | GreenHouseFruitName | undefined
  >(undefined);
  const [harvestedAmount, setHarvestedAmount] = useState<number>(0);

  const state = useSelector(gameService, _state);
  const farmId = useSelector(gameService, _farmId);
  const activityCount = useSelector(gameService, (state) => {
    const cropName = state.context.state.greenhouse.pots[id]?.plant?.name;
    if (!cropName) return 0;
    return state.context.state.farmActivity[`${cropName} Harvested`] ?? 0;
  });

  const { inventory, greenhouse } = state;
  const { pots } = greenhouse;

  const pot = pots[id];
  const growingPlant = pot?.plant;
  const potFertiliser = pot?.fertiliser;

  const plantedAt = growingPlant?.plantedAt ?? 0;
  // Windowed plants (speed-rate model) derive their ready time live from the
  // boost windows; legacy plants use their back-dated plantedAt + base time.
  const readyAt = growingPlant
    ? getGreenhouseReadyAt(growingPlant, state, potFertiliser)
    : 0;

  // Live windowed greenhouse speed boosts (totems / Tortoise Shrine / Harvest
  // Hourglass for the crops + this pot's Greenhouse Glow fertiliser). Computed
  // inline — this component already subscribes to the whole game state.
  const boostWindows = growingPlant
    ? [
        ...getGreenhouseBoostWindows(state, growingPlant.name),
        ...getGreenhouseGlowWindows(potFertiliser),
      ]
    : [];
  const baseDurationMs = growingPlant?.baseDurationMs;
  // Work banked across Greenhouse building moves — folded into the bar's total
  // so visual progress is preserved (readiness already accounts for it).
  const bankedWorkMs = growingPlant?.boostedTime ?? 0;

  // Coarse 1s clock to pick the current boost speed; only windowed plants are
  // boosted. Tick the countdown faster (1000/speed) so it drops ~1s per visual
  // tick rather than jumping by `speed` each real second.
  const tickNow = useNow({
    live: !!growingPlant && baseDurationMs !== undefined,
    autoEndAt: readyAt,
  });
  const speed =
    baseDurationMs !== undefined
      ? getEffectiveSpeedAt({ at: tickNow, windows: boostWindows })
      : 1;
  const intervalMs = Math.max(Math.round(1000 / Math.max(speed, 1)), 250);
  const now = useNow({ live: !!growingPlant, autoEndAt: readyAt, intervalMs });

  // Remaining time is remaining *work* (in base duration) for windowed plants,
  // so it ticks down faster while a boost window is active; legacy counts down
  // to the back-dated readyAt.
  const secondsLeft =
    baseDurationMs !== undefined
      ? Math.max(
          Math.ceil(
            (baseDurationMs -
              workAccruedAt({
                startedAt: plantedAt,
                at: now,
                windows: boostWindows,
              })) /
              1000,
          ),
          0,
        )
      : readyAt > 0
        ? Math.max(Math.ceil((readyAt - now) / 1000), 0)
        : 0;
  const totalSeconds =
    baseDurationMs !== undefined
      ? (baseDurationMs + bankedWorkMs) / 1000
      : Math.max((readyAt - plantedAt) / 1000, 0);
  const percentage =
    totalSeconds > 0
      ? clampPercentage(((totalSeconds - secondsLeft) / totalSeconds) * 100)
      : 100;
  const isBoosted = speed > 1;

  const { usage: oilRequired } = getOilUsage({
    seed: selectedItem as GreenHouseCropSeedName,
    game: state,
  });

  const plantSeed = async (
    seed: GreenHouseCropSeedName = selectedItem as GreenHouseCropSeedName,
  ) => {
    if (
      !seed ||
      !SEED_TO_PLANT[seed as GreenHouseCropSeedName] ||
      !inventory[seed]?.gte(1)
    ) {
      if (enableQuickSelect) {
        setShowQuickSelect(true);
      }
      return;
    }

    if (oilRequired > gameService.getSnapshot().context.state.greenhouse.oil) {
      setShowOilWarning(true);
      await new Promise((res) => setTimeout(res, 2000));
      setShowOilWarning(false);
      return;
    }

    gameService.send("greenhouse.planted", { id, seed });
  };

  const canApplyGreenhouseFertiliser = (item?: InventoryItemName) => {
    const invItem = item ?? selectedItem;
    return !!invItem && invItem in GREENHOUSE_COMPOST && !potFertiliser;
  };

  const tryApplyGreenhouseFertiliser = (item?: InventoryItemName) => {
    if (!canApplyGreenhouseFertiliser(item)) return false;
    gameService.send("greenhouse.fertilised", {
      id,
      fertiliser: (item ?? selectedItem) as GreenhouseCompostName,
    });
    return true;
  };
  if (!pot?.plant) {
    return (
      <div className="relative" style={{ width: `${PIXEL_SCALE * 28}px` }}>
        {/* Harvest Animation */}
        {showAnimations && (
          <Transition
            appear={true}
            id="oil-reserve-collected-amount"
            show={showHarvested}
            enter="transition-opacity transition-transform duration-200"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 -translate-y-2"
            leave="transition-opacity duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="flex -top-2 left-[40%] absolute w-full z-40 pointer-events-none"
            as="div"
          >
            <img
              src={ITEM_DETAILS[harvestedName ?? "Rice"].image}
              className="mr-2 img-highlight-heavy"
              style={{ width: `${PIXEL_SCALE * 7}px` }}
            />
            <span className="text-sm yield-text">{`+${formatNumber(harvestedAmount)}`}</span>
          </Transition>
        )}

        {/* Quick Select */}
        <Transition
          appear={true}
          show={showQuickSelect}
          enter="transition-opacity  duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex top-[-200%] left-[50%] absolute z-40 shadow-md"
          as="div"
        >
          <QuickSelect
            options={[
              { name: "Grape Seed", icon: "Grape", showSecondaryImage: true },
              { name: "Rice Seed", icon: "Rice", showSecondaryImage: true },
              { name: "Olive Seed", icon: "Olive", showSecondaryImage: true },
            ]}
            onClose={() => setShowQuickSelect(false)}
            onSelected={(seed) => {
              plantSeed(seed as GreenHouseCropSeedName);
              setShowQuickSelect(false);
            }}
            type={t("quickSelect.greenhouseSeeds")}
            showExpanded
          />
        </Transition>

        {/* Oil Warning */}
        <Transition
          appear={true}
          show={showOilWarning}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex -top-4 left-[80%] absolute z-40 shadow-md w-auto"
          as="div"
        >
          <Label type="danger" icon={barrelIcon} className="whitespace-nowrap">
            {`${oilRequired} ${t("greenhouse.oilRequired")}`}
          </Label>
        </Transition>

        <GreenhousePotFertiliserBadges fertiliser={potFertiliser} />
        <img
          src={emptyPot}
          className="cursor-pointer hover:img-highlight"
          style={{ width: `${PIXEL_SCALE * 28}px` }}
          onClick={() => {
            if (tryApplyGreenhouseFertiliser()) return;
            plantSeed();
          }}
        />
      </div>
    );
  }

  const harvest = async () => {
    if (!pot.plant) return;
    if (
      selectedItem &&
      selectedItem in GREENHOUSE_COMPOST &&
      !potFertiliser &&
      now < readyAt
    ) {
      tryApplyGreenhouseFertiliser();
      return;
    }
    if (now < readyAt) {
      setShowTimeRemaining(true);
      await new Promise((res) => setTimeout(res, 2000));
      setShowTimeRemaining(false);
      return;
    }

    setHarvestedName(pot.plant.name);

    setHarvestedAmount(
      pot.plant.amount ??
        getGreenhouseCropYieldAmount({
          prngArgs: { farmId, counter: activityCount },
          crop: pot.plant.name,
          game: state,
          createdAt: now,
          fertiliser: potFertiliser?.name,
        }).amount,
    );

    gameService.send("greenhouse.harvested", { id });

    if (showAnimations) {
      setShowHarvested(true);

      await new Promise((res) => setTimeout(res, 2000));

      setShowHarvested(false);
    }
  };

  let stage: Stage = "ready";

  if (percentage < 20) {
    stage = "seedling";
  } else if (percentage < 50) {
    stage = "growing";
  } else if (percentage < 100) {
    stage = "almost";
  }

  return (
    <div className="relative" style={{ width: `${PIXEL_SCALE * 28}px` }}>
      <GreenhousePotFertiliserBadges fertiliser={potFertiliser} />
      <img
        src={PLANT_STAGES[pot.plant.name][stage]}
        className="cursor-pointer hover:img-highlight"
        style={{ width: `${PIXEL_SCALE * 28}px` }}
        onClick={harvest}
      />
      {secondsLeft > 0 && isBoosted && (
        <img
          src={SUNNYSIDE.icons.lightning}
          alt=""
          aria-hidden
          className="absolute z-20 pointer-events-none animate-pulse"
          style={{
            width: `${PIXEL_SCALE * 7}px`,
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 3}px`,
          }}
        />
      )}
      {showTimers && secondsLeft > 0 && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 2.5}px`,
            left: `${PIXEL_SCALE * 6.5}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={percentage}
            seconds={secondsLeft}
            formatLength="short"
            type="progress"
          />
        </div>
      )}

      {/* Time left */}
      <Transition
        appear={true}
        show={showTimeRemaining}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-0 left-[90%] absolute z-40 shadow-md w-[200px]"
        as="div"
      >
        <TimerPopover
          image={ITEM_DETAILS[pot.plant.name].image}
          description={pot.plant.name}
          showPopover={showTimeRemaining && !canApplyGreenhouseFertiliser()}
          timeLeft={secondsLeft}
          speed={speed}
        />
      </Transition>
    </div>
  );
};
