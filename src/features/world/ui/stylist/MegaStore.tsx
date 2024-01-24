import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { getTimeLeft, secondsToString } from "lib/utils/time";

import token from "assets/icons/token_2.png";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibles";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { formatNumber } from "lib/utils/formatNumber";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

type Currency = InventoryItemName | "sfl";

type WearablesItem = {
  name: BumpkinItem;
  shortDescription: string;
  currency: Currency;
  price: Decimal;
};

type CollectiblesItem = {
  name: InventoryItemName;
  shortDescription: string;
  currency: Currency;
  price: Decimal;
};

type MegaStoreItem = {
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
      currency: "Mermaid Scale",
      price: new Decimal(100),
    },
    {
      name: "Soil Krabby",
      shortDescription:
        "This little guy will help you sift through your soil in no time.",
      currency: "sfl",
      price: new Decimal(1000),
    },
  ],
  wearables: [
    {
      name: "Tiki Mask",
      shortDescription:
        "This mask will help you get into the spirit of the island.",
      currency: "Mermaid Scale",
      price: new Decimal(250),
    },
    {
      name: "Angler Waders",
      shortDescription:
        "Stay dry and warm with these waders, perfect for fishing.",
      currency: "Mermaid Scale",
      price: new Decimal(500),
    },
    {
      name: "Stockeye Salmon Onesie",
      shortDescription:
        "This onesie is perfect for a cold night out on the lake.",
      currency: "Mermaid Scale",
      price: new Decimal(30000),
    },
  ],
};

const CURRENCY_ICONS: Partial<Record<Currency, string>> = {
  "Mermaid Scale": ITEM_DETAILS["Mermaid Scale"].image,
  sfl: token,
};

const _sflBalance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const MegaStore: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState(0);
  const [isOverlayVisibleItem, setOverlayVisibleItem] = useState<
    WearablesItem | CollectiblesItem | null
  >(null);

  const handleClickItem = (item: WearablesItem | CollectiblesItem) => {
    setOverlayVisibleItem(item);
  };

  const sflBalance = useSelector(gameService, _sflBalance);
  const inventory = useSelector(gameService, _inventory);

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
            <Label icon={SUNNYSIDE.icons.stopwatch} type="danger">
              {secondsToString(timeRemaining, {
                length: "medium",
                removeTrailingZeros: true,
              })}{" "}
              left!
            </Label>
            {/* Wearables */}
            <div className="flex flex-col space-y-2">
              <Label type="info">Wearables</Label>
              <div className="flex gap-2 flex-wrap">
                {MEGA_STORE_ITEMS.wearables.map((item) => {
                  const buff = BUMPKIN_ITEM_BUFF_LABELS[item.name];

                  return (
                    <div
                      id={`mega-store-item-${item.name}`}
                      key={item.name}
                      className="flex flex-col space-y-1"
                    >
                      <div
                        className="bg-brown-600 cursor-pointer relative"
                        style={{
                          ...pixelDarkBorderStyle,
                        }}
                        onClick={() => handleClickItem(item)}
                      >
                        <div className="flex justify-center items-center w-full h-full">
                          <SquareIcon
                            icon={getImageUrl(ITEM_IDS[item.name])}
                            width={20}
                          />
                          {buff && (
                            <img
                              src={buff.boostTypeIcon}
                              className="absolute -right-2 -top-2 object-contain"
                              style={{
                                width: `${PIXEL_SCALE * 7}px`,
                              }}
                              alt="crop"
                            />
                          )}
                        </div>
                      </div>
                      {/* Price */}
                      <div className="flex items-center space-x-1">
                        <SquareIcon
                          icon={CURRENCY_ICONS[item.currency] as string}
                          width={7}
                        />
                        <span className="text-xxs">
                          {formatNumber(item.price.toNumber())}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Collectibles */}
            <div className="flex flex-col space-y-2">
              <Label type="info">Collectibles</Label>
              <div className="flex gap-2 flex-wrap">
                {MEGA_STORE_ITEMS.collectibles.map((item) => {
                  const buff = COLLECTIBLE_BUFF_LABELS[item.name];

                  return (
                    <div key={item.name} className="flex flex-col space-y-1">
                      <div
                        className="bg-brown-600 cursor-pointer relative"
                        style={{
                          ...pixelDarkBorderStyle,
                        }}
                      >
                        <SquareIcon
                          icon={ITEM_DETAILS[item.name].image}
                          width={20}
                        />
                        {buff && (
                          <img
                            src={buff.boostTypeIcon}
                            className="absolute -right-2 -top-2 object-contain"
                            style={{
                              width: `${PIXEL_SCALE * 7}px`,
                            }}
                            alt="crop"
                          />
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <SquareIcon
                          icon={CURRENCY_ICONS[item.currency] as string}
                          width={7}
                        />
                        <span className="text-xxs">
                          {formatNumber(item.price.toNumber())}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Overlay */}
          <div
            className={classNames(
              "bg-black transform transition-all h-full w-full absolute inset-1",
              {
                "opacity-0 pointer-events-none": !isOverlayVisibleItem,
                "opacity-10 pointer-events-auto": !!isOverlayVisibleItem,
              }
            )}
            style={{
              boxShadow: "rgba(0, 0, 0) 0px 0px 5px 6px",
            }}
            onClick={() => setOverlayVisibleItem(null)}
          />
          <InnerPanel
            className={classNames(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all",
              {
                "scale-0": !isOverlayVisibleItem,
                "scale-100": !!isOverlayVisibleItem,
              }
            )}
          >
            <span>Hello</span>
          </InnerPanel>
        </div>
      )}

      {tab === 1 && <div></div>}
    </CloseButtonPanel>
  );
};
