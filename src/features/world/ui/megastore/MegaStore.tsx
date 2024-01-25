import React, { useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { getTimeLeft, secondsToString } from "lib/utils/time";

import token from "assets/icons/token_2.png";

import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibles";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { Transition } from "@headlessui/react";
import { BuffLabel } from "features/game/types";
import { getSeasonalTicket } from "features/game/types/seasons";
import { ItemDetail } from "./components/ItemDetails";
import { ItemsList } from "./components/ItemsList";

interface Props {
  onClose: () => void;
}

export type Currency = "SFL" | InventoryItemName;

export type WearablesItem = {
  name: BumpkinItem;
  shortDescription: string;
  currency: Currency;
  price: Decimal;
};

export type CollectiblesItem = {
  name: InventoryItemName;
  shortDescription: string;
  currency: Currency;
  price: Decimal;
};

export type MegaStoreItem = {
  available: {
    from: Date;
    to: Date;
  };
  wearables: WearablesItem[];
  collectibles: CollectiblesItem[];
};

const MEGA_STORE_ITEMS: MegaStoreItem = {
  available: {
    from: new Date("2024-01-01"),
    to: new Date("2024-02-01"),
  },
  collectibles: [
    {
      name: "Nana",
      shortDescription:
        "This rare beauty is a surefire way to boost your banana harvests.",
      currency: getSeasonalTicket(),
      price: new Decimal(100),
    },
    {
      name: "Soil Krabby",
      shortDescription:
        "This little guy will help you sift through your soil in no time.",
      currency: "SFL",
      price: new Decimal(1000),
    },
  ],
  wearables: [
    {
      name: "Tiki Mask",
      shortDescription:
        "This mask will help you get into the spirit of the island.",
      currency: getSeasonalTicket(),
      price: new Decimal(250),
    },
    {
      name: "Angler Waders",
      shortDescription:
        "Stay dry and warm with these waders, perfect for fishing.",
      currency: getSeasonalTicket(),
      price: new Decimal(500),
    },
    {
      name: "Stockeye Salmon Onesie",
      shortDescription:
        "This onesie is perfect for a cold night out on the lake.",
      currency: getSeasonalTicket(),
      price: new Decimal(30000),
    },
  ],
};

export const CURRENCY_ICONS: Partial<Record<Currency, string>> = {
  [getSeasonalTicket()]: ITEM_DETAILS[getSeasonalTicket()].image,
  SFL: token,
};

// type guard for WearablesItem | CollectiblesItem
const isWearablesItem = (
  item: WearablesItem | CollectiblesItem
): item is WearablesItem => {
  return (item as WearablesItem).name in ITEM_IDS;
};

export const getItemImage = (
  item: WearablesItem | CollectiblesItem | null
): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.name]);
  }

  return ITEM_DETAILS[item.name].image;
};

export const getItemBuffLabel = (
  item: WearablesItem | CollectiblesItem | null
): BuffLabel | undefined => {
  if (!item) return;

  if (isWearablesItem(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.name];
  }

  return COLLECTIBLE_BUFF_LABELS[item.name];
};

export const MegaStore: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState<
    WearablesItem | CollectiblesItem | null
  >(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClickItem = (item: WearablesItem | CollectiblesItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem && !isVisible) {
      setIsVisible(true);
    }
  }, [selectedItem, isVisible]);

  const getTotalSecondsAvailable = () => {
    const { from, to } = MEGA_STORE_ITEMS.available;

    return (to.getTime() - from.getTime()) / 1000;
  };

  const timeRemaining = getTimeLeft(Date.now(), getTotalSecondsAvailable());

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      tabs={[
        { icon: SUNNYSIDE.icons.wardrobe, name: "Sales" },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: "Guide",
        },
      ]}
      onClose={onClose}
    >
      {tab === 0 && (
        <div className="relative h-full w-full">
          <div className="flex flex-col p-2 space-y-3">
            <div className="space-y-2">
              <Label icon={SUNNYSIDE.icons.stopwatch} type="danger">
                {secondsToString(timeRemaining, {
                  length: "medium",
                  removeTrailingZeros: true,
                })}{" "}
                left!
              </Label>
              <span className="text-xs">{`Welcome to the Mega Store! Check out this month's limited items. If you like something, be sure to grab it before it vanishes into the realms of time.`}</span>
            </div>
            {/* Wearables */}
            <ItemsList
              itemsLabel="Wearables"
              items={MEGA_STORE_ITEMS.wearables}
              onItemClick={handleClickItem}
            />
            {/* Collectibles */}
            <ItemsList
              itemsLabel="Collectibles"
              items={MEGA_STORE_ITEMS.collectibles}
              onItemClick={handleClickItem}
            />
          </div>
          <Transition show={!!selectedItem}>
            {/* Overlay */}
            <Transition.Child
              enter="transition-opacity ease-linear duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="h-full w-full"
            >
              <div
                id="overlay-mine"
                className="bg-brown-300 opacity-80 absolute inset-1"
                style={{
                  boxShadow: "rgb(194 134 105) 0px 0px 5px 6px",
                }}
                onClick={() => setSelectedItem(null)}
              />
            </Transition.Child>
            <Transition.Child
              enter="transition-transform ease-out duration-150"
              enterFrom="scale-0"
              enterTo="scale-100"
              leave="transition-transform ease-out duration-150"
              leaveFrom="scale-100"
              leaveTo="scale-0"
              afterLeave={() => setIsVisible(false)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform w-full sm:w-5/6"
            >
              <ItemDetail
                isVisible={isVisible}
                item={selectedItem}
                image={getItemImage(selectedItem)}
                buff={getItemBuffLabel(selectedItem)}
                isWearable={
                  selectedItem ? isWearablesItem(selectedItem) : false
                }
                onClose={() => setSelectedItem(null)}
              />
            </Transition.Child>
          </Transition>
        </div>
      )}

      {tab === 1 && <div></div>}
    </CloseButtonPanel>
  );
};
