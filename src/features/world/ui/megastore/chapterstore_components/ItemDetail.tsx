import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { Currency, InventoryItemName, Keys } from "features/game/types/game";

import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { BuffLabel } from "features/game/types";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { gameAnalytics } from "lib/gameAnalytics";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getCurrentChapter,
  getChapterArtefact,
  getChapterTicket,
  // getChapterTicket,
} from "features/game/types/chapters";
import confetti from "canvas-confetti";
import { BumpkinItem } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  MEGASTORE,
  ChapterStoreCollectible,
  ChapterStoreItem,
  ChapterStoreWearable,
} from "features/game/types/megastore";
import { getItemDescription } from "../ChapterStore";
import { getKeys } from "features/game/types/craftables";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import {
  getChapterItemsCrafted,
  isKeyBoughtWithinChapter,
} from "features/game/events/landExpansion/buyChapterItem";

interface ItemOverlayProps {
  item: ChapterStoreItem | null;
  image: string;
  isWearable: boolean;
  buff?: BuffLabel[];
  tier?: "basic" | "rare" | "epic" | "mega";
  isVisible: boolean;
  onClose: () => void;
  readonly?: boolean;
}

const _sflBalance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _keysBought = (state: MachineState) =>
  state.context.state.pumpkinPlaza.keysBought;

export const ItemDetail: React.FC<ItemOverlayProps> = ({
  item,
  tier,
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
  const keysBought = useSelector(gameService, _keysBought);

  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState<boolean>(false);
  //For Discount
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const createdAt = Date.now();
  const currentChapter = getCurrentChapter(new Date(createdAt));
  const chapterStore = MEGASTORE[currentChapter];
  const tiers =
    tier === "basic"
      ? "basic"
      : tier === "rare"
        ? "rare"
        : tier === "epic"
          ? "epic"
          : tier === "mega"
            ? "mega"
            : "basic";

  const chapterCollectiblesCrafted = getChapterItemsCrafted(
    state,
    chapterStore,
    "collectible",
    tiers,
    true,
  );
  const chapterWearablesCrafted = getChapterItemsCrafted(
    state,
    chapterStore,
    "wearable",
    tiers,
    true,
  );
  const chapterItemsCrafted =
    chapterCollectiblesCrafted + chapterWearablesCrafted;

  const itemName = item
    ? isWearable
      ? (item as ChapterStoreWearable).wearable
      : (item as ChapterStoreCollectible).collectible
    : undefined;

  const isKey = (name: InventoryItemName): name is Keys =>
    name in ARTEFACT_SHOP_KEYS;

  const reduction = isKeyBoughtWithinChapter(state, tiers, true) ? 0 : 1;
  const isRareUnlocked =
    tiers === "rare" &&
    chapterItemsCrafted - reduction >= chapterStore.rare.requirement;
  const isEpicUnlocked =
    tiers === "epic" &&
    chapterItemsCrafted - reduction >= chapterStore.epic.requirement;
  const isMegaUnlocked =
    tiers === "mega" &&
    chapterItemsCrafted - reduction >= chapterStore.mega.requirement;

  const keysBoughtAt = keysBought?.megastore[itemName as Keys]?.boughtAt;
  const keysBoughtToday =
    !!keysBoughtAt &&
    new Date(keysBoughtAt).toISOString().slice(0, 10) ===
      new Date().toISOString().slice(0, 10);

  const keysAmountBoughtToday = keysBoughtToday ? 1 : 0;

  const description = getItemDescription(item);
  const { sfl = 0 } = item?.cost || {};
  const itemReq = item?.cost?.items;

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

  const canBuy = () => {
    if (!item) return false;

    if (keysBoughtToday) return false;

    if (tier !== "basic") {
      if (tier === "rare" && !isRareUnlocked) return false;
      if (tier === "epic" && !isEpicUnlocked) return false;
      if (tier === "mega" && !isMegaUnlocked) return false;
    }
    if (itemReq) {
      const hasRequirements = getKeys(itemReq).every((name) => {
        const amount = itemReq[name] || new Decimal(0);

        const count = inventory[name] || new Decimal(0);

        return count.gte(amount);
      });
      if (!hasRequirements) return false;
    }
    if (item)
      return sflBalance.greaterThanOrEqualTo(
        SFLDiscount(state, new Decimal(sfl)),
      );
  };

  const trackAnalytics = () => {
    if (!item) return;
    const type = isWearable ? "Wearable" : "Collectible";
    const currency: Currency =
      item.cost.sfl !== 0
        ? "SFL"
        : item.cost.sfl === 0 && (item.cost?.items[getChapterTicket()] ?? 0 > 0)
          ? "Chapter Ticket"
          : "SFL";
    const price =
      item.cost.sfl !== 0
        ? sfl
        : item.cost.sfl === 0 && (item.cost?.items[getChapterTicket()] ?? 0 > 0)
          ? item.cost?.items[getChapterTicket()] ?? 0
          : sfl;
    const itemName = isWearable
      ? ((item as ChapterStoreWearable).wearable as BumpkinItem)
      : ((item as ChapterStoreCollectible).collectible as InventoryItemName);

    gameAnalytics.trackSink({
      currency,
      amount: price,
      item: itemName,
      type,
    });

    if (!isWearable) {
      const itemName = (item as ChapterStoreCollectible)
        .collectible as InventoryItemName;
      const count = inventory[itemName]?.toNumber() ?? 1;
      gameAnalytics.trackMilestone({
        event: `Crafting:Collectible:${itemName}${count}`,
      });
    }
  };
  const { t } = useAppTranslation();
  const handleBuy = () => {
    if (!item) return;

    gameService.send("chapterItem.bought", {
      name: itemName,
      tier: tiers,
    });

    if (!isWearable) {
      shortcutItem(itemName as InventoryItemName);
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

  const getButtonLabel = () => {
    if (confirmBuy) return `${t("confirm")} ${t("buy")}`; //t

    return `${t("buy")} ${isWearable ? "wearable" : "collectible"}`;
  };

  const getCurrencyName = (item: ChapterStoreItem) => {
    const currencyName =
      item.cost.sfl === 0 && (item.cost?.items[getChapterTicket()] ?? 0 > 0)
        ? getChapterTicket()
        : item.cost.sfl === 0 &&
            (item.cost?.items[getChapterArtefact()] ?? 0 > 0)
          ? getChapterArtefact()
          : Object.keys(item.cost.items)[0];
    return currencyName as InventoryItemName;
  };
  const getCurrencyBalance = (item: ChapterStoreItem) => {
    const currencyItem =
      item.cost.sfl === 0 && (item.cost?.items[getChapterTicket()] ?? 0 > 0)
        ? getChapterTicket()
        : item.cost.sfl === 0 &&
            (item.cost?.items[getChapterArtefact()] ?? 0 > 0)
          ? getChapterArtefact()
          : Object.keys(item.cost.items)[0];

    return inventory[currencyItem as InventoryItemName] ?? new Decimal(0);
  };
  const getCurrency = (item: ChapterStoreItem) => {
    const currency =
      item.cost.sfl === 0 && (item.cost?.items[getChapterTicket()] ?? 0 > 0)
        ? getChapterTicket()
        : getChapterArtefact();
    const currencyItem =
      item.cost.sfl === 0 && (item.cost?.items[currency] ?? 0 > 0)
        ? item.cost?.items[currency]
        : item.cost?.items[
            Object.keys(item.cost.items)[0] as InventoryItemName
          ];

    return currencyItem;
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
                      alt={itemName}
                      className={"w-full"}
                      style={{
                        width: `${imageWidth}px`,
                      }}
                    />

                    {itemName && isKey(itemName as Keys) && (
                      <Label
                        type={keysBoughtToday ? "danger" : "default"}
                        className="absolute bottom-1 right-1 text-xxs"
                      >
                        {t("keys.dailyLimit", { keysAmountBoughtToday })}
                      </Label>
                    )}
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

                    {itemReq &&
                      (sfl !== 0 ? (
                        <div className="flex flex-1 content-start flex-col flex-wrap">
                          {getKeys(itemReq).map((itemName, index) => {
                            return (
                              <RequirementLabel
                                key={index}
                                type="item"
                                item={itemName}
                                showLabel
                                balance={inventory[itemName] ?? new Decimal(0)}
                                requirement={
                                  new Decimal(itemReq[itemName] ?? 0)
                                }
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-1 content-start flex-col flex-wrap">
                          {getKeys(itemReq)
                            .slice(1)
                            .map((itemName, index) => {
                              return (
                                <RequirementLabel
                                  key={index}
                                  type="item"
                                  item={itemName}
                                  showLabel
                                  balance={
                                    inventory[itemName] ?? new Decimal(0)
                                  }
                                  requirement={
                                    new Decimal(itemReq[itemName] ?? 0)
                                  }
                                />
                              );
                            })}
                        </div>
                      ))}
                    {item &&
                      (sfl !== 0 ? (
                        <div className="flex flex-1 items-end">
                          {/* SFL */}
                          <RequirementLabel
                            type="sfl"
                            balance={sflBalance}
                            requirement={SFLDiscount(
                              state,
                              new Decimal(item.cost.sfl),
                            )}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-1 items-end">
                          {/* Ticket/Artefact/Item */}
                          <RequirementLabel
                            type={"item"}
                            item={getCurrencyName(item)}
                            balance={getCurrencyBalance(item)}
                            requirement={
                              new Decimal(getCurrency(item) ?? new Decimal(0))
                            }
                          />
                        </div>
                      ))}
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

                  <Button
                    disabled={
                      !canBuy() ||
                      (itemName &&
                        isKey(itemName as InventoryItemName) &&
                        !!keysBoughtToday)
                    }
                    onClick={buttonHandler}
                  >
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
