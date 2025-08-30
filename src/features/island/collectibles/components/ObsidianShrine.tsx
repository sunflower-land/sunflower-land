import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { LiveProgressBar } from "components/ui/ProgressBar";
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
import { CropName, CROPS } from "features/game/types/crops";
import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";
import { Box } from "components/ui/Box";
import { Decimal } from "decimal.js-light";
import { CropPlot, GameState } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";

export const ObsidianShrine: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
  name,
}) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers } = useContext(Context);

  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [_, setRender] = useState(0);

  const expiresAt = createdAt + (EXPIRY_COOLDOWNS[name as PetShrineName] ?? 0);

  const hasExpired = Date.now() > expiresAt;

  const state = useSelector(gameService, (state) => state.context.state);

  const handleRemove = () => {
    gameService.send("collectible.burned", {
      name,
      location,
      id,
    });
  };

  const plots = state.crops;
  const availablePlots = Object.entries(plots).filter(([_, plot]) => {
    return plot.x !== undefined && plot.y !== undefined && !plot.crop;
  });

  const readyCrops = Object.entries(plots).reduce(
    (acc, [_, plot]) => {
      if (!plot.crop) return acc;
      if (isReadyToHarvest(Date.now(), plot.crop, CROPS[plot.crop.name])) {
        acc[plot.crop.name] = (acc[plot.crop.name] ?? 0) + 1;
      }
      return acc;
    },
    {} as Record<CropName, number>,
  );

  const harvestAll = () => {
    Object.entries(plots).forEach(([plotId, plot]) => {
      if (!plot.crop) return;
      if (isReadyToHarvest(Date.now(), plot.crop, CROPS[plot.crop.name])) {
        gameService.send("crop.harvested", { index: plotId });
      }
      setActiveTab(1);
    });
  };

  if (hasExpired) {
    return (
      <div onClick={handleRemove}>
        {showTimers && (
          <div className="absolute bottom-0 left-0">
            <LiveProgressBar
              startAt={createdAt}
              endAt={expiresAt}
              formatLength="medium"
              type="error"
              onComplete={() => setRender((r) => r + 1)}
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
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
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

  return (
    <>
      <div onClick={() => setShow(true)}>
        <img
          src={ITEM_DETAILS[name].image}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute cursor-pointer hover:img-highlight"
          alt={name}
        />
        {showTimers && (
          <div className="absolute bottom-0 left-0">
            <LiveProgressBar
              startAt={createdAt}
              endAt={expiresAt}
              formatLength="medium"
              type={"buff"}
              onComplete={() => setRender((r) => r + 1)}
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
                time: secondsToString((expiresAt - Date.now()) / 1000, {
                  length: "medium",
                  isShortFormat: true,
                  removeTrailingZeros: true,
                }),
              })}
            </span>
          </Label>
        </div>
      </Modal>
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

    const seedCount = state.inventory[selectedSeed]?.toNumber() ?? 0;
    const plotsToPlant = Math.min(seedCount, availablePlots.length);

    for (let i = 0; i < plotsToPlant; i++) {
      const [plotId, _] = availablePlots[i];
      gameService.send("seed.planted", {
        index: plotId,
        item: selectedSeed,
        cropId: crypto.randomUUID().slice(0, 8),
      });
    }

    // Close if all plots were planted,
    // otherwise keep open for more planting
    if (plotsToPlant === availablePlots.length) {
      close();
    }
  };

  const selectSeed = (seed: CropSeedName) => {
    localStorage.setItem("obsidianShrineSeed", seed);
    setSelectedSeed(seed);
  };

  const getPlantSeconds = () => {
    const yields = SEEDS[selectedSeed as SeedName].yield;

    const { time } = getCropPlotTime({
      crop: yields as CropName,
      game: state,
      createdAt: Date.now(),
    });
    return time;
  };

  return (
    <InnerPanel>
      {Object.keys(availableSeeds).length > 0 ? (
        <>
          <Label type="default" className="my-2">
            {t("obsidianShrine.plantAll")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(availableSeeds).map(([seed, count], idx) => {
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
                  {secondsToString(getPlantSeconds(), {
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
