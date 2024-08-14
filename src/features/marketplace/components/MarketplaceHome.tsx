import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";

import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import { Context } from "features/game/GameProvider";
import { wallet } from "lib/blockchain/wallet";
import { GameWallet } from "features/wallet/Wallet";

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
    <InnerPanel>
      <div className="flex flex-wrap">
        {COLLECTIONS.map((collection) => (
          <div key={collection.name} className="relative  pr-1 w-1/2 sm:w-auto">
            <ButtonPanel
              onClick={() => {
                navigate(collection.route);
              }}
              className="flex"
              selected={collection.name === pathname}
            >
              <img src={collection.icon} className="h-8 mr-2" />
              <span className="text-sm sm:text-base">{collection.name}</span>
            </ButtonPanel>
          </div>
        ))}
        <Category selectedCategory={selectedCategory} />
      </div>
      <Collection key={collection} type={collection ?? "collectibles"} />
    </InnerPanel>
  );
};

const Category: React.FC<{
  selectedCategory: MarketplaceCategoryName;
}> = () => {
  const [isListing, setIsListing] = useState(false);

  if (isListing) {
    return <ListTrade />;
  }

  return <button onClick={() => setIsListing(true)}>{`List`}</button>;
};

const ListTrade: React.FC = () => {
  const { gameService } = useContext(Context);

  const [isSigning, setIsSigning] = useState(false);

  const onClick = async () => {
    setIsSigning(true);

    const { signature } = await wallet.signTransaction(0);
    gameService.send("LIST_TRADE", {
      sellerId: gameService.state.context.farmId,
      items: {
        Kuebiko: 1,
      },
      sfl: 1,
      signature,
    });

    setIsSigning(false);
  };

  return (
    <GameWallet action="listTrade">
      <button onClick={onClick}>{`Sign`}</button>
    </GameWallet>
  );
};
