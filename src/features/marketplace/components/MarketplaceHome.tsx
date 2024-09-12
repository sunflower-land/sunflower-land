import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";

import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import { Context } from "features/game/GameProvider";
import { GameWallet } from "features/wallet/Wallet";

import { CollectionName } from "features/game/types/marketplace";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Collection } from "./Collection";
import { signTypedData } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";

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

  const [search, setSearch] = useState("");

  return (
    <div className="flex">
      <InnerPanel className="w-64 h-96 mr-1 hidden sm:block">{`Filters`}</InnerPanel>
      <div className="h-full w-full">
        <InnerPanel className="h-full  w-full mb-1">
          <TextInput
            icon={SUNNYSIDE.icons.search}
            value={search}
            onValueChange={setSearch}
          />
        </InnerPanel>
        <InnerPanel className="h-full  w-full">
          <Collection
            search={search}
            key={collection}
            type={collection ?? "collectibles"}
          />
        </InnerPanel>
      </div>
    </div>
  );
};

const List: React.FC = () => {
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

    const signature = await signTypedData(config, {
      primaryType: "Listing",
      types: {
        Listing: [
          { name: "item", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "SFL", type: "uint256" },
        ],
      },
      message: {
        item: "Kuebiko",
        quantity: BigInt(1),
        SFL: BigInt(1),
      },
      domain: {
        name: "Sunflower Land",
      },
    });

    gameService.send("POST_EFFECT", {
      effect: {
        type: "marketplace.onChainCollectibleListed",
        item: "Kuebiko",
        signature,
        sfl: 1,
      },
    });

    setIsSigning(false);
  };

  return (
    <GameWallet action="listTrade">
      <button onClick={onClick}>{`Sign`}</button>
    </GameWallet>
  );
};
