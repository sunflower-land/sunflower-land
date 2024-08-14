import { ButtonPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useState } from "react";

import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";

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
              className="flex"
              selected={category.name === selectedCategory}
            >
              <img src={category.icon} className="h-8 mr-2" />
              <span className="text-sm sm:text-base">{category.name}</span>
            </ButtonPanel>
          </div>
        ))}
      </div>
    </div>
  );
};
