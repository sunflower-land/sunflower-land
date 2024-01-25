import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { InventoryItemName } from "features/game/types/game";

import bg from "assets/ui/brown_background.png";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { BuffLabel } from "features/game/types";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { gameAnalytics } from "lib/gameAnalytics";
import { CollectiblesItem, WearablesItem } from "../MegaStore";
import { MachineState } from "features/game/lib/gameMachine";
import { getSeasonalTicket } from "features/game/types/seasons";

interface ItemOverlayProps {
  item: WearablesItem | CollectiblesItem | null;
  image: string;
  isWearable: boolean;
  buff?: BuffLabel;
  isVisible: boolean;
  onClose: () => void;
}

const _sflBalance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const ItemDetail: React.FC<ItemOverlayProps> = ({
  item,
  image,
  buff,
  isWearable,
  isVisible,
  onClose,
}) => {
  const { shortcutItem, gameService } = useContext(Context);
  const sflBalance = useSelector(gameService, _sflBalance);
  const inventory = useSelector(gameService, _inventory);
  const [imageWidth, setImageWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (isWearable) {
      setImageWidth(PIXEL_SCALE * 50);
      return;
    }

    const imgElement = new Image();

    imgElement.onload = function () {
      const trueWidth = imgElement.width;
      const scaledWidth = trueWidth * PIXEL_SCALE;

      setImageWidth(scaledWidth);
    };

    imgElement.src = image;
  }, []);

  const canAfford = () => {
    if (!item) return false;

    if (item.currency === "SFL") {
      return sflBalance.greaterThanOrEqualTo(item.price);
    }

    const currency =
      item.currency === "Seasonal Ticket" ? getSeasonalTicket() : item.currency;

    return (inventory[currency] ?? new Decimal(0)).greaterThanOrEqualTo(
      item.price
    );
  };

  const trackAnalytics = () => {
    if (!item) return;

    const { name, currency, price } = item;
    const type = isWearable ? "Wearable" : "Collectible";

    gameAnalytics.trackSink({
      currency,
      amount: price.toNumber(),
      item: name,
      type,
    });

    if (!isWearable) {
      const itemName = name as InventoryItemName;
      const count = inventory[itemName]?.toNumber() ?? 1;
      gameAnalytics.trackMilestone({
        event: `Crafting:Collectible:${itemName}${count}`,
      });
    }
  };

  const handleBuy = () => {
    if (!item) return;

    const { name } = item;

    if (isWearable) {
      gameService.send("wearable.bought", {
        name,
      });
    } else {
      gameService.send("collectible.crafted", {
        name,
      });

      shortcutItem(name as InventoryItemName);
    }

    trackAnalytics();
  };

  const currency =
    item?.currency === "Seasonal Ticket"
      ? getSeasonalTicket()
      : (item?.currency as InventoryItemName);

  return (
    <InnerPanel className="shadow-md">
      {isVisible && (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center w-full">
            <div style={{ width: `${PIXEL_SCALE * 9}px` }} />
            <span className="flex-1 text-center">{item?.name}</span>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 9}px`,
              }}
            />
          </div>
          <div className="w-full p-2">
            <div className="flex">
              <div
                className="w-[45%] min-w-[45%] sm:w-1/2 sm:min-w-[50%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={image}
                  alt={item?.name}
                  className={classNames()}
                  style={{
                    width: `${imageWidth}px`,
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                {!!buff && (
                  <div className="flex content-start flex-col sm:flex-row sm:flex-wrap gap-2">
                    <Label
                      type={buff.labelType}
                      icon={buff.boostTypeIcon}
                      secondaryIcon={buff.boostedItemIcon}
                    >
                      {buff.shortDescription}
                    </Label>
                  </div>
                )}
                <span className="text-xs leading-none">
                  {item?.shortDescription}
                </span>
                {item && (
                  <div className="flex flex-1 items-end">
                    {item?.currency === "SFL" && (
                      <RequirementLabel
                        type="sfl"
                        balance={sflBalance}
                        requirement={item.price}
                      />
                    )}
                    {item?.currency !== "SFL" && (
                      <RequirementLabel
                        type="item"
                        item={currency}
                        balance={inventory[currency] ?? new Decimal(0)}
                        requirement={item?.price ?? new Decimal(0)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Button disabled={!canAfford()} onClick={handleBuy}>{`Buy ${
        isWearable ? "wearable" : "collectible"
      }`}</Button>
    </InnerPanel>
  );
};
