import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";

import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";

import { CollectionName } from "features/game/types/marketplace";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Collection } from "./Collection";

type MarketplaceCollection = {
  name: string;
  icon: string;
  route: string;
};
const COLLECTIONS: MarketplaceCollection[] = [
  {
    name: "Collectibles",
    icon: ITEM_DETAILS["Grinx's Hammer"].image,
    route: "/marketplace/collectibles",
  },
  {
    name: "Wearables",
    icon: wearableIcon,
    route: "/marketplace/wearables",
  },
  {
    name: "Buds",
    icon: budIcon,
    route: "/marketplace/buds",
  },
  {
    name: "Resources",
    icon: ITEM_DETAILS["Pumpkin"].image,
    route: "/marketplace/resources",
  },
];

export const MarketplaceHome: React.FC = () => {
  const navigate = useNavigate();
  const { collection } = useParams<{ collection: CollectionName }>();
  const { pathname } = useLocation();

  return (
    <InnerPanel className="h-full overflow-y-scroll">
      <div className="flex flex-wrap sticky -top-1 pb-1 z-10 bg-brown-200">
        {COLLECTIONS.map((collection) => (
          <div key={collection.name} className="relative  pr-1 w-1/2 sm:w-auto">
            <ButtonPanel
              onClick={() => {
                navigate(collection.route);
              }}
              className="flex items-center"
              selected={collection.name === pathname}
            >
              <img src={collection.icon} className="h-8 mr-2" />
              <span className="text-sm sm:text-base">{collection.name}</span>
            </ButtonPanel>
          </div>
        ))}
      </div>
      <Collection key={collection} type={collection ?? "collectibles"} />
    </InnerPanel>
  );
};
