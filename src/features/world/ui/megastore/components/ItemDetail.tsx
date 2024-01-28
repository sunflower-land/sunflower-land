import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import {
  CollectiblesItem,
  InventoryItemName,
  WearablesItem,
} from "features/game/types/game";

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
import { MachineState } from "features/game/lib/gameMachine";
import { getSeasonalTicket } from "features/game/types/seasons";
import confetti from "canvas-confetti";

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
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

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

    return (
      inventory[currency as InventoryItemName] ?? new Decimal(0)
    ).greaterThanOrEqualTo(item.price);
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

    gameService.send("megastoreItem.bought", {
      name: item.name,
    });

    if (!isWearable) {
      shortcutItem(item.name as InventoryItemName);
    }

    confetti();
    trackAnalytics();
    setShowSuccess(true);
  };

  const getSuccessCopy = () => {
    if (isWearable) {
      return "Nice buy! Your new wearable is safely stored in your wardrobe. You can equip it to a bumpkin from there.";
    }

    return "Nice buy! Your new collectible is safely stored in your inventory.";
  };

  const currency =
    item?.currency === "Seasonal Ticket"
      ? getSeasonalTicket()
      : (item?.currency as InventoryItemName);

  return (
    <InnerPanel className="shadow">
      {isVisible && (
        <>
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
            {!showSuccess && (
              <div className="w-full p-2">
                <div className="flex">
                  <div
                    className="w-[40%] min-w-[40%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
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
            )}
          </div>
          {!showSuccess && (
            <Button disabled={!canAfford()} onClick={handleBuy}>{`Buy ${
              isWearable ? "wearable" : "collectible"
            }`}</Button>
          )}
          {showSuccess && (
            <div className="flex flex-col space-y-1">
              <span className="p-2 text-xs">{getSuccessCopy()}</span>
              <Button onClick={onClose}>Ok</Button>
            </div>
          )}
        </>
      )}
    </InnerPanel>
  );
};
