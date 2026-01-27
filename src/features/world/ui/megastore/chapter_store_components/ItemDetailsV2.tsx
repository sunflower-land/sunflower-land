import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { MachineState } from "features/game/lib/gameMachine";
import confetti from "canvas-confetti";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import {
  ChapterStoreCollectible,
  ChapterStoreItem,
  ChapterStoreWearable,
  getItemDescription,
  isWearablesItem,
} from "../ChapterStoreV2";

interface ItemOverlayProps {
  item: ChapterStoreItem | null;
  itemId?: string;
  image: string;
  isWearable: boolean;
  buff?: BuffLabel[];
  isVisible: boolean;
  onClose: () => void;
  readonly?: boolean;
}

const _sflBalance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _state = (state: MachineState) => state.context.state;

export const ItemDetailsV2: React.FC<ItemOverlayProps> = ({
  item,
  itemId,
  image,
  buff,
  isWearable,
  isVisible,
  onClose,
  readonly,
}) => {
  const { shortcutItem, gameService, showAnimations } = useContext(Context);
  const sflBalance = useSelector(gameService, _sflBalance);
  const inventory = useSelector(gameService, _inventory);
  const state = useSelector(gameService, _state);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState<boolean>(false);
  const { t } = useAppTranslation();

  const itemName = item
    ? isWearable
      ? (item as ChapterStoreWearable).wearable
      : (item as ChapterStoreCollectible).collectible
    : undefined;
  const alreadyBought = !!(itemId && state.chapter?.boughtAt[itemId]);
  const description = getItemDescription(item);
  const itemReq = item?.cost.items ?? {};
  const sfl = item?.cost.sfl ?? 0;

  useEffect(() => {
    if (!isVisible) {
      setShowSuccess(false);
      setConfirmBuy(false);
    }
  }, [isVisible, itemId]);

  useLayoutEffect(() => {
    if (!item) return;

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
  }, [image, isWearable, item]);

  const canBuy = () => {
    console.log({ item, itemId, alreadyBought, chapter: state.chapter });
    if (!item || !itemId) return false;
    if (!state.chapter) return false;
    if (alreadyBought) return false;

    const hasItems = Object.entries(itemReq).every(([name, amount]) => {
      const required = new Decimal(amount ?? 0);
      const balance = inventory[name as InventoryItemName] ?? new Decimal(0);
      return balance.gte(required);
    });

    if (!hasItems) return false;

    const sflRequired = SFLDiscount(state, new Decimal(sfl));
    return sflBalance.greaterThanOrEqualTo(sflRequired);
  };

  const handleBuy = () => {
    if (!itemId) return;

    gameService.send("chapterStore.bought", { id: itemId });

    if (itemName && !isWearablesItem(item)) {
      shortcutItem(itemName as InventoryItemName);
    }

    if (showAnimations) confetti();
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
              <span className="flex-1 text-center">{itemName}</span>
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
                      alt={itemName ?? "Item"}
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

                    {alreadyBought && (
                      <Label type="success" className="text-xxs">
                        Bought
                      </Label>
                    )}

                    {Object.keys(itemReq).length > 0 && (
                      <div className="flex flex-1 content-start flex-col flex-wrap gap-1">
                        {Object.entries(itemReq).map(
                          ([name, amount], index) => {
                            return (
                              <RequirementLabel
                                key={index}
                                type="item"
                                item={name as InventoryItemName}
                                showLabel
                                balance={
                                  inventory[name as InventoryItemName] ??
                                  new Decimal(0)
                                }
                                requirement={new Decimal(amount ?? 0)}
                              />
                            );
                          },
                        )}
                      </div>
                    )}
                    {item && sfl > 0 && (
                      <div className="flex flex-1 items-end">
                        <RequirementLabel
                          type="sfl"
                          balance={sflBalance}
                          requirement={SFLDiscount(state, new Decimal(sfl))}
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
