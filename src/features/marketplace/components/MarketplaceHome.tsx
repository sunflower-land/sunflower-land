import { ButtonPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useState } from "react";

import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import { InventoryItemName } from "features/game/types/game";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { OPEN_SEA_COLLECTIBLES } from "metadata/metadata";

type MarketplaceCategoryName =
  | "Collectibles"
  | "Wearables"
  | "Buds"
  | "Resources";

type MarketplaceCategory = {
  name: MarketplaceCategoryName;
  icon: string;
};
const CATEGORIES: MarketplaceCategory[] = [
  {
    name: "Collectibles",
    icon: ITEM_DETAILS["Grinx's Hammer"].image,
  },
  {
    name: "Wearables",
    icon: wearableIcon,
  },
  {
    name: "Buds",
    icon: budIcon,
  },
  {
    name: "Resources",
    icon: ITEM_DETAILS["Pumpkin"].image,
  },
];

export const MarketplaceHome: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategoryName>("Collectibles");

  return (
    <div>
      <div className="flex flex-wrap">
        {CATEGORIES.map((category) => (
          <div key={category.name} className="relative  pr-1 w-1/2 sm:w-auto">
            <ButtonPanel
              onClick={() => setSelectedCategory(category.name)}
              className="flex items-center"
              selected={category.name === selectedCategory}
            >
              <img src={category.icon} className="h-8 mr-2" />
              <span className="text-sm sm:text-base">{category.name}</span>
            </ButtonPanel>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {(["Fat Chicken", "Rock Golem"] as InventoryItemName[]).map((item) => {
          return (
            <ListViewCard
              name={item}
              hasBoost
              price={new Decimal(25)}
              image={OPEN_SEA_COLLECTIBLES[item].image}
              supply={10000}
              key={item}
            />
          );
        })}
      </div>
    </div>
  );
};
