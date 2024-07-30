import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import {
  CollectiblesItem,
  InventoryItemName,
  WearablesItem,
} from "features/game/types/game";

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
import { BumpkinItem } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

export const ItemDetail: React.FC<ItemOverlayProps> = ({
  item,
  image,
  buff,
  isWearable,
  isVisible,
  onClose,
}) => {
  const { shortcutItem, gameService, showAnimations } = useContext(Context);
  const sflBalance = useSelector(gameService, _sflBalance);
  const inventory = useSelector(gameService, _inventory);
  const wardrobe = useSelector(gameService, _wardrobe);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState<boolean>(false);

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

  const getBalanceOfItem = (
    item: WearablesItem | CollectiblesItem | null,
  ): number => {
    if (!item) return 0;

    if (item.type === "wearable") {
      return wardrobe[item.name as BumpkinItem] ?? 0;
    }

    return (
      inventory[item.name as InventoryItemName] ?? new Decimal(0)
    ).toNumber();
  };

  const canBuy = () => {
    if (!item) return false;

    if (item.limit && getBalanceOfItem(item) >= item.limit) return false;

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
  const { t } = useAppTranslation();
  const handleBuy = () => {
    if (!item) return;

    gameService.send("megastoreItem.bought", {
      name: item.name,
    });

    if (!isWearable) {
      shortcutItem(item.name as InventoryItemName);
    }

    if (showAnimations) confetti();
    trackAnalytics();
    setShowSuccess(true);
    setConfirmBuy(false);
  };

  const buttonHandler = () => {
    if (!confirmBuy) {
      setConfirmBuy(true);
      return;
    }

    handleBuy();
  };

  const getSuccessCopy = () => {
    if (isWearable) {
      return t("megaStore.wearable");
    }

    return t("megaStore.collectible");
  };

  const balanceOfItem = getBalanceOfItem(item);

  const getLimitLabel = () => {
    if (!item?.limit) return;

    if (balanceOfItem >= item.limit) {
      return (
        <Label
          type="danger"
          className="absolute bottom-1 right-1 text-xxs"
        >{`${t("limit")}: ${balanceOfItem}/${item.limit}`}</Label> //t
      );
    }

    <span className="absolute bottom-1 right-2 text-xxs">{`${t(
      "limit",
    )}: ${balanceOfItem}/${item.limit}`}</span>; //t
  };

  const getButtonLabel = () => {
    if (confirmBuy) return `${t("confirm")} ${t("buy")}`; //t

    return `${t("buy")} ${isWearable ? "wearable" : "collectible"}`;
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
              <div className="w-full p-2 px-1">
                <div className="flex">
                  <div
                    className="w-[40%] relative min-w-[40%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
                    style={
                      item?.type === "collectible"
                        ? {
                            backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                  >
                    <img
                      src={image}
                      alt={item?.name}
                      className={"w-full"}
                      style={{
                        width: `${imageWidth}px`,
                      }}
                    />
                    {!!item?.limit && getLimitLabel()}
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
            <div
              className={classNames("flex", {
                "space-x-1": confirmBuy,
              })}
            >
              {confirmBuy && (
                <Button onClick={() => setConfirmBuy(false)}>
                  {t("cancel")}
                </Button>
              )}
              <Button disabled={!canBuy()} onClick={buttonHandler}>
                {getButtonLabel()}
              </Button>
            </div>
          )}
          {showSuccess && (
            <div className="flex flex-col space-y-1">
              <span className="p-2 text-xs">{getSuccessCopy()}</span>
              <Button onClick={onClose}>{t("ok")}</Button>
            </div>
          )}
        </>
      )}
    </InnerPanel>
  );
};
