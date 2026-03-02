import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import {
  CROP_SEEDS,
  CropName,
  CropSeedName,
  GREENHOUSE_SEEDS,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import {
  FULL_MOON_SEEDS,
  getBuyPrice,
  isFullMoonBerry,
} from "features/game/events/landExpansion/seedBought";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { makeBulkBuySeeds } from "./lib/makeBulkBuyAmount";
import { getBumpkinLevel } from "features/game/lib/level";
import { SEASONAL_SEEDS, SEEDS, SeedName } from "features/game/types/seeds";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GreenHouseFruitSeedName,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { getFruitPatchTime } from "features/game/events/landExpansion/fruitPlanted";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { FLOWER_SEEDS, FlowerSeedName } from "features/game/types/flowers";
import { getFlowerTime } from "features/game/events/landExpansion/plantFlower";
import {
  SEED_TO_PLANT,
  getGreenhouseCropTime,
} from "features/game/events/landExpansion/plantGreenhouse";
import { NPC_WEARABLES } from "lib/npcs";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";

import { Restock } from "./restock/Restock";
import { BoostName, TemperateSeasonName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { secondsTillWeekReset } from "features/game/lib/factions";

import springIcon from "assets/icons/spring.webp";
import summerIcon from "assets/icons/summer.webp";
import autumnIcon from "assets/icons/autumn.webp";
import winterIcon from "assets/icons/winter.webp";
import fullMoon from "assets/icons/full_moon.png";
import { SeedRequirements } from "components/ui/layouts/SeedRequirements";
import { getKeys } from "features/game/types/decorations";
import { MachineState } from "features/game/lib/gameMachine";
import {
  BASIC_CROP_MACHINE_SEEDS,
  CROP_EXTENSION_MOD_I_SEEDS,
  CROP_EXTENSION_MOD_II_SEEDS,
  CROP_EXTENSION_MOD_III_SEEDS,
} from "features/game/events/landExpansion/supplyCropMachine";
import { isFullMoon } from "features/game/types/calendar";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { useNow } from "lib/utils/hooks/useNow";

export const SEASON_ICONS: Record<TemperateSeasonName, string> = {
  spring: springIcon,
  summer: summerIcon,
  autumn: autumnIcon,
  winter: winterIcon,
};

const _state = (state: MachineState) => state.context.state;

export const SeasonalSeeds: React.FC = () => {
  const { gameService, shortcutItem } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { inventory, coins, island, bumpkin, season } = state;
  const currentSeason = season.season;
  // Sort the seeds by their default order
  const currentSeasonSeeds = getKeys(SEEDS).filter((seed) =>
    SEASONAL_SEEDS[currentSeason].includes(seed),
  );
  const now = useNow();

  const [selectedName, setSelectedName] = useState<SeedName>(
    currentSeasonSeeds[0],
  );
  const [confirmBuyModal, showConfirmBuyModal] = useState(false);

  const [showBoosts, setShowBoosts] = useState(false);

  const selected = SEEDS[selectedName];
  const { t } = useAppTranslation();

  const { price } = getBuyPrice(selectedName, selected, state);

  const onSeedClick = (seedName: SeedName) => {
    setSelectedName(seedName);
    shortcutItem(seedName);
  };

  const buy = (amount = 1) => {
    const state = gameService.send({
      type: "seed.bought",
      item: selectedName,
      amount,
    });

    shortcutItem(selectedName);

    if (state.context.state.farmActivity?.["Sunflower Seed Bought"] === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerSeedBought:Completed",
      });
    }
  };

  const lessFunds = (amount = 1) => {
    return coins < price * amount;
  };

  const stock = state.stock[selectedName] || new Decimal(0);
  const inventoryLimit = INVENTORY_LIMIT(state)[selectedName] ?? new Decimal(0);
  const inventoryAmount = setPrecision(
    inventory[selectedName] ?? new Decimal(0),
    2,
  );
  const bulkBuyLimit = inventoryLimit.minus(inventoryAmount);
  // Calculates the difference between amount in inventory and the inventory limit
  const bulkSeedBuyAmount = makeBulkBuySeeds(stock, bulkBuyLimit);

  const plantingSpot = selected.plantingSpot;

  const isSeedLocked = (seedName: SeedName) => {
    const seed = SEEDS[seedName];
    return getBumpkinLevel(bumpkin?.experience ?? 0) < seed.bumpkinLevel;
  };

  const getAction = () => {
    if (!inventory[plantingSpot]) {
      return undefined;
    }

    if (isSeedLocked(selectedName)) {
      // return nothing if requirement not met
      return <></>;
    }

    // return delayed sync when no stock
    if (stock.lessThanOrEqualTo(0)) {
      if (isFullMoonBerry(selectedName)) {
        return <></>;
      }
      return <Restock npc={"betty"} />;
    }

    // return message if inventory is full
    if (inventoryAmount.greaterThanOrEqualTo(inventoryLimit)) {
      return (
        <p className="text-xxs text-center mb-1">{t("restock.tooManySeeds")}</p>
      );
    }

    // return buy buttons otherwise
    return (
      <>
        <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
          <Button
            disabled={lessFunds() || stock.lessThan(1)}
            onClick={() => buy(1)}
          >
            {t("buy")} {"1"}
          </Button>
          {bulkSeedBuyAmount > 10 && (
            <Button disabled={lessFunds(10)} onClick={() => buy(10)}>
              {t("buy")} {`10`}
            </Button>
          )}
          {bulkSeedBuyAmount > 1 && bulkSeedBuyAmount <= 10 && (
            <Button
              disabled={lessFunds(bulkSeedBuyAmount)}
              onClick={() => buy(bulkSeedBuyAmount)}
            >
              {t("buy")} {bulkSeedBuyAmount}
            </Button>
          )}
        </div>
        <div>
          {island.type !== "basic" && bulkSeedBuyAmount > 10 && (
            <Button
              className="mt-1"
              disabled={lessFunds(bulkSeedBuyAmount)}
              onClick={() => {
                if (price > 0) {
                  showConfirmBuyModal(true);
                } else {
                  buy(bulkSeedBuyAmount);
                }
              }}
            >
              {t("buy")} {bulkSeedBuyAmount}
            </Button>
          )}
        </div>
        {bulkSeedBuyAmount < stock.toNumber() && (
          <p className="text-xxs text-center mb-1">
            {t("seeds.reachingInventoryLimit")}
          </p>
        )}
        <ConfirmationModal
          show={confirmBuyModal}
          onHide={() => showConfirmBuyModal(false)}
          messages={[
            t("confirmation.buyCrops", {
              coinAmount: formatNumber(
                new Decimal(price).mul(bulkSeedBuyAmount),
              ),
              seedNo: bulkSeedBuyAmount,
              seedName: selectedName,
            }),
          ]}
          onCancel={() => showConfirmBuyModal(false)}
          onConfirm={() => {
            buy(bulkSeedBuyAmount);
            showConfirmBuyModal(false);
          }}
          confirmButtonLabel={`${t("buy")} ${bulkSeedBuyAmount}`}
          bumpkinParts={NPC_WEARABLES.betty}
          disabled={lessFunds(bulkSeedBuyAmount)}
        />
      </>
    );
  };

  const yields = SEEDS[selectedName].yield;

  const getBasePlantSeconds = () => {
    if (selectedName in FLOWER_SEEDS) {
      return FLOWER_SEEDS[selectedName as FlowerSeedName].plantSeconds;
    }

    if (yields && yields in PATCH_FRUIT) {
      return PATCH_FRUIT_SEEDS[selectedName as PatchFruitSeedName].plantSeconds;
    }

    if (selectedName in GREENHOUSE_SEEDS) {
      return GREENHOUSE_SEEDS[selectedName as GreenHouseCropSeedName]
        .plantSeconds;
    }
    if (selectedName in GREENHOUSE_FRUIT_SEEDS) {
      return GREENHOUSE_FRUIT_SEEDS[selectedName as GreenHouseFruitSeedName]
        .plantSeconds;
    }

    return CROP_SEEDS[selectedName as CropSeedName].plantSeconds;
  };

  const getPlantSeconds = (): {
    seconds: number;
    boostsUsed: { name: BoostName; value: string }[];
  } => {
    if (selectedName in FLOWER_SEEDS) {
      return getFlowerTime(selectedName as FlowerSeedName, state);
    }

    if (yields && yields in PATCH_FRUIT)
      return getFruitPatchTime(selectedName as PatchFruitSeedName, state);

    if (
      selectedName in GREENHOUSE_SEEDS ||
      selectedName in GREENHOUSE_FRUIT_SEEDS
    ) {
      const plant = SEED_TO_PLANT[selectedName as GreenHouseCropSeedName];
      return getGreenhouseCropTime({
        crop: plant,
        game: state,
      });
    }

    const { time: seconds, boostsUsed } = getCropPlotTime({
      crop: yields as CropName,
      game: state,
      createdAt: now,
    });

    return { seconds, boostsUsed };
  };

  const baseTime = getBasePlantSeconds();

  const getHarvestCount = () => {
    if (!yields) return undefined;

    if (!(yields in PATCH_FRUIT)) return undefined;

    return getFruitHarvests(state, selectedName);
  };

  const cropMachineSeeds = getKeys(SEEDS).filter((seed) => {
    // Skip if no crop machine
    if (!inventory["Crop Machine"]) {
      return false;
    }

    // Skip if seed is already in current season
    if (currentSeasonSeeds.includes(seed)) {
      return false;
    }

    const isCropSeed = (seed: SeedName): seed is CropSeedName =>
      seed in CROP_SEEDS;

    // Skip if seed is not a crop seed
    if (!isCropSeed(seed)) {
      return false;
    }

    // Check if seed is available based on machine modules
    const hasModuleI = bumpkin.skills["Crop Extension Module I"];
    const hasModuleII = bumpkin.skills["Crop Extension Module II"];
    const hasModuleIII = bumpkin.skills["Crop Extension Module III"];

    // If seed is a basic crop machine seed, return true
    if (BASIC_CROP_MACHINE_SEEDS.includes(seed)) {
      return true;
    }

    // If Player has Module I and seed is in the list, return true
    if (hasModuleI && CROP_EXTENSION_MOD_I_SEEDS.includes(seed)) {
      return true;
    }

    // If Player has Module II and seed is in the list, return true
    if (hasModuleII && CROP_EXTENSION_MOD_II_SEEDS.includes(seed)) {
      return true;
    }

    // If Player has Module III and seed is in the list, return true
    if (hasModuleIII && CROP_EXTENSION_MOD_III_SEEDS.includes(seed)) {
      return true;
    }

    return false;
  });

  const validSeeds = [
    ...cropMachineSeeds,
    ...currentSeasonSeeds,
    ...FULL_MOON_SEEDS,
  ];

  const harvestCount = getHarvestCount();

  const seasons = getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].find((seed) => seed === selectedName),
  );

  return (
    <SplitScreenView
      panel={
        <SeedRequirements
          gameState={state}
          stock={stock}
          details={{
            item: selectedName,
            seasons,
            cropMachineSeeds,
          }}
          requirements={{
            coins: price,
            showCoinsIfFree: true,
            level: isSeedLocked(selectedName)
              ? selected.bumpkinLevel
              : undefined,
            harvests: harvestCount
              ? {
                  minHarvest: harvestCount[0],
                  maxHarvest: harvestCount[1],
                }
              : undefined,
            time: getPlantSeconds(),
            baseTimeSeconds: baseTime,
            restriction: {
              icon: SEASON_ICONS[currentSeason],
              text: plantingSpot,
            },
          }}
          actionView={getAction()}
          validSeeds={validSeeds}
          setShowBoosts={setShowBoosts}
          showBoosts={showBoosts}
        />
      }
      content={
        <div className="pl-1">
          <div id="SeasonSeeds" className="mt-1">
            <div className="flex justify-between">
              <Label
                icon={SEASON_ICONS[currentSeason]}
                type="default"
                className="ml-2 mb-1 capitalize"
              >
                {`${currentSeason}`}
              </Label>
              {hasRequiredIslandExpansion(island.type, "spring") && (
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="transparent"
                  className="mb-1"
                >
                  {`${secondsToString(secondsTillWeekReset(), {
                    length: "short",
                  })} ${t("time.left")}`}
                </Label>
              )}
            </div>
            <div className="flex flex-wrap mb-2">
              {currentSeasonSeeds.map((name: SeedName) => (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => {
                    onSeedClick(name);
                    setShowBoosts(false);
                  }}
                  image={ITEM_DETAILS[SEEDS[name].yield ?? name].image}
                  showOverlay={isSeedLocked(name)}
                  // secondaryImage={SUNNYSIDE.icons.seedling}
                  count={inventory[name]}
                />
              ))}
            </div>
          </div>
          {cropMachineSeeds.length > 0 && (
            <div id="CropMachineSeeds">
              <Label
                icon={SUNNYSIDE.building.cropMachine}
                type="default"
                className="ml-2 mb-1 capitalize"
              >
                {t("cropGuide.cropMachine.seeds")}
              </Label>
              <div className="flex flex-wrap mb-2">
                {cropMachineSeeds.map((name) => (
                  <Box
                    isSelected={selectedName === name}
                    key={name}
                    onClick={() => {
                      onSeedClick(name);
                      setShowBoosts(false);
                    }}
                    image={ITEM_DETAILS[SEEDS[name].yield ?? name].image}
                    showOverlay={isSeedLocked(name)}
                    // secondaryImage={SUNNYSIDE.icons.seedling}
                    count={inventory[name]}
                  />
                ))}
              </div>
            </div>
          )}
          {isFullMoon(state) && (
            <div id="Full Moon Seeds">
              <Label
                icon={fullMoon}
                type="default"
                className="ml-2 mb-1 capitalize"
              >
                {`Full Moon Seeds`}
              </Label>
              <div className="flex flex-wrap mb-2">
                {FULL_MOON_SEEDS.map((name) => (
                  <Box
                    isSelected={selectedName === name}
                    key={name}
                    onClick={() => onSeedClick(name)}
                    image={ITEM_DETAILS[SEEDS[name].yield ?? name].image}
                    showOverlay={isSeedLocked(name)}
                    // secondaryImage={SUNNYSIDE.icons.seedling}
                    count={inventory[name]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
