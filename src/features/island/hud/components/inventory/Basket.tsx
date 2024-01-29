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
import { CROP_SEEDS, CropName, CROPS } from "features/game/types/crops";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { getKeys } from "features/game/types/craftables";
import { getBasketItems } from "./utils/inventory";
import {
  ConsumableName,
  CONSUMABLES,
  COOKABLES,
  PIRATE_CAKE,
} from "features/game/types/consumables";
import { COMMODITIES } from "features/game/types/resources";
import { BEANS, EXOTIC_CROPS } from "features/game/types/beans";
import { FRUIT, FruitSeedName, FRUIT_SEEDS } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SUNNYSIDE } from "assets/sunnyside";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SELLABLE_TREASURE } from "features/game/types/treasure";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { getFruitTime } from "features/game/events/landExpansion/fruitPlanted";
import {
  WORM,
  CROP_COMPOST,
  FRUIT_COMPOST,
} from "features/game/types/composters";
import { FISH, PURCHASEABLE_BAIT } from "features/game/types/fishing";
import { Label } from "components/ui/Label";

interface Prop {
  gameState: GameState;
  selected?: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
}

export const Basket: React.FC<Prop> = ({ gameState, selected, onSelect }) => {
  const divRef = useRef<HTMLDivElement>(null);

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
        <span className="text-xs text-center mt-2">Your basket is empty!</span>
      </div>
    );
  }

  const selectedItem = selected ?? getKeys(basketMap)[0] ?? "Sunflower Seed";

  const isFruitSeed = (
    selected: InventoryItemName
  ): selected is FruitSeedName => selected in FRUIT_SEEDS();
  const isSeed = (selected: InventoryItemName): selected is SeedName =>
    isFruitSeed(selected) || selected in CROP_SEEDS();
  const isFood = (selected: InventoryItemName) => selected in CONSUMABLES;

  const getHarvestTime = (seedName: SeedName) => {
    if (isFruitSeed(seedName)) {
      return getFruitTime(
        seedName,
        gameState,
        (gameState.bumpkin as Bumpkin)?.equipped ?? {}
      );
    }

    const crop = SEEDS()[seedName].yield as CropName;
    return getCropTime({
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
    items: Record<T, K>
  ) => {
    return getKeys(items).filter((item) => item in basketMap);
  };

  const seeds = getItems(CROP_SEEDS());
  const fruitSeeds = getItems(FRUIT_SEEDS());
  const crops = getItems(CROPS());
  const fruits = getItems(FRUIT());
  const workbenchTools = getItems(WORKBENCH_TOOLS());
  const treasureTools = getItems(TREASURE_TOOLS);
  const exotic = getItems(BEANS());
  const resources = getItems(COMMODITIES);
  const foods = getItems(COOKABLES);
  const pirateCake = getItems(PIRATE_CAKE);
  const fertilisers = getItems(FERTILISERS);
  const coupons = getItems(COUPONS);
  const easterEggs = getItems(EASTER_EGG);
  const bounty = getItems(SELLABLE_TREASURE);
  const exotics = getItems(EXOTIC_CROPS);
  const cropCompost = getItems(CROP_COMPOST);
  const fruitCompost = getItems(FRUIT_COMPOST);
  const worm = getItems(WORM);
  const purchaseableBait = getItems(PURCHASEABLE_BAIT);
  const fish = getItems(FISH);

  const allSeeds = [...seeds, ...fruitSeeds];
  const allTools = [...workbenchTools, ...treasureTools];

  const itemsSection = (
    title: string,
    items: InventoryItemName[],
    icon: string
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
              harvests: isFruitSeed(selectedItem)
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
                      gameState.buds ?? {}
                    )
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
          {itemsSection("Seeds", allSeeds, SUNNYSIDE.icons.seeds)}
          {itemsSection(
            "Fertilisers",
            [...cropCompost, ...fruitCompost, ...fertilisers],
            ITEM_DETAILS["Rapid Root"].image
          )}
          {itemsSection("Crops", crops, ITEM_DETAILS.Sunflower.image)}
          {itemsSection("Fruits", fruits, ITEM_DETAILS["Orange"].image)}
          {itemsSection(
            "Exotic",
            [...exotic, ...exotics],
            ITEM_DETAILS["White Carrot"].image
          )}
          {itemsSection("Tools", allTools, ITEM_DETAILS["Axe"].image)}
          {itemsSection("Resources", resources, ITEM_DETAILS["Wood"].image)}
          {itemsSection(
            "Bait",
            [...worm, ...purchaseableBait],
            ITEM_DETAILS["Earthworm"].image
          )}
          {itemsSection("Fish", fish, ITEM_DETAILS["Anchovy"].image)}
          {itemsSection(
            "Foods",
            [...foods, ...pirateCake],
            ITEM_DETAILS["Carrot Cake"].image
          )}
          {itemsSection("Bounty", bounty, ITEM_DETAILS["Pirate Bounty"].image)}
          {itemsSection(
            "Coupons",
            coupons,
            ITEM_DETAILS["Trading Ticket"].image
          )}
          {itemsSection(
            "Easter Eggs",
            easterEggs,
            ITEM_DETAILS["Red Egg"].image
          )}
        </>
      }
    />
  );
};
