import React, { useRef } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  FERTILISERS,
  COUPONS,
  Bumpkin,
  GameState,
  EASTER_EGG,
} from "features/game/types/game";
import {
  CROP_SEEDS,
  CropName,
  PLOT_CROPS,
  GREENHOUSE_CROPS,
  GREENHOUSE_SEEDS,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { getKeys } from "features/game/types/craftables";
import { getBasketItems } from "./utils/inventory";
import {
  ConsumableName,
  CONSUMABLES,
  COOKABLES,
  PIRATE_CAKE,
} from "features/game/types/consumables";
import { ANIMAL_RESOURCES, COMMODITIES } from "features/game/types/resources";
import { BEANS, EXOTIC_CROPS } from "features/game/types/beans";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GREENHOUSE_FRUIT,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruitSeedName,
} from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SUNNYSIDE } from "assets/sunnyside";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SELLABLE_TREASURE } from "features/game/types/treasure";
import {
  TREASURE_TOOLS,
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
} from "features/game/types/tools";
import { getFruitPatchTime } from "features/game/events/landExpansion/fruitPlanted";
import {
  WORM,
  CROP_COMPOST,
  FRUIT_COMPOST,
} from "features/game/types/composters";
import { FISH, PURCHASEABLE_BAIT } from "features/game/types/fishing";
import { Label } from "components/ui/Label";
import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BUILDING_ORDER } from "features/island/bumpkin/components/NPCModal";
import {
  SEED_TO_PLANT,
  getGreenhouseCropTime,
} from "features/game/events/landExpansion/plantGreenhouse";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { RECIPE_CRAFTABLES } from "features/game/lib/crafting";

interface Prop {
  gameState: GameState;
  selected?: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
}

export const Basket: React.FC<Prop> = ({ gameState, selected, onSelect }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { t } = useAppTranslation();

  const { inventory, buds } = gameState;
  const basketMap = getBasketItems(inventory);

  const basketIsEmpty = Object.values(basketMap).length === 0;
  if (basketIsEmpty) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
        <img
          src={SUNNYSIDE.icons.basket}
          alt="Empty Chest"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <span className="text-xs text-center mt-2">
          {t("detail.basket.empty")}
        </span>
      </div>
    );
  }

  const selectedItem = selected ?? getKeys(basketMap)[0] ?? "Sunflower Seed";

  const isPatchFruitSeed = (
    selected: InventoryItemName,
  ): selected is PatchFruitSeedName => selected in PATCH_FRUIT_SEEDS();
  const isSeed = (selected: InventoryItemName): selected is SeedName =>
    isPatchFruitSeed(selected) ||
    selected in CROP_SEEDS ||
    selected in FLOWER_SEEDS() ||
    selected in GREENHOUSE_SEEDS ||
    selected in GREENHOUSE_FRUIT_SEEDS();
  const isFood = (selected: InventoryItemName) => selected in CONSUMABLES;

  const getHarvestTime = (seedName: SeedName) => {
    if (seedName in FLOWER_SEEDS()) {
      return SEEDS()[seedName].plantSeconds;
    }

    if (isPatchFruitSeed(seedName)) {
      return getFruitPatchTime(
        seedName,
        gameState,
        (gameState.bumpkin as Bumpkin)?.equipped ?? {},
      );
    }
    if (seedName in GREENHOUSE_SEEDS || seedName in GREENHOUSE_FRUIT_SEEDS()) {
      const plant = SEED_TO_PLANT[seedName as GreenHouseCropSeedName];
      const seconds = getGreenhouseCropTime({
        crop: plant,
        game: gameState,
      });
      return seconds;
    }

    const crop = SEEDS()[seedName].yield as CropName;
    return getCropPlotTime({
      crop,
      inventory,
      game: gameState,
      buds: buds ?? {},
    });
  };

  const harvestCounts = getFruitHarvests(gameState);

  const handleItemClick = (item: InventoryItemName) => {
    onSelect(item);
  };

  const getItems = <T extends string | number | symbol, K>(
    items: Record<T, K>,
  ) => {
    return getKeys(items).filter((item) => item in basketMap);
  };

  const seeds = getItems(CROP_SEEDS);
  const fruitSeeds = getItems(PATCH_FRUIT_SEEDS());
  const greenhouseSeeds = [
    ...getItems(GREENHOUSE_FRUIT_SEEDS()),
    ...getItems(GREENHOUSE_SEEDS),
  ];
  const flowerSeeds = getItems(FLOWER_SEEDS());
  const crops = [...getItems(PLOT_CROPS), ...getItems(GREENHOUSE_CROPS)];
  const fruits = [...getItems(PATCH_FRUIT()), ...getItems(GREENHOUSE_FRUIT())];
  const flowers = getItems(FLOWERS);
  const workbenchTools = getItems(WORKBENCH_TOOLS);
  const treasureTools = getItems(TREASURE_TOOLS);
  const animalTools = getItems(LOVE_ANIMAL_TOOLS);
  const exotic = getItems(BEANS());
  const resources = getItems(COMMODITIES).filter(
    (resource) => resource !== "Egg",
  );
  const craftingResources = getItems(RECIPE_CRAFTABLES);
  const animalResources = getItems(ANIMAL_RESOURCES);
  const animalFeeds = getItems(ANIMAL_FOODS);

  // Sort all foods by Cooking Time and Building
  const foods = getItems(COOKABLES)
    .sort((a, b) => COOKABLES[a].cookingSeconds - COOKABLES[b].cookingSeconds)
    .sort(
      (a, b) =>
        BUILDING_ORDER.indexOf(COOKABLES[a].building) -
        BUILDING_ORDER.indexOf(COOKABLES[b].building),
    );
  const pirateCake = getItems(PIRATE_CAKE);

  const fertilisers = getItems(FERTILISERS);
  const coupons = getItems(COUPONS).sort((a, b) => a.localeCompare(b));
  const easterEggs = getItems(EASTER_EGG);
  const bounty = getItems(SELLABLE_TREASURE);
  const exotics = getItems(EXOTIC_CROPS);
  const cropCompost = getItems(CROP_COMPOST);
  const fruitCompost = getItems(FRUIT_COMPOST);
  const worm = getItems(WORM);
  const purchaseableBait = getItems(PURCHASEABLE_BAIT);
  const fish = getItems(FISH).sort((a, b) => a.localeCompare(b));

  const allSeeds = [
    ...seeds,
    ...fruitSeeds,
    ...flowerSeeds,
    ...greenhouseSeeds,
  ];
  const allTools = [...workbenchTools, ...treasureTools, ...animalTools];
  const allResources = [...resources, ...craftingResources];

  const itemsSection = (
    title: string,
    items: InventoryItemName[],
    icon: string,
  ) => {
    if (!items.length) {
      return <></>;
    }

    return (
      <div className="flex flex-col pl-2 mb-2 w-full" key={title}>
        {
          <Label type="default" icon={icon} className="mb-2">
            {title}
          </Label>
        }
        <div className="flex mb-2 flex-wrap -ml-1.5">
          {items.map((item) => (
            <Box
              count={inventory[item]}
              isSelected={selectedItem === item}
              key={item}
              onClick={() => handleItemClick(item)}
              image={ITEM_DETAILS[item].image}
              parentDivRef={divRef}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      wideModal={true}
      showPanel={!!selectedItem}
      panel={
        selectedItem && (
          <InventoryItemDetails
            game={gameState}
            details={{
              item: selectedItem,
            }}
            properties={{
              harvests: isPatchFruitSeed(selectedItem)
                ? {
                    minHarvest: harvestCounts[0],
                    maxHarvest: harvestCounts[1],
                  }
                : undefined,
              xp: isFood(selectedItem)
                ? new Decimal(
                    getFoodExpBoost(
                      CONSUMABLES[selectedItem as ConsumableName],
                      gameState.bumpkin as Bumpkin,
                      gameState,
                      gameState.buds ?? {},
                    ),
                  )
                : undefined,
              timeSeconds: isSeed(selectedItem)
                ? getHarvestTime(selectedItem)
                : undefined,
              showOpenSeaLink: true,
            }}
          />
        )
      }
      content={
        <>
          {itemsSection(t("seeds"), allSeeds, SUNNYSIDE.icons.seeds)}
          {itemsSection(
            t("fertilisers"),
            [...cropCompost, ...fruitCompost, ...fertilisers],
            ITEM_DETAILS["Rapid Root"].image,
          )}
          {itemsSection(t("tools"), allTools, ITEM_DETAILS["Axe"].image)}
          {itemsSection(t("crops"), crops, ITEM_DETAILS.Sunflower.image)}
          {itemsSection(t("fruits"), fruits, ITEM_DETAILS["Orange"].image)}
          {itemsSection(t("flowers"), flowers, SUNNYSIDE.icons.seedling)}
          {itemsSection(
            t("exotics"),
            [...exotic, ...exotics],
            ITEM_DETAILS["White Carrot"].image,
          )}
          {itemsSection(
            t("resources"),
            allResources,
            ITEM_DETAILS["Wood"].image,
          )}
          {itemsSection(t("animal"), animalResources, ITEM_DETAILS.Egg.image)}
          {itemsSection("Feeds", animalFeeds, ITEM_DETAILS.Hay.image)}
          {itemsSection(
            t("bait"),
            [...worm, ...purchaseableBait],
            ITEM_DETAILS["Earthworm"].image,
          )}
          {itemsSection(t("fish"), fish, ITEM_DETAILS["Anchovy"].image)}
          {itemsSection(
            t("foods"),
            [...foods, ...pirateCake],
            ITEM_DETAILS["Carrot Cake"].image,
          )}
          {itemsSection(
            t("bounty"),
            bounty,
            ITEM_DETAILS["Pirate Bounty"].image,
          )}
          {itemsSection(
            t("coupons"),
            coupons,
            ITEM_DETAILS["Trading Ticket"].image,
          )}
          {itemsSection(
            t("easter.eggs"),
            easterEggs,
            ITEM_DETAILS["Red Egg"].image,
          )}
        </>
      }
    />
  );
};
