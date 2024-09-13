import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";

import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import lightning from "assets/icons/lightning.png";
import filterIcon from "assets/icons/filter_icon.webp";

import { Context } from "features/game/GameProvider";
import { GameWallet } from "features/wallet/Wallet";

import { CollectionName } from "features/game/types/marketplace";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Collection } from "./Collection";
import { signTypedData } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

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
  const [purpose, setPurpose] = useState<MarketplacePurpose>("boost");

  const [showFilters, setShowFilters] = useState(false);
  return (
    <>
      <div className="flex h-full">
        <InnerPanel className="w-64 h-96 mr-1 hidden lg:block">
          <Filters purpose={purpose} onPurposeChange={setPurpose} />
        </InnerPanel>
        <div className="flex-1 flex flex-col">
          <InnerPanel className="w-full mb-1">
            <div className="flex  items-center">
              <TextInput
                icon={SUNNYSIDE.icons.search}
                value={search}
                onValueChange={setSearch}
              />
              <img
                src={filterIcon}
                onClick={() => setShowFilters(true)}
                className="h-8 mx-1 block lg:hidden cursor-pointer"
              />
            </div>
          </InnerPanel>
          <InnerPanel className="flex-1 w-full overflow-scroll scrollable pr-1 overflow-x-hidden">
            <Collection
              search={search}
              key={collection}
              purpose={purpose}
              type={collection ?? "collectibles"}
            />
          </InnerPanel>
        </div>
      </div>
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <CloseButtonPanel onClose={() => setShowFilters(false)}>
          <Filters purpose={purpose} onPurposeChange={setPurpose} />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

export type MarketplacePurpose = "boost" | "decoration" | "resource";

const COLLECTION_FILTERS: {
  name: CollectionName;
  icon: string;
  term: TranslationKeys;
}[] = [
  {
    name: "collectibles",
    term: "collectibles",
    icon: ITEM_DETAILS["Gnome"].image,
  },
  {
    name: "wearables",
    term: "wearables",
    icon: wearableIcon,
  },
  {
    name: "buds",
    term: "buds",
    icon: budIcon,
  },
];

const PURPOSE_FILTERS: {
  name: MarketplacePurpose;
  icon: string;
  term: TranslationKeys;
}[] = [
  {
    name: "boost",
    term: "marketplace.boost",
    icon: lightning,
  },
  {
    name: "decoration",
    term: "decoration",
    icon: SUNNYSIDE.icons.heart,
  },
  // {
  //   name: "resource",
  //   term: "resource",
  //   icon: ITEM_DETAILS.Carrot.image,
  // },
];

const Filters: React.FC<{
  purpose: MarketplacePurpose;
  onPurposeChange: (purpose: MarketplacePurpose) => void;
}> = ({ purpose, onPurposeChange }) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="p-1">
      <Label className="-ml-1 mb-2" type="default">
        {t("marketplace.collection")}
      </Label>
      {COLLECTION_FILTERS.map((filter) => (
        <div className="flex justify-between items-center" key={filter.name}>
          <div className="flex items-center">
            <SquareIcon icon={filter.icon} width={10} />
            <span className="text-sm ml-1">{t(filter.term)}</span>
          </div>
          <ButtonPanel
            onClick={() => {
              navigate(`/marketplace/${filter.name}`);
            }}
            className="relative"
          >
            <div className="h-2 w-2"></div>
            {pathname.includes(filter.name) && (
              <img
                src={SUNNYSIDE.icons.confirm}
                className="absolute top-0 right-0"
                style={{
                  width: `${PIXEL_SCALE * 14}px`,
                }}
              />
            )}
          </ButtonPanel>
        </div>
      ))}
      <Label className="-ml-1 my-2" type="default">
        {t("marketplace.purpose")}
      </Label>
      {PURPOSE_FILTERS.map((filter) => (
        <div className="flex justify-between items-center" key={filter.name}>
          <div className="flex items-center">
            <SquareIcon icon={filter.icon} width={10} />
            <span className="text-sm ml-1">{t(filter.term)}</span>
          </div>
          <ButtonPanel onClick={() => onPurposeChange(filter.name)}>
            <div className="h-2 w-2"></div>
            {purpose === filter.name && (
              <img
                src={SUNNYSIDE.icons.confirm}
                className="absolute top-0 right-0"
                style={{
                  width: `${PIXEL_SCALE * 14}px`,
                }}
              />
            )}
          </ButtonPanel>
        </div>
      ))}
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
