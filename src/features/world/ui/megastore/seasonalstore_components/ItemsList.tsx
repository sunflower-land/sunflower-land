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
  getSeasonalArtefact,
  getSeasonalTicket,
} from "features/game/types/seasons";

import token from "assets/icons/flower_token.webp";
import lightning from "assets/icons/lightning.png";
import lock from "assets/icons/lock.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName, Keys } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  MEGASTORE,
  SeasonalStoreCollectible,
  SeasonalStoreItem,
  SeasonalStoreTier,
  SeasonalStoreWearable,
  SeasonalTierItemName,
} from "features/game/types/megastore";
import { SUNNYSIDE } from "assets/sunnyside";
import { ResizableBar } from "components/ui/ProgressBar";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import {
  FLOWER_BOXES,
  FlowerBox,
  getSeasonalItemsCrafted,
  getStore,
  isBoxBoughtWithinSeason,
  isKeyBoughtWithinSeason,
  isPetEggBoughtWithinSeason,
} from "features/game/events/landExpansion/buySeasonalItem";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";

interface Props {
  itemsLabel?: string;
  type?: "wearables" | "collectibles" | "keys";
  tier: SeasonalStoreTier;
  items: SeasonalStoreItem[];
  onItemClick: (item: SeasonalStoreItem, tier: SeasonalStoreTier) => void;
}

export const ItemsList: React.FC<Props> = ({
  items,
  type,
  tier,
  itemsLabel,
  onItemClick,
}) => {
  const { gameService } = useContext(Context);

  //For Discount
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const getBalanceOfItem = (item: SeasonalStoreItem): number => {
    // Handling all types or specific ones if provided
    if (type === "wearables" || (!type && "wearable" in item)) {
      return (
        state.farmActivity[
          `${(item as SeasonalStoreWearable).wearable as SeasonalTierItemName} Bought`
        ] ?? 0
      );
    } else if (type === "collectibles" || (!type && "collectible" in item)) {
      return (
        state.farmActivity[
          `${(item as SeasonalStoreCollectible).collectible as SeasonalTierItemName} Bought`
        ] ?? 0
      );
    } else if (type === "keys" || (!type && "key" in item)) {
      return (
        state.farmActivity[
          `${(item as SeasonalStoreCollectible).collectible as SeasonalTierItemName} Bought`
        ] ?? 0
      );
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

  const getCurrencyIcon = (item: SeasonalStoreItem) => {
    if (item.cost.sfl !== 0) return token;

    const currencyItem =
      item.cost.sfl === 0 && (item.cost?.items[getSeasonalTicket()] ?? 0 > 0)
        ? getSeasonalTicket()
        : item.cost.sfl === 0 &&
            (item.cost?.items[getSeasonalArtefact()] ?? 0 > 0)
          ? getSeasonalArtefact()
          : Object.keys(item.cost.items)[0];

    return ITEM_DETAILS[currencyItem as InventoryItemName].image;
  };

  const getCurrency = (item: SeasonalStoreItem) => {
    if (item.cost.sfl !== 0)
      return shortenCount(SFLDiscount(state, new Decimal(item.cost.sfl)));

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
  const currentSeason = getCurrentSeason();
  const seasonalStore = MEGASTORE[currentSeason];
  const tiers = tier;

  const seasonalCollectiblesCrafted = getSeasonalItemsCrafted(
    state,
    seasonalStore,
    "collectible",
    tier,
    true,
  );
  const seasonalWearablesCrafted = getSeasonalItemsCrafted(
    state,
    seasonalStore,
    "wearable",
    tier,
    true,
  );
  const seasonalItemsCrafted =
    seasonalCollectiblesCrafted + seasonalWearablesCrafted;

  // Type guard if the requirement exists
  const hasRequirement = (
    tier: any,
  ): tier is { items: SeasonalStoreItem[]; requirement: number } => {
    return "requirement" in tier;
  };

  const tierData = getStore(seasonalStore, tier);

  const isKey = (name: InventoryItemName): name is Keys =>
    name in ARTEFACT_SHOP_KEYS;

  const isFlowerBox = (name: InventoryItemName): name is FlowerBox =>
    name in FLOWER_BOXES;

  // For Current Tier Key - Unlocked(0) / Locked(1)
  const isKeyCounted = isKeyBoughtWithinSeason(state, tiers) ? 0 : 1;
  // For Current Tier Box - Unlocked(0) / Locked(1)
  const isBoxCounted = isBoxBoughtWithinSeason(state, tiers) ? 0 : 1;

  // Reduction is by getting the lower tier of current tier
  const keyReduction = isKeyBoughtWithinSeason(state, tiers, true) ? 0 : 1; // Reduction is by getting the lower tier of current tier
  const boxReduction = isBoxBoughtWithinSeason(state, tiers, true) ? 0 : 1; // Reduction is by getting the lower tier of current tier
  const petEggReduction = isPetEggBoughtWithinSeason(state, tiers, true)
    ? 0
    : 1;
  const reduction = keyReduction + boxReduction + petEggReduction;

  const requirements = hasRequirement(tierData) ? tierData.requirement : 0;

  const isRareUnlocked =
    tier === "rare" && seasonalItemsCrafted - reduction >= requirements;
  const isEpicUnlocked =
    tier === "epic" && seasonalItemsCrafted - reduction >= requirements;
  const isMegaUnlocked =
    tier === "mega" && seasonalItemsCrafted - reduction >= requirements;
  const tierpercentage = seasonalItemsCrafted - reduction;

  const percentage = Math.round((tierpercentage / requirements) * 100);

  const sortedItems = filteredItems
    .slice()
    .sort((a, b) =>
      Number((getCurrency(a) as number) - (getCurrency(b) as number)),
    );
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col mb-5">
      {itemsLabel && (
        <div className="flex z-10">
          <div className="grow w-9/10 mb-1">
            {itemsLabel && (
              <Label
                iconWidth={10}
                icon={
                  !isRareUnlocked && tier === "rare"
                    ? lock
                    : !isEpicUnlocked && tier === "epic"
                      ? lock
                      : !isMegaUnlocked && tier === "mega"
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
                        : tier === "mega" && isMegaUnlocked
                          ? "warning"
                          : "danger"
                }
              >
                {itemsLabel}
              </Label>
            )}
          </div>
          <div className="w-1/10">
            {(tier === "rare" || tier === "epic" || tier === "mega") && (
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
      {tier === "rare" && !isRareUnlocked && (
        <span className="text-xs py-1">
          {t("megaStore.tier.rare.requirements", {
            requirements: requirements - tierpercentage,
            tier: tier,
          })}
        </span>
      )}

      {tier === "epic" && !isEpicUnlocked && (
        <span className="text-xs py-1">
          {t("megaStore.tier.epic.requirements", {
            requirements: requirements - tierpercentage,
            tier: tier,
          })}
        </span>
      )}

      {tier === "mega" && !isMegaUnlocked && (
        <span className="text-xs py-1">
          {t("megaStore.tier.mega.requirements", {
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
            const buff = getItemBuffLabel(item, state);
            const isItemKey = isKey(
              getItemName(item) as unknown as InventoryItemName,
            );
            const isItemFlowerBox = isFlowerBox(
              getItemName(item) as unknown as InventoryItemName,
            );

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
                  <div className="flex justify-center items-center w-full h-full z-20">
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
                    {/* Confirm Icon for non-key items */}
                    {balanceOfItem > 0 &&
                      !isItemKey &&
                      !isItemFlowerBox &&
                      (tier === "basic" ||
                        (tier === "rare" && isRareUnlocked) ||
                        (tier === "epic" && isEpicUnlocked) ||
                        (tier === "mega" && isMegaUnlocked)) && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="absolute -right-2 -top-3"
                          style={{
                            width: `${PIXEL_SCALE * 9}px`,
                          }}
                          alt="crop"
                        />
                      )}

                    {/* Confirm Icon for key items */}
                    {isItemKey &&
                      !isItemFlowerBox &&
                      isKeyCounted === 0 &&
                      (tier === "basic" ||
                        (tier === "rare" && isRareUnlocked) ||
                        (tier === "epic" && isEpicUnlocked) ||
                        (tier === "mega" && isMegaUnlocked)) && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="absolute -right-2 -top-3"
                          style={{
                            width: `${PIXEL_SCALE * 9}px`,
                          }}
                          alt="crop"
                        />
                      )}

                    {/* Confirm Icon for Flower Box items */}
                    {isItemFlowerBox &&
                      !isItemKey &&
                      isBoxCounted === 0 &&
                      (tier === "basic" ||
                        (tier === "rare" && isRareUnlocked) ||
                        (tier === "epic" && isEpicUnlocked) ||
                        (tier === "mega" && isMegaUnlocked)) && (
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
                      (tier === "epic" && !isEpicUnlocked) ||
                      (tier === "mega" && !isMegaUnlocked)) && (
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
                        icon={getCurrencyIcon(item)}
                        type="warning"
                        className={"text-xxs absolute center text-center p-1 "}
                        style={{
                          width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                          height: "24px",
                        }}
                      >
                        {getCurrency(item)}
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
