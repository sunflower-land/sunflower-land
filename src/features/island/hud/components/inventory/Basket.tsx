import React, { useRef, useState } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  type InventoryItemName,
  FERTILISERS,
  COUPONS,
  type GameState,
  EASTER_EGG,
} from "features/game/types/game";
import {
  CROP_SEEDS,
  type CropName,
  CROPS,
  GREENHOUSE_CROPS,
  GREENHOUSE_SEEDS,
  type GreenHouseCropSeedName,
} from "features/game/types/crops";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { getKeys } from "lib/object";
import { getBasketItems } from "./utils/inventory";
import {
  type ConsumableName,
  CONSUMABLES,
  COOKABLES,
  PIRATE_CAKE,
  PRIME_AGED_FISH,
  AGED_FISH,
} from "features/game/types/consumables";
import { ANIMAL_RESOURCES, COMMODITIES } from "features/game/types/resources";
import { BEANS, EXOTIC_CROPS } from "features/game/types/beans";
import {
  GREENHOUSE_FRUIT_SEEDS,
  GREENHOUSE_FRUIT,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  type PatchFruitSeedName,
} from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SUNNYSIDE } from "assets/sunnyside";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import {
  SEASONAL_SEEDS,
  type SeedName,
  SEEDS,
} from "features/game/types/seeds";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SELLABLE_TREASURES } from "features/game/types/treasure";
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
import {
  type FermentationBait,
  FISH,
  PURCHASEABLE_BAIT,
} from "features/game/types/fishing";
import { Label } from "components/ui/Label";
import {
  FLOWERS,
  FLOWER_SEEDS,
  isFlowerSeed,
} from "features/game/types/flowers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BUILDING_ORDER } from "features/game/lib/availableFood";
import {
  SEED_TO_PLANT,
  getGreenhouseCropTime,
} from "features/game/events/landExpansion/plantGreenhouse";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { RECIPE_CRAFTABLES } from "features/game/lib/crafting";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { getFlowerTime } from "features/game/events/landExpansion/plantFlower";
import { CLUTTER } from "features/game/types/clutter";
import { PET_RESOURCES } from "features/game/types/pets";
import { useNow } from "lib/utils/hooks/useNow";
import { PROCESSED_RESOURCES } from "features/game/types/processedFood";
import { CRUSTACEANS_DESCRIPTIONS } from "features/game/types/crustaceans";
import { FERMENTATION_PRODUCTS } from "features/game/types/fermentationProducts";
import {
  PICKLED_CROPS,
  type PickledCropName,
} from "features/game/types/pickled";
import {
  SPICE_RACK_PRODUCTS,
  type SpiceRackProductName,
} from "features/game/types/spiceRackProducts";
import { ANIMAL_FEED_BUFF_ITEMS } from "features/game/events/landExpansion/applyAnimalFeedBuff";
import {
  ALL_CATEGORY,
  InventoryFilters,
  type InventorySortKey,
} from "./InventoryFilters";

interface Prop {
  gameState: GameState;
  selected?: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
}

export const Basket: React.FC<Prop> = ({ gameState, selected, onSelect }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const now = useNow({ live: true });
  const [showBoosts, setShowBoosts] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [sort, setSort] = useState<InventorySortKey>("default");

  const { t } = useAppTranslation();

  const { inventory } = gameState;
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
  ): selected is PatchFruitSeedName => selected in PATCH_FRUIT_SEEDS;
  const isSeed = (selected: InventoryItemName): selected is SeedName =>
    isPatchFruitSeed(selected) ||
    selected in CROP_SEEDS ||
    selected in FLOWER_SEEDS ||
    selected in GREENHOUSE_SEEDS ||
    selected in GREENHOUSE_FRUIT_SEEDS;
  const isFood = (selected: InventoryItemName): selected is ConsumableName =>
    selected in CONSUMABLES;

  const getHarvestTime = (seedName: SeedName) => {
    if (isFlowerSeed(seedName)) {
      return getFlowerTime(seedName, gameState).seconds;
    }

    if (isPatchFruitSeed(seedName)) {
      return getFruitPatchTime(seedName, gameState).seconds;
    }
    if (seedName in GREENHOUSE_SEEDS || seedName in GREENHOUSE_FRUIT_SEEDS) {
      const plant = SEED_TO_PLANT[seedName as GreenHouseCropSeedName];
      const { seconds } = getGreenhouseCropTime({
        crop: plant,
        game: gameState,
      });
      return seconds;
    }

    const crop = SEEDS[seedName].yield as CropName;
    return getCropPlotTime({
      crop,
      game: gameState,
      createdAt: now,
    }).time;
  };

  const harvestCounts = getFruitHarvests(gameState, selectedItem as SeedName);

  const foodExpBoost = isFood(selectedItem)
    ? getFoodExpBoost({
        food: CONSUMABLES[selectedItem],
        game: gameState,
        createdAt: now,
      })
    : null;

  const handleItemClick = (item: InventoryItemName) => {
    setShowBoosts(false);
    onSelect(item);
  };

  const getItems = <T extends string | number | symbol, K>(
    items: Record<T, K> | T[],
  ): T[] => {
    if (Array.isArray(items)) {
      return items.filter((item) => item in basketMap);
    }

    return getKeys(items).filter((item) => item in basketMap);
  };

  const seeds = getItems(CROP_SEEDS);
  const fruitSeeds = getItems(PATCH_FRUIT_SEEDS);
  const greenhouseSeeds = [
    ...getItems(GREENHOUSE_FRUIT_SEEDS),
    ...getItems(GREENHOUSE_SEEDS),
  ];
  const flowerSeeds = getItems(FLOWER_SEEDS);
  const crops = [...getItems(CROPS), ...getItems(GREENHOUSE_CROPS)];
  const fruits = [...getItems(PATCH_FRUIT), ...getItems(GREENHOUSE_FRUIT)];
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
  const animalFeedBuffs = getItems(ANIMAL_FEED_BUFF_ITEMS);
  const processedFood = getItems(PROCESSED_RESOURCES);
  const crustaceans = getItems(CRUSTACEANS_DESCRIPTIONS);

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
  const fermentationProducts = getItems([...FERMENTATION_PRODUCTS]);
  const pickledCrops: PickledCropName[] = getItems([...PICKLED_CROPS]);
  const coupons = getItems(COUPONS).sort((a, b) => a.localeCompare(b));
  const easterEggs = getItems(EASTER_EGG);
  const treasure = getItems(SELLABLE_TREASURES);
  const exotics = getItems(EXOTIC_CROPS);
  const cropCompost = getItems(CROP_COMPOST);
  const fruitCompost = getItems(FRUIT_COMPOST);
  const worm = getItems(WORM);
  const purchaseableBait = getItems(PURCHASEABLE_BAIT);
  const fermentedBaits: FermentationBait[] = getItems([
    "Capsule Bait",
    "Umbrella Bait",
    "Crimson Baitfish",
  ]);
  const spices: SpiceRackProductName[] = getItems([...SPICE_RACK_PRODUCTS]);
  const fish = getItems(FISH).sort((a, b) => a.localeCompare(b));
  const agedFish = [...getItems(AGED_FISH), ...getItems(PRIME_AGED_FISH)].sort(
    (a, b) => a.localeCompare(b),
  );
  const petResources = getItems(PET_RESOURCES);

  const allSeeds = [
    ...seeds,
    ...fruitSeeds,
    ...flowerSeeds,
    ...greenhouseSeeds,
  ];
  const allTools = [...workbenchTools, ...treasureTools, ...animalTools];
  const allResources = [...resources, ...craftingResources];

  const clutter = getItems(CLUTTER);

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

  const sections: {
    id: string;
    label: string;
    icon: string;
    items: InventoryItemName[];
  }[] = [
    {
      id: "seasonalSeeds",
      label: `${t(`${gameState.season.season}.seeds`)}`,
      icon: SEASON_ICONS[gameState.season.season],
      items: allSeeds.filter((seed) =>
        SEASONAL_SEEDS[gameState.season.season].includes(seed),
      ),
    },
    {
      id: "seeds",
      label: t("seeds"),
      icon: SUNNYSIDE.icons.seeds,
      items: allSeeds.filter(
        (seed) => !SEASONAL_SEEDS[gameState.season.season].includes(seed),
      ),
    },
    {
      id: "fertilisers",
      label: t("fertilisers"),
      icon: ITEM_DETAILS["Rapid Root"].image,
      items: Array.from(
        new Set([
          ...cropCompost,
          ...fruitCompost,
          ...fertilisers,
          ...fermentationProducts,
        ]),
      ),
    },
    {
      id: "tools",
      label: t("tools"),
      icon: ITEM_DETAILS["Axe"].image,
      items: allTools,
    },
    {
      id: "feeds",
      label: t("feeds"),
      icon: ITEM_DETAILS.Hay.image,
      items: [...animalFeeds],
    },
    {
      id: "spices",
      label: t("spices"),
      icon: ITEM_DETAILS["Spice Base"].image,
      items: spices,
    },
    {
      id: "crops",
      label: t("crops"),
      icon: ITEM_DETAILS.Sunflower.image,
      items: crops,
    },
    {
      id: "fruits",
      label: t("fruits"),
      icon: ITEM_DETAILS["Orange"].image,
      items: fruits,
    },
    {
      id: "flowers",
      label: t("flowers"),
      icon: SUNNYSIDE.icons.seedling,
      items: flowers,
    },
    {
      id: "exotics",
      label: t("exotics"),
      icon: ITEM_DETAILS["White Carrot"].image,
      items: [...exotic, ...exotics],
    },
    {
      id: "resources",
      label: t("resources"),
      icon: ITEM_DETAILS["Wood"].image,
      items: allResources,
    },
    {
      id: "clutter",
      label: t("clutter"),
      icon: ITEM_DETAILS.Dung.image,
      items: clutter,
    },
    {
      id: "petResources",
      label: t("pet.resources"),
      icon: ITEM_DETAILS["Acorn"].image,
      items: petResources,
    },
    {
      id: "animal",
      label: t("animal"),
      icon: ITEM_DETAILS.Egg.image,
      items: animalResources,
    },
    {
      id: "bait",
      label: t("bait"),
      icon: ITEM_DETAILS["Earthworm"].image,
      items: [...worm, ...purchaseableBait, ...fermentedBaits],
    },
    {
      id: "fish",
      label: t("fish"),
      icon: ITEM_DETAILS["Anchovy"].image,
      items: fish,
    },
    {
      id: "agedFish",
      label: t("agedFish"),
      icon: ITEM_DETAILS["Aged Anchovy"].image,
      items: agedFish,
    },
    {
      id: "crustaceans",
      label: t("crustaceans"),
      icon: ITEM_DETAILS["Crab"].image,
      items: crustaceans,
    },
    {
      id: "processedResources",
      label: t("processedResources"),
      icon: ITEM_DETAILS["Fish Flake"].image,
      items: processedFood,
    },
    {
      id: "pickledCrops",
      label: t("pickledCrops"),
      icon: ITEM_DETAILS["Pickled Radish"].image,
      items: pickledCrops,
    },
    {
      id: "foods",
      label: t("foods"),
      icon: ITEM_DETAILS["Carrot Cake"].image,
      items: [...foods, ...pirateCake],
    },
    {
      id: "treasure",
      label: t("treasure"),
      icon: ITEM_DETAILS["Pirate Bounty"].image,
      items: treasure,
    },
    {
      id: "coupons",
      label: t("coupons"),
      icon: ITEM_DETAILS["Trading Ticket"].image,
      items: coupons,
    },
    {
      id: "easterEggs",
      label: t("easter.eggs"),
      icon: ITEM_DETAILS["Red Egg"].image,
      items: easterEggs,
    },
  ];

  const query = search.trim().toLowerCase();
  const matchesSearch = (item: InventoryItemName) =>
    !query || item.toLowerCase().includes(query);

  const visibleSections = sections.filter(
    (section) => section.items.length > 0,
  );

  const filteredSections = visibleSections
    .filter(
      (section) =>
        activeCategory === ALL_CATEGORY || section.id === activeCategory,
    )
    .map((section) => ({
      ...section,
      items: section.items.filter(matchesSearch),
    }))
    .filter((section) => section.items.length > 0);

  const sortItems = (items: InventoryItemName[]) => {
    if (sort === "amount") {
      return [...items].sort(
        (a, b) =>
          (inventory[b]?.toNumber() ?? 0) - (inventory[a]?.toNumber() ?? 0),
      );
    }
    if (sort === "name") {
      return [...items].sort((a, b) => a.localeCompare(b));
    }
    return items;
  };

  const grouped =
    sort === "default" && activeCategory === ALL_CATEGORY && !query;
  const flatItems = sortItems(
    filteredSections.flatMap((section) => section.items),
  );

  const activeSection = visibleSections.find((s) => s.id === activeCategory);

  return (
    <>
      <InventoryFilters
        search={search}
        onSearchChange={setSearch}
        categories={visibleSections.map(({ id, label, icon }) => ({
          id,
          label,
          icon,
        }))}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sort={sort}
        onSortChange={setSort}
      />
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
                seasons:
                  selectedItem in SEEDS
                    ? getKeys(SEASONAL_SEEDS).filter((season) =>
                        SEASONAL_SEEDS[season].includes(
                          selectedItem as SeedName,
                        ),
                      )
                    : undefined,
              }}
              properties={{
                harvests: isPatchFruitSeed(selectedItem)
                  ? {
                      minHarvest: harvestCounts[0],
                      maxHarvest: harvestCounts[1],
                    }
                  : undefined,
                xp: foodExpBoost?.boostedExp,
                xpBoostsUsed: foodExpBoost?.boostsUsed,
                baseXp: foodExpBoost
                  ? CONSUMABLES[selectedItem as ConsumableName].experience
                  : undefined,
                ...(foodExpBoost && {
                  showBoosts,
                  setShowBoosts,
                }),
                timeSeconds: isSeed(selectedItem)
                  ? getHarvestTime(selectedItem)
                  : undefined,
                showOpenSeaLink: true,
              }}
            />
          )
        }
        content={
          grouped ? (
            <>
              {filteredSections.map((section) =>
                itemsSection(section.label, section.items, section.icon),
              )}
            </>
          ) : flatItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center w-full p-4">
              <img
                src={SUNNYSIDE.icons.search}
                alt=""
                style={{ width: `${PIXEL_SCALE * 10}px` }}
              />
              <span className="text-xs text-center mt-2">
                {t("inventory.noResults")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col pl-2 mb-2 w-full">
              <div className="flex justify-between items-center pr-2 mb-2">
                <Label
                  type="default"
                  icon={activeSection?.icon}
                  className="mb-1"
                >
                  {activeSection?.label ?? t("inventory.all")}
                </Label>
                <span className="text-xxs">{flatItems.length}</span>
              </div>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {flatItems.map((item) => (
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
          )
        }
      />
    </>
  );
};
