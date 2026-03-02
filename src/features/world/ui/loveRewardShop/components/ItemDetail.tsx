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
import { getItemDescription } from "../FloatingIslandShop";
import { REWARD_BOXES } from "features/game/types/rewardBoxes";
import { FloatingShopItem } from "features/game/types/floatingIsland";
import { getKeys } from "features/game/types/decorations";

interface ItemOverlayProps {
  item: FloatingShopItem | null;
  image: string;
  isWearable: boolean;
  buff?: BuffLabel[];
  isVisible: boolean;
  onClose: () => void;
  readonly?: boolean;
  isBought?: boolean;
}

const _inventory = (state: MachineState) => state.context.state.inventory;

export const ItemDetail: React.FC<ItemOverlayProps> = ({
  item,
  image,
  buff,
  isWearable,
  isVisible,
  onClose,
  isBought,
}) => {
  const { shortcutItem, gameService, showAnimations } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState<boolean>(false);

  const description = getItemDescription(item);

  useLayoutEffect(() => {
    if (isWearable) {
      // Valid use case here as we are reading the width of the image
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const canBuy = () => {
    if (!item) return false;

    if (item) {
      return getKeys(item.cost.items).every((name) => {
        return inventory[name]?.greaterThanOrEqualTo(
          item.cost.items[name] ?? 0,
        );
      });
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
      currency: "Love Charm",
      amount: item.cost.items["Love Charm"] ?? 0,
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

    gameService.send({ type: "floatingShopItem.bought", name: item.name });

    if (!isWearable) {
      shortcutItem(item.name as InventoryItemName);
    }

    if (showAnimations) confetti();
    trackAnalytics();

    setShowSuccess(true);
    setConfirmBuy(false);

    if (item.name in REWARD_BOXES) {
      onClose();
    }
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

                    {item && (
                      <div className="flex flex-1 items-end">
                        {getKeys(item.cost.items).map((name) => {
                          return (
                            <RequirementLabel
                              key={name}
                              type={"item"}
                              item={name}
                              balance={inventory[name] ?? new Decimal(0)}
                              requirement={
                                new Decimal(item.cost.items[name] ?? 0)
                              }
                            />
                          );
                        })}
                      </div>
                    )}
                    {item?.name === "Pet Egg" && (
                      <Label type={isBought ? "danger" : "warning"}>
                        {`Limit: ${isBought ? "1" : "0"}/1`}
                      </Label>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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

                {!isBought && (
                  <Button disabled={!canBuy()} onClick={buttonHandler}>
                    {getButtonLabel()}
                  </Button>
                )}
              </div>
            )}
            {showSuccess && (
              <div className="flex flex-col space-y-1">
                <span className="p-2 text-xs">{getSuccessCopy()}</span>
                <Button onClick={onClose}>{t("ok")}</Button>
              </div>
            )}
          </>
        </>
      )}
    </InnerPanel>
  );
};
