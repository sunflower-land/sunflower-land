import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { InventoryItemName } from "features/game/types/game";

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
import confetti from "canvas-confetti";
import { BumpkinItem } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getItemDescription } from "../eventShop";
import {
  EventShopItem,
  EventShopItemName,
  MINIGAME_SHOP_ITEMS,
} from "features/game/types/minigameShop";

interface ItemOverlayProps {
  item: EventShopItem | null;
  image: string;
  isWearable: boolean;
  buff?: BuffLabel[];
  isVisible: boolean;
  onClose: () => void;
  readonly?: boolean;
}

const _inventory = (state: MachineState) => state.context.state.inventory;

export const ItemDetail: React.FC<ItemOverlayProps> = ({
  item,
  image,
  buff,
  isWearable,
  isVisible,
  onClose,
  readonly,
}) => {
  const { shortcutItem, gameService, showAnimations } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState<boolean>(false);

  const description = getItemDescription(item);
  const easterTokenBalance = inventory["Easter Token 2025"] ?? new Decimal(0);

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
  }, [image, isWearable]);

  const canBuy = () => {
    if (!item) return false;

    if (item) {
      return easterTokenBalance.greaterThanOrEqualTo(item.cost.price);
    }
  };

  const trackAnalytics = () => {
    if (!item) return;
    const { name } = item;
    const type = isWearable ? "Wearable" : "Collectible";
    const typedName = isWearable
      ? (name as BumpkinItem)
      : (name as InventoryItemName);

    gameAnalytics.trackSink({
      currency: "Easter Token 2025",
      amount: item.cost.price,
      item: typedName,
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

    gameService.send("minigameItem.bought", {
      id: "easter-eggstravaganza",
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
      return t("rewardShop.wearable");
    }

    return t("rewardShop.collectible");
  };

  const getButtonLabel = () => {
    if (confirmBuy) return `${t("confirm")} ${t("buy")}`;

    return `${t("buy")} ${isWearable ? "wearable" : "collectible"}`;
  };

  const max = MINIGAME_SHOP_ITEMS[item?.name as EventShopItemName]?.max ?? 0;

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
                      !isWearable
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
                  </div>
                  <div className="flex flex-col space-y-2">
                    {!!buff && (
                      <div className="flex content-start flex-col sm:flex-row sm:flex-wrap gap-2">
                        {buff.map(
                          (
                            {
                              labelType,
                              boostTypeIcon,
                              boostedItemIcon,
                              shortDescription,
                            },
                            index,
                          ) => (
                            <Label
                              key={index}
                              type={labelType}
                              icon={boostTypeIcon}
                              secondaryIcon={boostedItemIcon}
                            >
                              {shortDescription}
                            </Label>
                          ),
                        )}
                      </div>
                    )}
                    <span className="text-xs leading-none">{description}</span>

                    {max && max < 1000 && (
                      <Label type="default">{t("maxPerPerson", { max })}</Label>
                    )}

                    {item && (
                      <div className="flex flex-1 items-end">
                        {/* Easter Token 2025 */}
                        <RequirementLabel
                          type={"item"}
                          item={"Easter Token 2025"}
                          balance={easterTokenBalance}
                          requirement={
                            new Decimal(item.cost.price ?? new Decimal(0))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {!readonly && (
            <>
              {!showSuccess && (
                <div
                  className={classNames("flex w-full", {
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
        </>
      )}
    </InnerPanel>
  );
};
