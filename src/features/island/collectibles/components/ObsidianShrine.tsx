import React, { useContext, useMemo, useState } from "react";
import classNames from "classnames";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { useSelector } from "@xstate/react";
import { SeedName } from "features/game/types/seeds";
import { CropSeedName } from "features/game/types/crops";
import { SEASONAL_SEEDS, SEEDS } from "features/game/types/seeds";
import { CropName } from "features/game/types/crops";
import { Box } from "components/ui/Box";
import { Decimal } from "decimal.js-light";
import {
  CropPlot,
  GameState,
  InventoryItemName,
  Reward,
} from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { getAvailablePlots } from "features/game/events/landExpansion/bulkPlant";
import { getCropsToHarvest } from "features/game/events/landExpansion/bulkHarvest";
import { getReward } from "features/game/events/landExpansion/harvest";
import { getPlotsToFertilise } from "features/game/events/landExpansion/bulkFertilisePlot";
import {
  CROP_COMPOST,
  CropCompostName,
  FRUIT_COMPOST,
  FruitCompostName,
  GREENHOUSE_COMPOST,
  GreenhouseCompostName,
} from "features/game/types/composters";
import { getReadyAt as getGreenhouseReadyAt } from "features/game/events/landExpansion/harvestGreenHouse";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import { useVisiting } from "lib/utils/visitUtils";
import { RenewPetShrine } from "features/game/components/RenewPetShrine";
import { PET_SHRINE_DIMENSIONS_STYLES } from "./PetShrine";
import { selectGameState, selectVerified } from "features/game/lib/gameMachine";
import { isSeasonedPlayer } from "features/game/lib/seasonedPlayer";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { FarmActivityName } from "features/game/types/farmActivity";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { isWearableActive } from "features/game/lib/wearables";

type AnyCompostName =
  | CropCompostName
  | FruitCompostName
  | GreenhouseCompostName;

const SEED_STORAGE_KEY = "obsidianShrineSeed";
const FERTILISER_STORAGE_KEY = "obsidianShrineFertiliser";

export const ObsidianShrine: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
}) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers, showAnimations } = useContext(Context);
  const { isVisiting } = useVisiting();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [show, setShow] = useState(false);
  const [reward, setReward] = useState<Reward>();

  const expiresAt = createdAt + (EXPIRY_COOLDOWNS["Obsidian Shrine"] ?? 0);
  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const durationSeconds = EXPIRY_COOLDOWNS["Obsidian Shrine"] ?? 0;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const hasExpired = secondsToExpire <= 0;

  const now = useNow({ live: !hasExpired, autoEndAt: expiresAt });

  const state = useSelector(gameService, selectGameState);
  const verified = useSelector(gameService, selectVerified);
  const farmId = useSelector(gameService, (s) => s.context.farmId);
  const isSeasoned = isSeasonedPlayer({ game: state, verified, now });

  const availablePlots = getAvailablePlots(state);
  const { readyCrops, readyPlots } = getCropsToHarvest(state, now);
  const hasReadyCrops = Object.keys(readyCrops).length > 0;

  const combinedReward = useMemo(() => {
    const rewardItems: Partial<Record<InventoryItemName, Decimal>> = {};
    let coins = 0;
    let hasReward = false;
    const counters: Partial<Record<FarmActivityName, number>> = {};

    Object.values(readyPlots).forEach((plot) => {
      const crop = plot.crop;
      if (!crop) return;

      const activityKey = `${crop.name} Harvested` as FarmActivityName;
      if (counters[activityKey] === undefined) {
        counters[activityKey] = state.farmActivity?.[activityKey] ?? 0;
      }

      let plotReward = crop.reward;
      if (!plotReward) {
        const { reward } = getReward({
          crop: crop.name,
          skills: state.bumpkin?.skills ?? {},
          prngArgs: { farmId, counter: counters[activityKey] ?? 0 },
        });
        plotReward = reward;
      }

      counters[activityKey] = (counters[activityKey] ?? 0) + 1;

      if (!plotReward) return;
      hasReward = true;

      if (plotReward.items) {
        plotReward.items.forEach((item) => {
          const current = rewardItems[item.name] ?? new Decimal(0);
          rewardItems[item.name] = current.add(item.amount);
        });
      }

      if (plotReward.coins) coins += plotReward.coins;
    });

    if (!hasReward) return undefined;

    const items = Object.entries(rewardItems).map(([name, amount]) => ({
      name: name as InventoryItemName,
      amount: amount.toNumber(),
    }));

    const combined: Reward = {};
    if (items.length > 0) combined.items = items;
    if (coins > 0) combined.coins = coins;
    return combined;
  }, [readyPlots, state.bumpkin?.skills, state.farmActivity, farmId]);

  const doHarvestAll = () => {
    gameService.send("crops.bulkHarvested", {});
  };

  const harvestAll = () => {
    if (!isSeasoned && combinedReward) {
      setReward(combinedReward);
      return;
    }
    doHarvestAll();
  };

  const handleRenewClick = () => setShowRenewalModal(true);
  const shrineDimensions = PET_SHRINE_DIMENSIONS_STYLES["Obsidian Shrine"];

  if (hasExpired) {
    return (
      <>
        <div
          onClick={isVisiting ? undefined : handleRenewClick}
          className="absolute"
          style={{ ...shrineDimensions, bottom: 0 }}
        >
          <img
            src={ITEM_DETAILS["Obsidian Shrine"].image}
            style={{
              ...shrineDimensions,
              bottom: 0,
              filter: "grayscale(100%)",
            }}
            className="absolute cursor-pointer"
            alt={"Obsidian Shrine"}
          />
        </div>
        {showTimers && (
          <div
            className="absolute left-1/2"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              transform: "translateX(-50%)",
              bottom: `${PIXEL_SCALE * -3}px`,
            }}
          >
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type="error"
              percentage={percentage}
            />
          </div>
        )}
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
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
        <RenewPetShrine
          show={showRenewalModal}
          onHide={() => setShowRenewalModal(false)}
          name={"Obsidian Shrine"}
          id={id}
          location={location}
        />
      </>
    );
  }

  const close = () => {
    setShow(false);
    setReward(undefined);
  };

  return (
    <>
      <div
        onClick={isVisiting ? undefined : () => setShow(true)}
        className={classNames("absolute", {
          "cursor-pointer hover:img-highlight": !isVisiting,
        })}
        style={{ ...shrineDimensions, bottom: 0 }}
      >
        <img
          src={ITEM_DETAILS["Obsidian Shrine"].image}
          style={{ ...shrineDimensions, bottom: 0 }}
          className="absolute cursor-pointer"
          alt={"Obsidian Shrine"}
        />
        {showTimers && (
          <div
            className="absolute left-1/2"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              transform: "translateX(-50%)",
              bottom: `${PIXEL_SCALE * -3}px`,
            }}
          >
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type={"progress"}
              percentage={percentage}
            />
          </div>
        )}
      </div>

      <Modal show={show} onHide={close}>
        <OuterPanel>
          <div className="flex items-center justify-between flex-wrap gap-1 px-1 mb-1">
            <Label type="default" icon={ITEM_DETAILS["Obsidian Shrine"].image}>
              {"Obsidian Shrine"}
            </Label>
            <Label type="info" secondaryIcon={SUNNYSIDE.icons.stopwatch}>
              {t("time.remaining", {
                time: secondsToString(secondsToExpire, {
                  length: "medium",
                  isShortFormat: true,
                  removeTrailingZeros: true,
                }),
              })}
            </Label>
          </div>

          {reward ? (
            <InnerPanel>
              <ChestReward
                inline
                collectedItem={undefined}
                reward={reward}
                onCollected={(success) => {
                  setReward(undefined);
                  if (success) doHarvestAll();
                }}
                onOpen={() => {
                  // No-op - reward is applied in bulk harvest, this is just for the chest animation
                }}
              />
            </InnerPanel>
          ) : hasReadyCrops ? (
            <HarvestSection readyCrops={readyCrops} onHarvest={harvestAll} />
          ) : availablePlots.length > 0 ? (
            <PlantSection state={state} availablePlots={availablePlots} />
          ) : (
            <FertiliseSection state={state} />
          )}
        </OuterPanel>
      </Modal>

      {hasReadyCrops && (
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          className="absolute animate-float z-10 left-4 -top-12"
          style={{
            width: `${PIXEL_SCALE * 4}px`,
          }}
        />
      )}
    </>
  );
};

const SectionHeader: React.FC<{
  icon: string;
  title: string;
  status?: React.ReactNode;
}> = ({ icon, title, status }) => (
  <div className="flex items-center justify-between flex-wrap gap-1 mb-2">
    <Label type="default" icon={icon}>
      {title}
    </Label>
    {status}
  </div>
);

const HarvestSection: React.FC<{
  readyCrops: Record<CropName, number>;
  onHarvest: () => void;
}> = ({ readyCrops, onHarvest }) => {
  const { t } = useAppTranslation();
  const totalReady = Object.values(readyCrops).reduce((s, n) => s + n, 0);
  const hasReady = totalReady > 0;

  return (
    <InnerPanel>
      <SectionHeader
        icon={SUNNYSIDE.icons.seeds}
        title={t("obsidianShrine.section.harvest")}
        status={
          <Label type={hasReady ? "success" : "default"}>
            {t("obsidianShrine.crops.ready", { count: totalReady })}
          </Label>
        }
      />
      {hasReady ? (
        <>
          <div className="flex flex-wrap gap-1">
            {Object.entries(readyCrops).map(([crop, count]) => (
              <Box
                key={crop}
                image={ITEM_DETAILS[crop as CropName].image}
                count={new Decimal(count)}
              />
            ))}
          </div>
          <Button onClick={onHarvest} className="mt-2">
            {t("obsidianShrine.harvest")}
          </Button>
        </>
      ) : (
        <p className="text-xs px-1 py-2">{t("obsidianShrine.noCrops")}</p>
      )}
    </InnerPanel>
  );
};

const getPlantSeconds = (
  selectedSeed: CropSeedName,
  state: GameState,
  createdAt: number,
) => {
  const yields = SEEDS[selectedSeed as SeedName].yield;

  const { time } = getCropPlotTime({
    crop: yields as CropName,
    game: state,
    createdAt,
  });
  return time;
};

const PlantSection: React.FC<{
  state: GameState;
  availablePlots: [string, CropPlot][];
}> = ({ state, availablePlots }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const now = useNow({ live: true });

  const [selectedSeed, setSelectedSeed] = useState<CropSeedName | null>(
    () => localStorage.getItem(SEED_STORAGE_KEY) as CropSeedName | null,
  );

  const seasonalSeeds = SEASONAL_SEEDS[state.season.season].filter(
    (seed) => SEEDS[seed].plantingSpot === "Crop Plot",
  ) as CropSeedName[];

  const availableSeeds = seasonalSeeds.reduce(
    (acc, seed) => {
      const amount = state.inventory[seed] ?? new Decimal(0);
      if (amount.greaterThan(0)) {
        acc[seed] = amount.toNumber();
      }
      return acc;
    },
    {} as Record<CropSeedName, number>,
  );

  const effectiveSeed: CropSeedName | null =
    selectedSeed && selectedSeed in availableSeeds
      ? selectedSeed
      : ((Object.keys(availableSeeds)[0] as CropSeedName | undefined) ?? null);

  const selectSeed = (seed: CropSeedName) => {
    localStorage.setItem(SEED_STORAGE_KEY, seed);
    setSelectedSeed(seed);
  };

  const plantAll = () => {
    if (!effectiveSeed) return;

    const updatedState = gameService.send("seeds.bulkPlanted", {
      seed: effectiveSeed,
    });

    const remainingPlots = getAvailablePlots(updatedState.context.state);
    if (remainingPlots.length === 0) {
      const game = updatedState.context.state;
      const hasWings =
        isWearableActive({ game, name: "Angel Wings" }) ||
        isWearableActive({ game, name: "Devil Wings" });
      if (hasWings) gameService.send("SAVE");
    }
  };

  const hasSeeds = Object.keys(availableSeeds).length > 0;
  const plotsCount = availablePlots.length;

  return (
    <InnerPanel>
      <SectionHeader
        icon={SUNNYSIDE.icons.plant}
        title={t("obsidianShrine.section.plant")}
        status={
          <Label type={plotsCount > 0 ? "info" : "default"}>
            {t("obsidianShrine.plots.empty", { count: plotsCount })}
          </Label>
        }
      />

      {!hasSeeds ? (
        <p className="text-xs px-1 py-2">{t("obsidianShrine.noSeeds")}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-1">
            {Object.entries(availableSeeds).map(([seed, count]) => (
              <Box
                key={seed}
                image={
                  ITEM_DETAILS[SEEDS[seed as SeedName]?.yield as CropName]
                    ?.image
                }
                onClick={() => selectSeed(seed as CropSeedName)}
                isSelected={effectiveSeed === seed}
                count={new Decimal(count)}
              />
            ))}
          </div>
          {effectiveSeed && (
            <div className="flex flex-wrap justify-between gap-1 my-2 px-1">
              <Label
                type="default"
                icon={
                  ITEM_DETAILS[SEEDS[effectiveSeed].yield as CropName]?.image
                }
              >
                {effectiveSeed}
              </Label>
              <Label type="info" secondaryIcon={SUNNYSIDE.icons.stopwatch}>
                {secondsToString(getPlantSeconds(effectiveSeed, state, now), {
                  length: "medium",
                  removeTrailingZeros: true,
                })}
              </Label>
            </div>
          )}
          <Button
            onClick={plantAll}
            disabled={!effectiveSeed || plotsCount === 0}
            className="mt-2"
          >
            {plotsCount === 0
              ? t("obsidianShrine.noPlots")
              : effectiveSeed
                ? t("obsidianShrine.plant", { seed: effectiveSeed })
                : t("obsidianShrine.selectSeed")}
          </Button>
        </>
      )}
    </InnerPanel>
  );
};

const getOwnedFertilisers = (state: GameState): AnyCompostName[] => {
  const all: AnyCompostName[] = [
    ...(Object.keys(CROP_COMPOST) as CropCompostName[]),
    ...(Object.keys(FRUIT_COMPOST) as FruitCompostName[]),
    ...(Object.keys(GREENHOUSE_COMPOST) as GreenhouseCompostName[]),
  ];
  return all.filter((name) =>
    (state.inventory[name] ?? new Decimal(0)).greaterThan(0),
  );
};

const getEligibleGreenhousePotIds = (
  state: GameState,
  now: number,
): number[] => {
  return Object.entries(state.greenhouse.pots)
    .filter(([, pot]) => {
      if (!pot || pot.fertiliser) return false;
      if (
        pot.plant &&
        now >=
          getGreenhouseReadyAt({
            plant: pot.plant.name,
            createdAt: pot.plant.plantedAt,
          })
      ) {
        return false;
      }
      return true;
    })
    .map(([id]) => Number(id));
};

const getEligibleCount = (
  state: GameState,
  fertiliser: AnyCompostName,
  now: number,
): number => {
  if (fertiliser in CROP_COMPOST) {
    return getPlotsToFertilise(state, now).length;
  }
  if (fertiliser in GREENHOUSE_COMPOST) {
    return getEligibleGreenhousePotIds(state, now).length;
  }
  return Object.values(state.fruitPatches).filter((patch) => !patch.fertiliser)
    .length;
};

const FertiliseSection: React.FC<{
  state: GameState;
}> = ({ state }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const now = useNow({ live: true });

  const [selectedFertiliser, setSelectedFertiliser] =
    useState<AnyCompostName | null>(
      () =>
        localStorage.getItem(FERTILISER_STORAGE_KEY) as AnyCompostName | null,
    );

  const ownedFertilisers = getOwnedFertilisers(state);

  const effectiveFertiliser: AnyCompostName | null =
    selectedFertiliser && ownedFertilisers.includes(selectedFertiliser)
      ? selectedFertiliser
      : (ownedFertilisers[0] ?? null);

  const selectFertiliser = (name: AnyCompostName) => {
    localStorage.setItem(FERTILISER_STORAGE_KEY, name);
    setSelectedFertiliser(name);
  };

  const eligibleCount = effectiveFertiliser
    ? getEligibleCount(state, effectiveFertiliser, now)
    : 0;
  const ownedCount = effectiveFertiliser
    ? (state.inventory[effectiveFertiliser] ?? new Decimal(0)).toNumber()
    : 0;

  const applyAll = () => {
    if (!effectiveFertiliser || eligibleCount === 0 || ownedCount === 0) return;

    if (effectiveFertiliser in CROP_COMPOST) {
      gameService.send("plots.bulkFertilised", {
        fertiliser: effectiveFertiliser as CropCompostName,
      });
    } else if (effectiveFertiliser in GREENHOUSE_COMPOST) {
      let remaining = ownedCount;
      for (const id of getEligibleGreenhousePotIds(state, now)) {
        if (remaining === 0) break;
        gameService.send("greenhouse.fertilised", {
          id,
          fertiliser: effectiveFertiliser as GreenhouseCompostName,
        });
        remaining -= 1;
      }
    } else {
      let remaining = ownedCount;
      for (const [id, patch] of Object.entries(state.fruitPatches)) {
        if (remaining === 0) break;
        if (!patch.fertiliser) {
          gameService.send("fruitPatch.fertilised", {
            patchID: id,
            fertiliser: effectiveFertiliser as FruitCompostName,
          });
          remaining -= 1;
        }
      }
    }
  };

  const hasFertilisers = ownedFertilisers.length > 0;

  const buffs =
    effectiveFertiliser &&
    COLLECTIBLE_BUFF_LABELS[effectiveFertiliser]?.({
      skills: state.bumpkin?.skills ?? {},
      collectibles: state.collectibles,
    });

  const buttonLabel = !effectiveFertiliser
    ? t("obsidianShrine.selectFertiliser")
    : eligibleCount === 0 && effectiveFertiliser in CROP_COMPOST
      ? t("obsidianShrine.noEligiblePlots")
      : eligibleCount === 0 && effectiveFertiliser in FRUIT_COMPOST
        ? t("obsidianShrine.noEligiblePatches")
        : eligibleCount === 0 && effectiveFertiliser in GREENHOUSE_COMPOST
          ? t("obsidianShrine.noEligiblePots")
          : t("obsidianShrine.fertilise");

  return (
    <InnerPanel>
      <SectionHeader
        icon={ITEM_DETAILS["Sprout Mix"].image}
        title={t("obsidianShrine.section.fertilise")}
        status={
          effectiveFertiliser ? (
            <Label type={eligibleCount > 0 ? "info" : "default"}>
              {t("obsidianShrine.eligible", { count: eligibleCount })}
            </Label>
          ) : undefined
        }
      />

      {!hasFertilisers ? (
        <p className="text-xs px-1 py-2">{t("obsidianShrine.noFertilisers")}</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-1">
            {ownedFertilisers.map((name) => (
              <Box
                key={name}
                image={ITEM_DETAILS[name].image}
                onClick={() => selectFertiliser(name)}
                isSelected={effectiveFertiliser === name}
                count={state.inventory[name] ?? new Decimal(0)}
              />
            ))}
          </div>
          {effectiveFertiliser && (
            <div className="flex flex-wrap gap-1 my-2 px-1">
              <Label
                type="default"
                icon={ITEM_DETAILS[effectiveFertiliser].image}
              >
                {effectiveFertiliser}
              </Label>
              {buffs?.map((buff) => (
                <Label
                  key={`${buff.labelType}-${buff.shortDescription}`}
                  type={buff.labelType}
                  icon={buff.boostTypeIcon}
                  secondaryIcon={buff.boostedItemIcon}
                >
                  {buff.shortDescription}
                </Label>
              ))}
            </div>
          )}

          <Button
            onClick={applyAll}
            disabled={
              !effectiveFertiliser || eligibleCount === 0 || ownedCount === 0
            }
            className="mt-2"
          >
            {buttonLabel}
          </Button>
        </>
      )}
    </InnerPanel>
  );
};
