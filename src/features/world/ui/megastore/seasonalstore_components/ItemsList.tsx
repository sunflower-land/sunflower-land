import React, { useContext } from "react";
// import { getItemBuffLabel, getItemImage } from "../MegaStore";
import { getItemImage, getItemBuffLabel } from "../SeasonalStore";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { shortenCount } from "lib/utils/formatNumber";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";

import token from "assets/icons/sfl.webp";
import lightning from "assets/icons/lightning.png";
import lock from "assets/icons/lock.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { Currency, InventoryItemName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  MEGASTORE,
  SeasonalStoreCollectible,
  SeasonalStoreItem,
  SeasonalStoreWearable,
} from "features/game/types/megastore";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { ResizableBar } from "components/ui/ProgressBar";

interface Props {
  itemsLabel?: string;
  type?: "wearables" | "collectibles" | "keys";
  tier: "basic" | "rare" | "epic";
  items: SeasonalStoreItem[];
  onItemClick: (
    item: SeasonalStoreItem,
    tier: "basic" | "rare" | "epic",
  ) => void;
}

const _inventory = (state: MachineState) => state.context.state.inventory;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

export const ItemsList: React.FC<Props> = ({
  items,
  type,
  tier,
  itemsLabel,
  onItemClick,
}) => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const wardrobe = useSelector(gameService, _wardrobe);

  const getBalanceOfItem = (item: SeasonalStoreItem): number => {
    // Handling all types or specific ones if provided
    if (type === "wearables" || (!type && "wearable" in item)) {
      return (
        wardrobe[(item as SeasonalStoreWearable).wearable as BumpkinItem] ?? 0
      );
    } else if (type === "collectibles" || (!type && "collectible" in item)) {
      return (
        inventory[
          (item as SeasonalStoreCollectible).collectible as InventoryItemName
        ] ?? new Decimal(0)
      ).toNumber();
    } else if (type === "keys" || (!type && "key" in item)) {
      return (
        inventory[
          (item as SeasonalStoreCollectible).collectible as InventoryItemName
        ] ?? new Decimal(0)
      ).toNumber();
    }

    return 0;
  };

  const getItemName = (item: SeasonalStoreItem): string => {
    if (type === "wearables" || (!type && "wearable" in item)) {
      return (item as SeasonalStoreWearable).wearable as BumpkinItem;
    } else if (type === "collectibles" || (!type && "collectible" in item)) {
      return (item as SeasonalStoreCollectible)
        .collectible as InventoryItemName;
    } else if (type === "keys" || (!type && "key" in item)) {
      return (item as SeasonalStoreCollectible)
        .collectible as InventoryItemName;
    }

    return "";
  };

  const filteredItems = type
    ? items.filter((item) => {
        // Filter by type if provided
        if (type === "wearables" && "wearable" in item) return true;
        if (type === "collectibles" && "collectible" in item) return true;
        if (type === "keys" && "key" in item) return true;
        return false;
      })
    : items; // If no type provided, show all items

  const getCurrencyIcon = (currency: Currency) => {
    if (currency === "SFL") return token;

    const currencyItem =
      currency === "Seasonal Ticket" ? getSeasonalTicket() : currency;

    return ITEM_DETAILS[currencyItem as InventoryItemName].image;
  };
  const createdAt = Date.now();
  const currentSeason = getCurrentSeason(new Date(createdAt));
  const seasonalStore = MEGASTORE[currentSeason];
  const tiers =
    tier === "basic"
      ? "basic"
      : tier === "epic"
        ? "epic"
        : tier === "rare"
          ? "rare"
          : "basic";
  const tierItems =
    tiers === "basic"
      ? seasonalStore["basic"].items
      : tiers === "rare"
        ? seasonalStore["basic"].items
        : tiers === "epic"
          ? seasonalStore["rare"].items
          : seasonalStore["basic"].items;

  const seasonalCollectiblesCrafted = getKeys(inventory).filter((itemName) =>
    tierItems.some((items: SeasonalStoreItem) =>
      "collectible" in items ? items.collectible === itemName : false,
    ),
  ).length;
  const seasonalWearablesCrafted = getKeys(wardrobe).filter((itemName) =>
    tierItems.some((items: SeasonalStoreItem) =>
      "wearable" in items ? items.wearable === itemName : false,
    ),
  ).length;

  const seasonalItemsCrafted =
    seasonalCollectiblesCrafted + seasonalWearablesCrafted;

  const hasRequirement = (
    tier: any,
  ): tier is { items: SeasonalStoreItem[]; requirement: number } => {
    return "requirement" in tier;
  };

  const tierData = seasonalStore[tier];
  // Type guard if the requirement exists
  const requirements = hasRequirement(tierData) ? tierData.requirement : 0;
  const isRareUnlocked = seasonalItemsCrafted >= seasonalStore.rare.requirement;
  const isEpicUnlocked = seasonalItemsCrafted >= seasonalStore.epic.requirement;
  const tierpercentage = seasonalItemsCrafted;
  const percentage = Math.round((tierpercentage / requirements) * 100);

  const sortedItems = filteredItems
    .slice()
    .sort((a, b) => Number(a.cost.sfl - b.cost.sfl));
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col space-y-2">
      {itemsLabel && (
        <div className="flex -top-1 pb-1 z-10">
          <div className="grow w-9/10">
            {itemsLabel && (
              <Label
                iconWidth={10}
                icon={
                  !isRareUnlocked && tier === "rare"
                    ? lock
                    : !isEpicUnlocked && tier === "epic"
                      ? lock
                      : ""
                }
                type={
                  tier === "basic"
                    ? "default"
                    : tier === "rare" && isRareUnlocked
                      ? "info"
                      : tier === "epic" && isEpicUnlocked
                        ? "vibrant"
                        : "danger"
                }
              >
                {itemsLabel}
              </Label>
            )}
          </div>
          <div className="w-1/10">
            {(tier === "rare" || tier === "epic") && (
              <ResizableBar
                percentage={percentage}
                type={"progress"}
                outerDimensions={{
                  width: 24,
                  height: 7,
                }}
              />
            )}
          </div>
        </div>
      )}
      {tier !== "basic" &&
        ((tier === "rare" && !isRareUnlocked) ||
          (tier === "epic" && !isEpicUnlocked)) && (
          <span className="text-xs pb-2">
            {t("megaStore.tier.requirements", {
              requirements: requirements - tierpercentage,
              tier: tier,
            })}
          </span>
        )}

      <div className="flex gap-2 flex-wrap">
        {sortedItems.length === 0 ? (
          <span className="text-xxs">{`${itemsLabel} ${t(
            "coming.soon",
          )}.`}</span>
        ) : (
          sortedItems.map((item) => {
            const buff = getItemBuffLabel(item);
            const balanceOfItem = getBalanceOfItem(item);

            return (
              <div
                id={`mega-store-item-${getItemName(item)}`}
                key={getItemName(item)}
                className="flex flex-col space-y-1"
              >
                <div
                  className="bg-brown-600 cursor-pointer relative"
                  style={{
                    ...pixelDarkBorderStyle,
                  }}
                  onClick={() => onItemClick(item, tier)}
                >
                  <div className="flex relative justify-center items-center w-full h-full">
                    <SquareIcon icon={getItemImage(item)} width={20} />
                    {buff && (
                      <img
                        src={lightning}
                        className="absolute -left-2 -top-2 object-contain"
                        style={{
                          width: `${PIXEL_SCALE * 7}px`,
                        }}
                        alt="crop"
                      />
                    )}
                    {balanceOfItem > 0 &&
                      (tier === "basic" ||
                        (tier === "rare" && isRareUnlocked) ||
                        (tier === "epic" && isEpicUnlocked)) && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="absolute -right-2 -top-3"
                          style={{
                            width: `${PIXEL_SCALE * 9}px`,
                          }}
                          alt="crop"
                        />
                      )}

                    {((tier === "rare" && !isRareUnlocked) ||
                      (tier === "epic" && !isEpicUnlocked)) && (
                      <img
                        src={lock}
                        className="absolute -right-2 -top-2"
                        style={{
                          width: `${PIXEL_SCALE * 7}px`,
                        }}
                        alt="crop"
                      />
                    )}
                    {/* Price */}
                    <div className="absolute px-4 bottom-3 -left-4 object-contain">
                      <Label
                        icon={getCurrencyIcon("SFL")}
                        type="warning"
                        className={"text-xxs absolute center text-center p-1 "}
                        style={{
                          width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                          height: "24px",
                        }}
                      >
                        {shortenCount(item.cost.sfl)}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
