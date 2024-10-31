import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import orange from "assets/resources/orange.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import {
  CROP_SEEDS,
  GREENHOUSE_SEEDS,
  GreenHouseCropSeedName,
  PlotCropName,
} from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { makeBulkBuySeeds } from "./lib/makeBulkBuyAmount";
import { getBumpkinLevel } from "features/game/lib/level";
import { SEEDS, SeedName } from "features/game/types/seeds";
import { Bumpkin } from "features/game/types/game";
import {
  GREENHOUSE_FRUIT_SEEDS,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { getFruitPatchTime } from "features/game/events/landExpansion/fruitPlanted";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { PLOT_CROP_LIFECYCLE } from "features/island/plots/lib/plant";
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
import { hasFeatureAccess } from "lib/flags";
import {
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
} from "features/game/events/landExpansion/harvest";
import { Restock } from "./restock/Restock";

export const Seeds: React.FC = () => {
  const [selectedName, setSelectedName] = useState<SeedName>("Sunflower Seed");
  const [confirmBuyModal, showConfirmBuyModal] = useState(false);

  const selected = SEEDS()[selectedName];
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { t } = useAppTranslation();

  const { inventory } = state;

  const price = getBuyPrice(selectedName, selected, inventory, state);

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

    if (
      state.context.state.bumpkin?.activity?.["Sunflower Seed Bought"] === 1
    ) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerSeedBought:Completed",
      });
    }
  };

  const lessFunds = (amount = 1) => {
    return state.coins < price * amount;
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
    const seed = SEEDS()[seedName];
    return getBumpkinLevel(state.bumpkin?.experience ?? 0) < seed.bumpkinLevel;
  };

  const Action = () => {
    if (!inventory[plantingSpot]) {
      return (
        <div className="flex justify-center">
          <Label className="mb-1" type="danger">
            {t("seeds.plantingSpot.needed", { plantingSpot: plantingSpot })}
          </Label>
        </div>
      );
    }

    if (isSeedLocked(selectedName)) {
      // return nothing if requirement not met
      return <></>;
    }

    // return delayed sync when no stock
    if (stock.lessThanOrEqualTo(0)) {
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
          {state.island.type !== "basic" && bulkSeedBuyAmount > 10 && (
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

  const yields = SEEDS()[selectedName].yield;

  const getPlantSeconds = () => {
    if (selectedName in FLOWER_SEEDS()) {
      return getFlowerTime(selectedName as FlowerSeedName, state);
    }

    if (yields && yields in PATCH_FRUIT())
      return getFruitPatchTime(
        selectedName as PatchFruitSeedName,
        state,
        (state.bumpkin as Bumpkin)?.equipped ?? {},
      );

    if (
      selectedName in GREENHOUSE_SEEDS ||
      selectedName in GREENHOUSE_FRUIT_SEEDS()
    ) {
      const plant = SEED_TO_PLANT[selectedName as GreenHouseCropSeedName];
      const seconds = getGreenhouseCropTime({
        crop: plant,
        game: state,
      });
      return seconds;
    }

    return getCropPlotTime({
      crop: yields as PlotCropName,
      inventory,
      game: state,
      buds: state.buds ?? {},
    });
  };

  const getHarvestCount = () => {
    if (!yields) return undefined;

    if (!(yields in PATCH_FRUIT())) return undefined;

    return getFruitHarvests(state);
  };

  const harvestCount = getHarvestCount();
  const seeds = getKeys(SEEDS()).filter((seed) => !SEEDS()[seed].disabled);

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          stock={stock}
          details={{
            item: selectedName,
          }}
          hideDescription
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
            timeSeconds: getPlantSeconds(),
          }}
          actionView={Action()}
        />
      }
      content={
        <div className="pl-1">
          <Label
            icon={PLOT_CROP_LIFECYCLE.Sunflower.crop}
            type="default"
            className="ml-2 mb-1"
          >
            {`Basic Crops`}
          </Label>
          <div className="flex flex-wrap mb-2">
            {seeds
              .filter((name) => name in CROP_SEEDS)
              .filter((name) => isBasicCrop(name.split(" ")[0] as PlotCropName))
              .filter(
                (name) =>
                  name !== "Barley Seed" || hasFeatureAccess(state, "BARLEY"),
              )
              .map((name: SeedName) => (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => onSeedClick(name)}
                  image={ITEM_DETAILS[name].image}
                  showOverlay={isSeedLocked(name)}
                  secondaryImage={
                    isSeedLocked(name) ? SUNNYSIDE.icons.lock : undefined
                  }
                  count={inventory[name]}
                />
              ))}
          </div>
          <Label
            icon={PLOT_CROP_LIFECYCLE.Carrot.crop}
            type="default"
            className="ml-2 mb-1"
          >
            {`Medium Crops`}
          </Label>
          <div className="flex flex-wrap mb-2">
            {seeds
              .filter((name) => name in CROP_SEEDS)
              .filter((name) => isMediumCrop(name.split(" ")[0] as PlotCropName))
              .map((name: SeedName) => (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => onSeedClick(name)}
                  image={ITEM_DETAILS[name].image}
                  showOverlay={isSeedLocked(name)}
                  secondaryImage={
                    isSeedLocked(name) ? SUNNYSIDE.icons.lock : undefined
                  }
                  count={inventory[name]}
                />
              ))}
          </div>
          <Label
            icon={PLOT_CROP_LIFECYCLE.Kale.crop}
            type="default"
            className="ml-2 mb-1"
          >
            {`Advanced Crops`}
          </Label>
          <div className="flex flex-wrap mb-2">
            {seeds
              .filter((name) => name in CROP_SEEDS)
              .filter((name) => isAdvancedCrop(name.split(" ")[0] as PlotCropName))
              .filter(
                (name) =>
                  name !== "Barley Seed" || hasFeatureAccess(state, "BARLEY"),
              )
              .map((name: SeedName) => (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => onSeedClick(name)}
                  image={ITEM_DETAILS[name].image}
                  showOverlay={isSeedLocked(name)}
                  secondaryImage={
                    isSeedLocked(name) ? SUNNYSIDE.icons.lock : undefined
                  }
                  count={inventory[name]}
                />
              ))}
          </div>
          <Label icon={orange} type="default" className="ml-2 mb-1">
            {t("fruits")}
          </Label>
          <div className="flex flex-wrap mb-2">
            {seeds
              .filter((name) => name in PATCH_FRUIT_SEEDS())
              .map((name: SeedName) => (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => onSeedClick(name)}
                  image={ITEM_DETAILS[name].image}
                  showOverlay={isSeedLocked(name)}
                  secondaryImage={
                    isSeedLocked(name) ? SUNNYSIDE.icons.lock : undefined
                  }
                  count={inventory[name]}
                />
              ))}
          </div>
          <>
            <Label
              icon={SUNNYSIDE.icons.seedling}
              type="default"
              className="ml-2 mb-1"
            >
              {t("flowers")}
            </Label>
            <div className="flex flex-wrap mb-2">
              {seeds
                .filter((name) => name in FLOWER_SEEDS())
                .map((name: SeedName) => (
                  <Box
                    isSelected={selectedName === name}
                    key={name}
                    onClick={() => onSeedClick(name)}
                    image={ITEM_DETAILS[name].image}
                    showOverlay={isSeedLocked(name)}
                    secondaryImage={
                      isSeedLocked(name) ? SUNNYSIDE.icons.lock : undefined
                    }
                    count={inventory[name]}
                  />
                ))}
            </div>

            <>
              <Label
                icon={SUNNYSIDE.icons.greenhouseIcon}
                type="default"
                className="ml-2 mb-1"
              >
                {t("greenhouse")}
              </Label>
              <div className="flex flex-wrap mb-2">
                {seeds
                  .filter(
                    (name) =>
                      name in GREENHOUSE_SEEDS ||
                      name in GREENHOUSE_FRUIT_SEEDS(),
                  )
                  .map((name: SeedName) => (
                    <Box
                      isSelected={selectedName === name}
                      key={name}
                      onClick={() => onSeedClick(name)}
                      image={ITEM_DETAILS[name].image}
                      showOverlay={isSeedLocked(name)}
                      secondaryImage={
                        isSeedLocked(name) ? SUNNYSIDE.icons.lock : undefined
                      }
                      count={inventory[name]}
                    />
                  ))}
              </div>
            </>
          </>
        </div>
      }
    />
  );
};
