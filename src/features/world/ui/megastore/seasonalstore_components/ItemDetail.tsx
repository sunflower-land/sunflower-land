import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { InventoryItemName, Keys } from "features/game/types/game";

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
  getCurrentSeason,
  getSeasonalArtefact,
  getSeasonalTicket,
  // getSeasonalTicket,
} from "features/game/types/seasons";
import confetti from "canvas-confetti";
import { BumpkinItem } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  MEGASTORE,
  SeasonalStoreCollectible,
  SeasonalStoreItem,
  SeasonalStoreWearable,
} from "features/game/types/megastore";
import { getItemDescription } from "../SeasonalStore";
import { getKeys } from "features/game/types/craftables";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import {
  getSeasonalItemsCrafted,
  isKeyBoughtWithinSeason,
} from "features/game/events/landExpansion/buySeasonalItem";

interface ItemOverlayProps {
  item: SeasonalStoreItem | null;
  image: string;
  isWearable: boolean;
  buff?: BuffLabel;
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
  const currentSeason = getCurrentSeason(new Date(createdAt));
  const seasonalStore = MEGASTORE[currentSeason];
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

  const seasonalCollectiblesCrafted = getSeasonalItemsCrafted(
    state,
    "inventory",
    seasonalStore,
    "collectible",
    tiers,
    true,
  );
  const seasonalWearablesCrafted = getSeasonalItemsCrafted(
    state,
    "wardrobe",
    seasonalStore,
    "wearable",
    tiers,
    true,
  );
  const seasonalItemsCrafted =
    seasonalCollectiblesCrafted + seasonalWearablesCrafted;

  const itemName = item
    ? isWearable
      ? (item as SeasonalStoreWearable).wearable
      : (item as SeasonalStoreCollectible).collectible
    : undefined;

  const isKey = (name: InventoryItemName): name is Keys =>
    name in ARTEFACT_SHOP_KEYS;

  const reduction = isKeyBoughtWithinSeason(state, tiers, true) ? 0 : 1;
  const isRareUnlocked =
    tiers === "rare" &&
    seasonalItemsCrafted - reduction >= seasonalStore.rare.requirement;
  const isEpicUnlocked =
    tiers === "epic" &&
    seasonalItemsCrafted - reduction >= seasonalStore.epic.requirement;
  const isMegaUnlocked =
    tier === "mega" &&
    seasonalItemsCrafted - reduction >= seasonalStore.mega.requirement;

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
    if (item) return sflBalance.greaterThanOrEqualTo(new Decimal(sfl));
  };

  const trackAnalytics = () => {
    if (!item) return;
    const type = isWearable ? "Wearable" : "Collectible";
    const currency =
      item.cost.sfl !== 0
        ? "SFL"
        : item.cost.sfl === 0 &&
            (item.cost?.items[getSeasonalTicket()] ?? 0 > 0)
          ? "Seasonal Ticket"
          : "SFL";
    const price =
      item.cost.sfl !== 0
        ? sfl
        : item.cost.sfl === 0 &&
            (item.cost?.items[getSeasonalTicket()] ?? 0 > 0)
          ? item.cost?.items[getSeasonalTicket()] ?? 0
          : sfl;
    const itemName = isWearable
      ? ((item as SeasonalStoreWearable).wearable as BumpkinItem)
      : ((item as SeasonalStoreCollectible).collectible as InventoryItemName);

    gameAnalytics.trackSink({
      currency,
      amount: price,
      item: itemName,
      type,
    });

    if (!isWearable) {
      const itemName = (item as SeasonalStoreCollectible)
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

    gameService.send("seasonalItem.bought", {
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

  const getCurrencyName = (item: SeasonalStoreItem) => {
    const currencyName =
      item.cost.sfl === 0 && (item.cost?.items[getSeasonalTicket()] ?? 0 > 0)
        ? getSeasonalTicket()
        : item.cost.sfl === 0 &&
            (item.cost?.items[getSeasonalArtefact()] ?? 0 > 0)
          ? getSeasonalArtefact()
          : Object.keys(item.cost.items)[0];
    return currencyName as InventoryItemName;
  };
  const getCurrencyBalance = (item: SeasonalStoreItem) => {
    const currencyItem =
      item.cost.sfl === 0 && (item.cost?.items[getSeasonalTicket()] ?? 0 > 0)
        ? getSeasonalTicket()
        : item.cost.sfl === 0 &&
            (item.cost?.items[getSeasonalArtefact()] ?? 0 > 0)
          ? getSeasonalArtefact()
          : Object.keys(item.cost.items)[0];

    return inventory[currencyItem as InventoryItemName] ?? new Decimal(0);
  };
  const getCurrency = (item: SeasonalStoreItem) => {
    const currency =
      item.cost.sfl === 0 && (item.cost?.items[getSeasonalTicket()] ?? 0 > 0)
        ? getSeasonalTicket()
        : getSeasonalArtefact();
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
                        <Label
                          type={buff.labelType}
                          icon={buff.boostTypeIcon}
                          secondaryIcon={buff.boostedItemIcon}
                        >
                          {buff.shortDescription}
                        </Label>
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
