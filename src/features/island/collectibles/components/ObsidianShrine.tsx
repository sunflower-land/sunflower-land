import React, { useContext, useState } from "react";
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
import { PetShrineName } from "features/game/types/pets";
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
import { CropPlot, GameState } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { getAvailablePlots } from "features/game/events/landExpansion/bulkPlant";
import { getCropsToHarvest } from "features/game/events/landExpansion/bulkHarvest";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";
import { MachineState } from "features/game/lib/gameMachine";
import { useVisiting } from "lib/utils/visitUtils";

const _visiting = (state: MachineState) => state.matches("visiting");

export const ObsidianShrine: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
  name,
}) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers } = useContext(Context);
  const { isVisiting } = useVisiting();

  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showPopover, setShowPopover] = useState(false);

  const expiresAt = createdAt + (EXPIRY_COOLDOWNS[name as PetShrineName] ?? 0);

  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const durationSeconds = EXPIRY_COOLDOWNS[name as PetShrineName] ?? 0;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const hasExpired = secondsToExpire <= 0;

  const now = useNow({ live: !hasExpired, autoEndAt: expiresAt });

  const state = useSelector(gameService, (state) => state.context.state);

  const handleRemove = () => {
    gameService.send("collectible.burned", {
      name,
      location,
      id,
    });
  };

  const availablePlots = getAvailablePlots(state);
  const { readyCrops } = getCropsToHarvest(state, now);
  const hasReadyCrops = Object.keys(readyCrops).length > 0;
  const hasAvailablePlots = availablePlots.length > 0;

  const harvestAll = () => {
    gameService.send("crops.bulkHarvested", {});
    setActiveTab(1);
  };

  if (hasExpired) {
    return (
      <div
        onClick={isVisiting ? undefined : handleRemove}
        style={{
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -2.5}px`,
          width: `${PIXEL_SCALE * 19}px`,
        }}
      >
        {showTimers && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
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

        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
          src={SUNNYSIDE.icons.dig_icon}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -8}px`,
          }}
        />

        <img
          src={ITEM_DETAILS[name].image}
          style={{
            width: `${PIXEL_SCALE * 19}px`,
          }}
          className="absolute cursor-pointer"
          alt={name}
        />
      </div>
    );
  }

  const close = () => {
    setShow(false);
  };

  const handleShrineClick = () => {
    if (hasReadyCrops || hasAvailablePlots) {
      setShow(true);
      setActiveTab(hasReadyCrops ? 0 : 1);
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
        style={{
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -2.5}px`,
          width: `${PIXEL_SCALE * 19}px`,
        }}
      >
        <img
          src={ITEM_DETAILS[name].image}
          style={{
            width: `${PIXEL_SCALE * 19}px`,
          }}
          alt={name}
        />
        {showTimers && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ width: `${PIXEL_SCALE * 14}px` }}
          >
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type={"buff"}
              percentage={percentage}
            />
          </div>
        )}
      </div>

      <Modal show={show} onHide={close}>
        <CloseButtonPanel
          tabs={[
            {
              icon: SUNNYSIDE.icons.seeds,
              name: "Harvest",
            },
            {
              icon: SUNNYSIDE.icons.plant,
              name: "Plant",
            },
          ]}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
          onClose={close}
          container={OuterPanel}
        >
          {activeTab === 0 && (
            <HarvestAll readyCrops={readyCrops} harvestAll={harvestAll} />
          )}
          {activeTab === 1 && (
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

const getPlantSeconds = (selectedSeed: CropSeedName, state: GameState) => {
  const yields = SEEDS[selectedSeed as SeedName].yield;

  const { time } = getCropPlotTime({
    crop: yields as CropName,
    game: state,
    createdAt: Date.now(),
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

    const updatedState = gameService.send("seeds.bulkPlanted", {
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
                  {secondsToString(getPlantSeconds(selectedSeed, state), {
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
