import React, { useContext, useLayoutEffect, useMemo, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { InventoryItemName, Keys } from "features/game/types/game";

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
import {
  getCurrentChapter,
  getChapterTicket,
  CHAPTERS,
} from "features/game/types/chapters";
import confetti from "canvas-confetti";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
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
  isBoughtWithinCurrentChapter,
  isKeyBoughtWithinChapter,
} from "features/game/events/landExpansion/buyChapterItem";
import { REWARD_BOXES } from "features/game/types/rewardBoxes";
import { secondsToString } from "lib/utils/time";
import {
  WEARABLE_RELEASES,
  getInventoryReleases,
} from "features/game/types/withdrawables";

import lockIcon from "assets/icons/lock.png";

interface ItemOverlayProps {
  item: ChapterStoreItem;
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
const _state = (state: MachineState) => state.context.state;

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
  const state = useSelector(gameService, _state);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState<boolean>(false);

  const now = useNow();
  const currentChapter = getCurrentChapter(now);
  const chapterTicket = getChapterTicket(now);
  const seasonalStore = MEGASTORE[currentChapter];
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

  const seasonalCollectiblesCrafted = getChapterItemsCrafted(
    state,
    seasonalStore,
    "collectible",
    tiers,
    true,
  );
  const seasonalWearablesCrafted = getChapterItemsCrafted(
    state,
    seasonalStore,
    "wearable",
    tiers,
    true,
  );
  const seasonalItemsCrafted =
    seasonalCollectiblesCrafted + seasonalWearablesCrafted;

  const itemName = isWearable
    ? (item as ChapterStoreWearable)?.wearable
    : (item as ChapterStoreCollectible)?.collectible;

  const isKey = (name: InventoryItemName): name is Keys =>
    name in ARTEFACT_SHOP_KEYS;

  const reduction = isKeyBoughtWithinChapter(state, tiers, now, true) ? 0 : 1;
  const isRareUnlocked =
    tiers === "rare" &&
    seasonalItemsCrafted - reduction >= seasonalStore.rare.requirement;
  const isEpicUnlocked =
    tiers === "epic" &&
    seasonalItemsCrafted - reduction >= seasonalStore.epic.requirement;
  const isMegaUnlocked =
    tier === "mega" &&
    seasonalItemsCrafted - reduction >= seasonalStore.mega.requirement;

  const boughtAt = state.megastore?.boughtAt[itemName] ?? 0;
  const itemInCooldown = !!boughtAt && boughtAt + (item?.cooldownMs ?? 0) > now;

  const itemCrafted = state.farmActivity[`${itemName} Bought`];

  // Check if Pet Egg was already bought this chapter
  const petEggBoughtAt = state.megastore?.boughtAt["Pet Egg"];
  const petEggPurchaseCount = state.farmActivity["Pet Egg Bought"] ?? 0;

  const isPetEggBoughtThisChapter = useMemo(() => {
    if (itemName !== "Pet Egg") return false;

    // Primary check: boughtAt timestamp is within current chapter
    if (isBoughtWithinCurrentChapter(petEggBoughtAt, now)) {
      return true;
    }

    // Fallback for legacy data: if farmActivity shows a purchase but boughtAt is missing,
    // and we're in the chapter where Pet Egg was introduced, treat conservatively
    if (!petEggBoughtAt && petEggPurchaseCount > 0) {
      const petEggChapter = CHAPTERS["Paw Prints"];
      const nowDate = new Date(now);
      const isInPetEggChapter =
        nowDate >= petEggChapter.startDate && nowDate <= petEggChapter.endDate;

      if (isInPetEggChapter) {
        return true;
      }
    }

    return false;
  }, [itemName, petEggBoughtAt, petEggPurchaseCount, now]);

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

    // Pet Egg: one per chapter limit
    if (isPetEggBoughtThisChapter) {
      return false;
    }

    if (item.cooldownMs) {
      if (itemInCooldown) return false;
    }

    if (tier !== "basic") {
      if (tier === "rare" && !isRareUnlocked) return false;
      if (tier === "epic" && !isEpicUnlocked) return false;
      if (tier === "mega" && !isMegaUnlocked) return false;
    }

    // For non-cooldown items (except keys and Pet Egg), check if already crafted
    if (
      !item.cooldownMs &&
      !isKey(itemName as InventoryItemName) &&
      itemName !== "Pet Egg"
    ) {
      if (itemCrafted) {
        return false;
      }
    }

    if (itemReq) {
      const hasRequirements = getKeys(itemReq).every((name) => {
        const amount = itemReq[name] || new Decimal(0);
        const count = inventory[name] || new Decimal(0);
        return count.gte(amount);
      });
      if (!hasRequirements) return false;
    }

    return sflBalance.greaterThanOrEqualTo(
      SFLDiscount(state, new Decimal(sfl)),
    );
  };

  const trackAnalytics = () => {
    if (!item) return;
    const type = isWearable ? "Wearable" : "Collectible";
    const currency =
      item.cost.sfl !== 0
        ? "SFL"
        : item.cost.sfl === 0 && (item.cost?.items[chapterTicket] ?? 0 > 0)
          ? "Seasonal Ticket"
          : "SFL";
    const price =
      item.cost.sfl !== 0
        ? sfl
        : item.cost.sfl === 0 && (item.cost?.items[chapterTicket] ?? 0 > 0)
          ? (item.cost?.items[chapterTicket] ?? 0)
          : sfl;
    const itemName = isWearable
      ? (item as ChapterStoreWearable).wearable
      : (item as ChapterStoreCollectible).collectible;

    gameAnalytics.trackSink({
      currency,
      amount: price,
      item: itemName,
      type,
    });

    if (!isWearable) {
      const itemName = (item as ChapterStoreCollectible).collectible;
      const count = inventory[itemName]?.toNumber() ?? 1;
      gameAnalytics.trackMilestone({
        event: `Crafting:Collectible:${itemName}${count}`,
      });
    }
  };
  const { t } = useAppTranslation();
  const handleBuy = () => {
    if (!item || !itemName) return;

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

    if (itemName && itemName in REWARD_BOXES) {
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
      return t("megaStore.wearable");
    }

    return t("megaStore.collectible");
  };

  const getButtonLabel = () => {
    if (confirmBuy) return `${t("confirm")} ${t("buy")}`; //t

    return `${t("buy")} ${isWearable ? "wearable" : "collectible"}`;
  };

  const inventoryReleases = getInventoryReleases(now, state);
  const isTradeable = isWearable
    ? !!WEARABLE_RELEASES[(item as ChapterStoreWearable)?.wearable]
    : !!inventoryReleases[(item as ChapterStoreCollectible)?.collectible];

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
                    {description && (
                      <span className="text-xs leading-none">
                        {description}
                      </span>
                    )}
                    {itemName === "Pet Egg" ? (
                      <Label
                        type={isPetEggBoughtThisChapter ? "danger" : "default"}
                        className="text-xxs"
                      >
                        {isPetEggBoughtThisChapter
                          ? t("season.megastore.crafting.limit", { limit: 1 })
                          : t("season.megastore.crafting.limit", { limit: 0 })}
                      </Label>
                    ) : itemName && item?.cooldownMs ? (
                      <Label
                        type={itemInCooldown ? "danger" : "default"}
                        className="text-xxs"
                      >
                        {t("megastore.limit", {
                          time: secondsToString(
                            itemInCooldown
                              ? (item.cooldownMs - (now - boughtAt)) / 1000
                              : item.cooldownMs / 1000,
                            {
                              length: "short",
                            },
                          ),
                        })}
                      </Label>
                    ) : (
                      <Label
                        type={!itemCrafted ? "default" : "danger"}
                        className="text-xxs"
                      >
                        {t("season.megastore.crafting.limit", {
                          limit: !itemCrafted ? 0 : 1,
                        })}
                      </Label>
                    )}
                    {!isTradeable && (
                      <Label
                        type="formula"
                        icon={lockIcon}
                        className="text-xxs"
                      >
                        {t("season.megastore.nonTradeable")}
                      </Label>
                    )}
                    {itemReq && (
                      <div className="flex flex-1 content-start flex-col flex-wrap gap-1">
                        {getKeys(itemReq).map((itemName, index) => {
                          return (
                            <RequirementLabel
                              key={index}
                              type="item"
                              item={itemName}
                              showLabel
                              balance={inventory[itemName] ?? new Decimal(0)}
                              requirement={new Decimal(itemReq[itemName] ?? 0)}
                            />
                          );
                        })}
                      </div>
                    )}
                    {item && sfl !== 0 && (
                      <div className="flex flex-1 items-end">
                        {/* FLOWER */}
                        <RequirementLabel
                          type="sfl"
                          balance={sflBalance}
                          requirement={SFLDiscount(
                            state,
                            new Decimal(item.cost.sfl),
                          )}
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

                  <Button
                    disabled={!canBuy() || (itemName && !!itemInCooldown)}
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
