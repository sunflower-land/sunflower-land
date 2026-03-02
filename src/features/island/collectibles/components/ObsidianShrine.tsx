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
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
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
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import { useVisiting } from "lib/utils/visitUtils";
import { RenewPetShrine } from "features/game/components/RenewPetShrine";
import { PET_SHRINE_DIMENSIONS_STYLES } from "./PetShrine";
import { isSeasonedPlayer } from "features/island/plots/Plot";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { FarmActivityName } from "features/game/types/farmActivity";

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
  type Tab = "harvest" | "plant";
  const [activeTab, setActiveTab] = useState<Tab>("harvest");
  const [showPopover, setShowPopover] = useState(false);
  const [reward, setReward] = useState<Reward>();

  const expiresAt = createdAt + (EXPIRY_COOLDOWNS["Obsidian Shrine"] ?? 0);

  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const durationSeconds = EXPIRY_COOLDOWNS["Obsidian Shrine"] ?? 0;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const hasExpired = secondsToExpire <= 0;

  const now = useNow({ live: !hasExpired, autoEndAt: expiresAt });

  const state = useSelector(gameService, (state) => state.context.state);
  const farmId = useSelector(gameService, (state) => state.context.farmId);
  const isSeasoned = useSelector(gameService, isSeasonedPlayer);

  const availablePlots = getAvailablePlots(state);
  const { readyCrops, readyPlots } = getCropsToHarvest(state, now);
  const hasReadyCrops = Object.keys(readyCrops).length > 0;
  const hasAvailablePlots = availablePlots.length > 0;

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
    gameService.send({ type: "crops.bulkHarvested" });
    setActiveTab("plant");
  };

  const harvestAll = () => {
    if (!isSeasoned && combinedReward) {
      setReward(combinedReward);
      return;
    }

    doHarvestAll();
  };

  const handleRenewClick = () => {
    setShowRenewalModal(true);
  };

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

  const handleShrineClick = () => {
    if (hasReadyCrops || hasAvailablePlots) {
      setShow(true);
      setActiveTab(hasReadyCrops ? "harvest" : "plant");
    }
  };

  return (
    <>
      <div
        onClick={isVisiting ? undefined : handleShrineClick}
        className={classNames("absolute", {
          "cursor-pointer hover:img-highlight":
            hasReadyCrops || hasAvailablePlots,
          "cursor-not-allowed": !hasReadyCrops && !hasAvailablePlots,
        })}
        onMouseEnter={() =>
          !hasReadyCrops && !hasAvailablePlots && setShowPopover(true)
        }
        onMouseLeave={() => setShowPopover(false)}
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
        <CloseButtonPanel
          tabs={[
            {
              id: "harvest",
              icon: SUNNYSIDE.icons.seeds,
              name: "Harvest",
            },
            {
              id: "plant",
              icon: SUNNYSIDE.icons.plant,
              name: "Plant",
            },
          ]}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
          onClose={close}
          container={OuterPanel}
        >
          {activeTab === "harvest" &&
            (reward ? (
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
            ) : (
              <HarvestAll readyCrops={readyCrops} harvestAll={harvestAll} />
            ))}
          {activeTab === "plant" && (
            <PlantAll
              availablePlots={availablePlots}
              state={state}
              close={close}
            />
          )}
        </CloseButtonPanel>

        <div className="absolute -top-8 -mt-[2px] right-0 mr-[5.5px]">
          <Label
            type="info"
            secondaryIcon={SUNNYSIDE.icons.stopwatch}
            className="mt-2 mb-2"
          >
            <span className="text-xs">
              {t("time.remaining", {
                time: secondsToString(secondsToExpire, {
                  length: "medium",
                  isShortFormat: true,
                  removeTrailingZeros: true,
                }),
              })}
            </span>
          </Label>
        </div>
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

      {showPopover && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -14}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-[999999]">
            <div className="text-xs mx-1 p-1 flex flex-col items-center">
              {!hasReadyCrops && <span>{t("obsidianShrine.noCrops")}</span>}
              {!hasAvailablePlots && <span>{t("obsidianShrine.noPlots")}</span>}
            </div>
          </InnerPanel>
        </div>
      )}
    </>
  );
};

const HarvestAll: React.FC<{
  readyCrops: Record<CropName, number>;
  harvestAll: () => void;
}> = ({ readyCrops, harvestAll }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel>
      {Object.keys(readyCrops).length > 0 ? (
        <>
          <Label type="success" className="my-2">
            {t("obsidianShrine.readyCrops")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(readyCrops).map(([cropName, count]) => {
              return (
                <Box
                  key={cropName}
                  className="flex items-center justify-center"
                  image={ITEM_DETAILS[cropName as CropName].image}
                  count={new Decimal(count)}
                />
              );
            })}
            <Button onClick={harvestAll}>{t("obsidianShrine.harvest")}</Button>
          </div>
        </>
      ) : (
        <Label type="default" className="my-2 text-center">
          {t("obsidianShrine.noCrops")}
        </Label>
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

const PlantAll: React.FC<{
  availablePlots: [string, CropPlot][];
  state: GameState;
  close: () => void;
}> = ({ availablePlots, state, close }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [selectedSeed, setSelectedSeed] = useState<CropSeedName | null>(
    localStorage.getItem("obsidianShrineSeed") as CropSeedName | null,
  );

  const now = useNow({ live: true });

  const currentSeason = state.season.season;
  const seasonalSeeds = SEASONAL_SEEDS[currentSeason].filter(
    (seed) => SEEDS[seed].plantingSpot === "Crop Plot",
  ) as CropSeedName[];

  const availableSeeds = seasonalSeeds.reduce(
    (acc, seed: CropSeedName) => {
      if (state.inventory[seed]) {
        acc[seed] = state.inventory[seed].toNumber();
      }
      return acc;
    },
    {} as Record<CropSeedName, number>,
  );

  // If the saved seed is out of season - default to the first available seed
  if (selectedSeed && !(selectedSeed in availableSeeds)) {
    setSelectedSeed(Object.keys(availableSeeds)[0] as CropSeedName);
  }

  const plantAll = () => {
    if (!selectedSeed) return;

    const updatedState = gameService.send({
      type: "seeds.bulkPlanted",
      seed: selectedSeed,
    });

    const availablePlots = getAvailablePlots(updatedState.context.state);

    // Close if all plots were planted
    if (availablePlots.length === 0) {
      close();
    }
  };

  const selectSeed = (seed: CropSeedName) => {
    localStorage.setItem("obsidianShrineSeed", seed);
    setSelectedSeed(seed);
  };

  return (
    <InnerPanel>
      {Object.keys(availableSeeds).length > 0 ? (
        <>
          <Label type="default" className="my-2">
            {t("obsidianShrine.plantAll")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(availableSeeds).map(([seed, count]) => {
              return (
                <Box
                  key={seed}
                  image={
                    ITEM_DETAILS[SEEDS[seed as SeedName]?.yield as CropName]
                      ?.image
                  }
                  onClick={() => selectSeed(seed as CropSeedName)}
                  isSelected={selectedSeed === seed}
                  count={new Decimal(count)}
                />
              );
            })}
            {selectedSeed && (
              <div className="flex flex-wrap justify-between w-full px-2">
                <Label
                  type="default"
                  icon={
                    ITEM_DETAILS[SEEDS[selectedSeed].yield as CropName]?.image
                  }
                >
                  {selectedSeed}
                </Label>
                <Label type="info" secondaryIcon={SUNNYSIDE.icons.stopwatch}>
                  {secondsToString(getPlantSeconds(selectedSeed, state, now), {
                    length: "medium",
                    removeTrailingZeros: true,
                  })}
                </Label>
              </div>
            )}
            <Button
              onClick={plantAll}
              disabled={!selectedSeed || availablePlots.length === 0}
            >
              {availablePlots.length > 0
                ? selectedSeed
                  ? t("obsidianShrine.plant", {
                      seed: selectedSeed,
                    })
                  : t("obsidianShrine.selectSeed")
                : t("obsidianShrine.noPlots")}
            </Button>
          </div>
        </>
      ) : (
        <Label type="default" className="my-2 text-center">
          {t("obsidianShrine.noSeeds")}
        </Label>
      )}
    </InnerPanel>
  );
};
