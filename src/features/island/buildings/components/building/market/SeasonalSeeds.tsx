import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import {
  CROP_SEEDS,
  type CropName,
  type CropSeedName,
  GREENHOUSE_SEEDS,
  type GreenHouseCropSeedName,
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
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import {
  SEASONAL_SEEDS,
  SEEDS,
  type SeedName,
} from "features/game/types/seeds";
import {
  GREENHOUSE_FRUIT_SEEDS,
  type GreenHouseFruitSeedName,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  type PatchFruitSeedName,
} from "features/game/types/fruits";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { getFruitPatchTime } from "features/game/events/landExpansion/fruitPlanted";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { FLOWER_SEEDS, type FlowerSeedName } from "features/game/types/flowers";
import { getFlowerTime } from "features/game/events/landExpansion/plantFlower";
import {
  SEED_TO_PLANT,
  getGreenhouseCropTime,
} from "features/game/events/landExpansion/plantGreenhouse";
import { NPC_WEARABLES } from "lib/npcs";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { useVipAccess } from "lib/utils/hooks/useVipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import vipIcon from "assets/icons/vip.webp";

import { Restock } from "./restock/Restock";
import { planSeedPurchases } from "./lib/planSeedPurchases";
import type { BoostName, TemperateSeasonName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { secondsTillWeekReset } from "features/game/lib/factions";
import { SpecialEventPanel } from "../SpecialEventPanel";

import springIcon from "assets/icons/spring.webp";
import summerIcon from "assets/icons/summer.webp";
import autumnIcon from "assets/icons/autumn.webp";
import winterIcon from "assets/icons/winter.webp";
import fullMoon from "assets/icons/full_moon.png";
import { SeedRequirements } from "components/ui/layouts/SeedRequirements";
import { getKeys } from "lib/object";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  BASIC_CROP_MACHINE_SEEDS,
  CROP_EXTENSION_MOD_I_SEEDS,
  CROP_EXTENSION_MOD_II_SEEDS,
  CROP_EXTENSION_MOD_III_SEEDS,
} from "features/game/events/landExpansion/supplyCropMachine";
import { isFullMoon } from "features/game/types/calendar";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { useNow } from "lib/utils/hooks/useNow";
import {
  CHAPTER_CROP_WEEK,
  CHAPTER_CROP_WEEK_SEED,
  isChapterCropWeekActive,
} from "features/game/types/chapterCropWeek";
import { hasUpgradedChapterCropWeekSkill } from "features/game/types/bumpkinSkills";

export const SEASON_ICONS: Record<TemperateSeasonName, string> = {
  spring: springIcon,
  summer: summerIcon,
  autumn: autumnIcon,
  winter: winterIcon,
};

const _state = (state: MachineState) => state.context.state;

export const SeasonalSeeds: React.FC = () => {
  const { gameService, shortcutItem } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);
  const { inventory, coins, island, bumpkin, season } = state;
  const currentSeason = season.season;
  const isVIP = useVipAccess({ game: state });
  const canShowBuyAll = hasRequiredIslandExpansion(island.type, "spring");
  // Sort the seeds by their default order
  const currentSeasonSeeds = getKeys(SEEDS).filter((seed) =>
    SEASONAL_SEEDS[currentSeason].includes(seed),
  );

  const now = useNow();
  const isCropWeek = isChapterCropWeekActive(now);

  const [selectedName, setSelectedName] = useState<SeedName>(
    currentSeasonSeeds[0],
  );
  const [confirmBuyModal, showConfirmBuyModal] = useState(false);
  const [confirmBuyAllModal, showConfirmBuyAllModal] = useState(false);
  const [buyAllFailures, setBuyAllFailures] = useState<SeedName[]>([]);

  const [showBoosts, setShowBoosts] = useState(false);

  const selected = SEEDS[selectedName];
  const { t } = useAppTranslation();

  const { price } = getBuyPrice(selectedName, selected, state);

  const onSeedClick = (seedName: SeedName) => {
    setSelectedName(seedName);
    shortcutItem(seedName);
  };

  const buy = (amount = 1) => {
    const state = gameService.send("seed.bought", {
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
  // Rounded down to a whole seed: seeds are discrete units, and comparing
  // against inventoryLimit at 2 decimal places lets a stray fractional
  // remainder (e.g. from a historical bug) permanently block purchases
  // even though the player has less than one whole seed of headroom left.
  const inventoryAmount = setPrecision(
    inventory[selectedName] ?? new Decimal(0),
    0,
  );
  const bulkBuyLimit = inventoryLimit.minus(inventoryAmount);
  // Calculates the difference between amount in inventory and the inventory limit
  const bulkSeedBuyAmount = makeBulkBuySeeds(stock, bulkBuyLimit);

  const plantingSpot = selected.plantingSpot;

  const isSeedLocked = (seedName: SeedName) => {
    const seed = SEEDS[seedName];
    return !meetsLevelRequirement(
      getAscensionLevel({
        experience: bumpkin.experience ?? 0,
        ascensionLevel: island.ascensionLevel ?? 0,
      }),
      seed.bumpkinLevel,
    );
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
        {selectedName === CHAPTER_CROP_WEEK_SEED &&
          hasUpgradedChapterCropWeekSkill(bumpkin.skills, "Crops") && (
            <Label type="warning" className="mb-1">
              {t("chapterCropWeek.ascensionBoostsPaused")}
            </Label>
          )}
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
    ...(isCropWeek ? [CHAPTER_CROP_WEEK_SEED] : []),
  ];

  const buyAllPlan = useMemo(
    () =>
      planSeedPurchases(state, [
        ...currentSeasonSeeds,
        ...cropMachineSeeds,
        ...FULL_MOON_SEEDS,
        ...(isCropWeek ? [CHAPTER_CROP_WEEK_SEED] : []),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, currentSeasonSeeds, cropMachineSeeds, isCropWeek],
  );

  const buyAllSeeds = () => {
    const failures: SeedName[] = [];

    buyAllPlan.purchases.forEach(({ seedName, amount }) => {
      try {
        gameService.send("seed.bought", { item: seedName, amount });
      } catch (error) {
        // Don't let one seed's edge case (e.g. a race with a state change
        // since the plan was computed) abort the rest of the purchases.
        failures.push(seedName);
        // eslint-disable-next-line no-console
        console.error(`[BuyAllSeeds] Failed to buy ${seedName}:`, error);
      }
    });

    setBuyAllFailures(failures);
    showConfirmBuyAllModal(false);
  };

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
            ...(selectedName === CHAPTER_CROP_WEEK_SEED
              ? {
                  from: CHAPTER_CROP_WEEK.startDate,
                  to: CHAPTER_CROP_WEEK.endDate,
                }
              : {}),
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
                  count={inventory[name]}
                />
              ))}
            </div>
          </div>
          {isCropWeek && (
            <SpecialEventPanel
              image={
                ITEM_DETAILS[
                  SEEDS[CHAPTER_CROP_WEEK_SEED].yield ?? CHAPTER_CROP_WEEK_SEED
                ].image
              }
              title={t("chapterCropWeek.specialEventCrop")}
              endDate={CHAPTER_CROP_WEEK.endDate}
              isSelected={selectedName === CHAPTER_CROP_WEEK_SEED}
              count={inventory[CHAPTER_CROP_WEEK_SEED]}
              onSelect={() => {
                onSeedClick(CHAPTER_CROP_WEEK_SEED);
                setShowBoosts(false);
              }}
            />
          )}
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
          {canShowBuyAll && buyAllPlan.purchases.length > 0 && (
            <div className="flex flex-col items-center mb-2">
              <Button
                className="relative"
                onClick={() => {
                  setBuyAllFailures([]);
                  showConfirmBuyAllModal(true);
                }}
              >
                <img
                  src={vipIcon}
                  alt="VIP"
                  className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
                />
                {t("seeds.buyAll")}
              </Button>
              {buyAllFailures.length > 0 && (
                <Label type="danger" className="mt-1">
                  {t("seeds.buyAllPartialFailure", {
                    seeds: buyAllFailures.join(", "),
                  })}
                </Label>
              )}
            </div>
          )}
          <ConfirmationModal
            show={confirmBuyAllModal}
            onHide={() => showConfirmBuyAllModal(false)}
            messages={[
              t("confirmation.buyAllSeeds", {
                seedTypes: buyAllPlan.purchases.length,
                coinAmount: formatNumber(buyAllPlan.totalCost),
              }),
            ]}
            bodyContent={
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-h-32 overflow-y-auto scrollable mt-1">
                  {buyAllPlan.purchases.map(({ seedName, amount }) => (
                    <p key={seedName} className="text-xs w-full text-left">
                      {`${amount} x ${seedName}`}
                    </p>
                  ))}
                </div>
                <div className="w-full flex justify-around mt-2 -mb-4">
                  <div className="w-[95%]" />
                  <VIPAccess
                    isVIP={isVIP}
                    onUpgrade={() => {
                      showConfirmBuyAllModal(false);
                      openModal("BUY_BANNER");
                    }}
                  />
                </div>
              </div>
            }
            onCancel={() => showConfirmBuyAllModal(false)}
            onConfirm={buyAllSeeds}
            confirmButtonLabel={t("seeds.buyAll")}
            bumpkinParts={NPC_WEARABLES.betty}
            disabled={!isVIP || coins < buyAllPlan.totalCost}
          />
        </div>
      }
    />
  );
};
