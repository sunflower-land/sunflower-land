import React, { useRef } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  FERTILISERS,
  COUPONS,
  Bumpkin,
  GameState,
} from "features/game/types/game";
import { CROP_SEEDS, CropName, CROPS } from "features/game/types/crops";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { getKeys } from "features/game/types/craftables";
import { getBasketItems } from "./utils/inventory";
import { RESOURCES } from "features/game/types/resources";
import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { BEANS } from "features/game/types/beans";
import { FRUIT, FruitSeedName, FRUIT_SEEDS } from "features/game/types/fruits";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SUNNYSIDE } from "assets/sunnyside";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BEACH_BOUNTY_TREASURE } from "features/game/types/treasure";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { getFruitTime } from "features/game/events/landExpansion/fruitPlanted";

interface Prop {
  gameState: GameState;
  selected: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
}

export const Basket: React.FC<Prop> = ({ gameState, selected, onSelect }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { inventory, bumpkin, collectibles } = gameState;
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

  const isFruitSeed = (selected: InventoryItemName) =>
    selected in FRUIT_SEEDS();
  const isSeed = (selected: InventoryItemName) =>
    isFruitSeed(selected) || selected in CROP_SEEDS();
  const isFood = (selected: InventoryItemName) => selected in CONSUMABLES;

  const getHarvestTime = (seedName: SeedName) => {
    if (isFruitSeed(selected)) {
      return getFruitTime(seedName as FruitSeedName, collectibles);
    }

    const crop = SEEDS()[seedName].yield as CropName;
    return getCropTime(crop, inventory, collectibles, bumpkin as Bumpkin);
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
  const resources = getItems(RESOURCES);
  const consumables = getItems(CONSUMABLES);
  const fertilisers = getItems(FERTILISERS);
  const coupons = getItems(COUPONS);
  const bounty = getItems(BEACH_BOUNTY_TREASURE);

  const allSeeds = [...seeds, ...fruitSeeds];
  const allTools = [...workbenchTools, ...treasureTools];

  const itemsSection = (title: string, items: InventoryItemName[]) => {
    if (!items.length) {
      return <></>;
    }

    return (
      <div className="flex flex-col pl-2 mb-2 w-full" key={title}>
        {<p className="mb-2">{title}</p>}
        <div className="flex mb-2 flex-wrap -ml-1.5">
          {items.map((item) => (
            <Box
              count={inventory[item]}
              isSelected={selected === item}
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
      showPanel={!!selected}
      panel={
        selected && (
          <InventoryItemDetails
            details={{
              item: selected,
            }}
            properties={{
              harvests: isFruitSeed(selected)
                ? {
                    minHarvest: harvestCounts[0],
                    maxHarvest: harvestCounts[1],
                  }
                : undefined,
              xp: isFood(selected)
                ? new Decimal(
                    getFoodExpBoost(
                      CONSUMABLES[selected as ConsumableName],
                      gameState.bumpkin as Bumpkin,
                      gameState.collectibles
                    )
                  )
                : undefined,
              timeSeconds: isSeed(selected)
                ? getHarvestTime(selected as SeedName)
                : undefined,
              showOpenSeaLink: true,
            }}
          />
        )
      }
      content={
        <>
          {itemsSection("Seeds", allSeeds)}
          {itemsSection("Tools", allTools)}
          {itemsSection("Crops", crops)}
          {itemsSection("Fruits", fruits)}
          {itemsSection("Resources", resources)}
          {itemsSection("Exotic", exotic)}
          {itemsSection("Foods", consumables)}
          {itemsSection("Fertilisers", fertilisers)}
          {itemsSection("Bounty", bounty)}
          {itemsSection("Coupons", coupons)}
        </>
      }
    />
  );
};
