import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import type { Inventory, InventoryItemName } from "features/game/types/game";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import type { BuffLabel } from "features/game/types";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { gameAnalytics } from "lib/gameAnalytics";
import type { MachineState } from "features/game/lib/gameMachine";
import confetti from "canvas-confetti";
import type { BumpkinItem } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getItemDescription } from "../FloatingIslandShop";
import {
  isDisplayableRewardBoxName,
  isRewardBoxName,
  type RewardBoxName,
} from "features/game/types/rewardBoxes";
import type { FloatingShopItem } from "features/game/types/floatingIsland";
import { getKeys } from "lib/object";
import { ChestRewardsList } from "components/ui/ChestRewardsList";

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

const ItemDetailItemRequirements: React.FC<{
  item: FloatingShopItem | null;
  inventory: Inventory;
}> = ({ item, inventory }) => {
  if (!item) return null;

  return (
    <div className="flex flex-1 items-end">
      {getKeys(item.cost.items).map((name) => {
        return (
          <RequirementLabel
            key={name}
            type={"item"}
            item={name}
            balance={inventory[name] ?? new Decimal(0)}
            requirement={new Decimal(item.cost.items[name] ?? 0)}
          />
        );
      })}
    </div>
  );
};

const ItemDetailBuyActions: React.FC<{
  showSuccess: boolean;
  confirmBuy: boolean;
  isBought?: boolean;
  canBuy: boolean;
  buttonLabel: string;
  successCopy: string;
  onCancel: () => void;
  onBuy: () => void;
  onClose: () => void;
}> = ({
  showSuccess,
  confirmBuy,
  isBought,
  canBuy,
  buttonLabel,
  successCopy,
  onCancel,
  onBuy,
  onClose,
}) => {
  const { t } = useAppTranslation();

  if (showSuccess) {
    return (
      <div className="flex flex-col space-y-1">
        <span className="p-2 text-xs">{successCopy}</span>
        <Button onClick={onClose}>{t("ok")}</Button>
      </div>
    );
  }

  return (
    <div
      className={classNames("flex w-full", {
        "space-x-1": confirmBuy,
      })}
    >
      {confirmBuy && <Button onClick={onCancel}>{t("cancel")}</Button>}

      {!isBought && (
        <Button disabled={!canBuy} onClick={onBuy}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

const RewardBoxPreview: React.FC<{
  rewardBoxName: RewardBoxName;
  image: string;
  imageWidth: number;
  itemName: string;
  description: string;
}> = ({ rewardBoxName, image, imageWidth, itemName, description }) => {
  const { t } = useAppTranslation();
  const [showRewards, setShowRewards] = useState<boolean>(false);
  const rewardsListId = `love-reward-box-rewards-${rewardBoxName
    .replace(/\W+/g, "-")
    .toLowerCase()}`;

  if (showRewards) {
    return (
      <button
        type="button"
        aria-expanded={showRewards}
        aria-controls={rewardsListId}
        className="max-h-[150px] overflow-y-auto scrollable pr-1 cursor-pointer text-left text-current w-full bg-transparent pl-0 py-0 border-0"
        onClick={() => setShowRewards(false)}
      >
        <div id={rewardsListId}>
          <ChestRewardsList
            type={rewardBoxName}
            showDescription={false}
            isFirstInMultiList
          />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={showRewards}
      aria-controls={rewardsListId}
      className="flex items-center space-x-2 cursor-pointer text-left text-current w-full bg-transparent p-0 border-0"
      onClick={() => setShowRewards(true)}
    >
      <div
        className="relative rounded-md overflow-hidden shadow-md flex justify-center items-center shrink-0"
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          height: `${PIXEL_SCALE * 24}px`,
          backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={image}
          alt={itemName}
          style={{
            width: `${Math.min(imageWidth, PIXEL_SCALE * 20)}px`,
          }}
        />
      </div>
      <span className="text-xs leading-none flex-1">{description}</span>
      <Label type="default" className="shrink-0">
        {t("rewards")}
      </Label>
    </button>
  );
};

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
  const rewardBoxName =
    item && !isWearable && isDisplayableRewardBoxName(item.name)
      ? item.name
      : undefined;
  const displayedImageWidth = isWearable ? PIXEL_SCALE * 50 : imageWidth;

  useLayoutEffect(() => {
    if (isWearable) return;

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

    gameService.send("floatingShopItem.bought", {
      name: item.name,
    });

    if (!isWearable) {
      shortcutItem(item.name as InventoryItemName);
    }

    if (showAnimations) confetti();
    trackAnalytics();

    setShowSuccess(true);
    setConfirmBuy(false);

    if (isRewardBoxName(item.name)) {
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
    if (confirmBuy) {
      return isWearable
        ? t("confirmBuy.wearable")
        : t("confirmBuy.collectible");
    }

    return isWearable ? t("buy.wearable") : t("buy.collectible");
  };
  const buyActions = (
    <ItemDetailBuyActions
      showSuccess={showSuccess}
      confirmBuy={confirmBuy}
      isBought={isBought}
      canBuy={!!canBuy()}
      buttonLabel={getButtonLabel()}
      successCopy={getSuccessCopy()}
      onCancel={() => setConfirmBuy(false)}
      onBuy={buttonHandler}
      onClose={onClose}
    />
  );

  if (rewardBoxName) {
    return (
      <InnerPanel className="shadow">
        {isVisible && (
          <>
            <div className="flex flex-col space-y-2">
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
                <div className="w-full p-2 px-1 space-y-2">
                  <RewardBoxPreview
                    key={rewardBoxName}
                    rewardBoxName={rewardBoxName}
                    image={image}
                    imageWidth={imageWidth}
                    itemName={item?.name ?? rewardBoxName}
                    description={description}
                  />

                  <ItemDetailItemRequirements
                    item={item}
                    inventory={inventory}
                  />
                </div>
              )}
            </div>

            {buyActions}
          </>
        )}
      </InnerPanel>
    );
  }

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
                        width: `${displayedImageWidth}px`,
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

                    <ItemDetailItemRequirements
                      item={item}
                      inventory={inventory}
                    />
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
          {buyActions}
        </>
      )}
    </InnerPanel>
  );
};
