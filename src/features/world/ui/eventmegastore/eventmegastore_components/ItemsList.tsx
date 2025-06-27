import React, { useContext } from "react";
// import { getItemBuffLabel, getItemImage } from "../MegaStore";
import { getItemImage, getItemBuffLabel } from "../EventStore";
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
import { InventoryItemName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  COLORS_EVENT_ITEMS,
  EventStoreCollectible,
  EventStoreItem,
  EventStoreTier,
  EventStoreWearable,
} from "features/game/types/festivalOfColors";
import { SUNNYSIDE } from "assets/sunnyside";
import { ResizableBar } from "components/ui/ProgressBar";
import { SFLDiscount } from "features/game/lib/SFLDiscount";

interface Props {
  itemsLabel?: string;
  type?: "wearables" | "collectibles" | "keys";
  tier: EventStoreTier;
  items: EventStoreItem[];
  onItemClick: (item: EventStoreItem, tier: EventStoreTier) => void;
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

  const getBalanceOfItem = (item: EventStoreItem): number => {
    // Handling all types or specific ones if provided
    if (type === "wearables" || (!type && "wearable" in item)) {
      return (
        state.minigames.games["festival-of-colors-2025"]?.shop?.wearables?.[
          (item as EventStoreWearable).wearable as BumpkinItem
        ] ?? 0
      );
    } else if (type === "collectibles" || (!type && "collectible" in item)) {
      return (
        state.minigames.games["festival-of-colors-2025"]?.shop?.wearables?.[
          (item as EventStoreCollectible).collectible as BumpkinItem
        ] ?? 0
      );
    } else if (type === "keys" || (!type && "key" in item)) {
      return (
        state.minigames.games["festival-of-colors-2025"]?.shop?.items?.[
          (item as EventStoreCollectible).collectible as InventoryItemName
        ] ?? 0
      );
    }

    return 0;
  };

  const getItemName = (item: EventStoreItem): string => {
    if (type === "wearables" || (!type && "wearable" in item)) {
      return (item as EventStoreWearable).wearable as BumpkinItem;
    } else if (type === "collectibles" || (!type && "collectible" in item)) {
      return (item as EventStoreCollectible).collectible as InventoryItemName;
    } else if (type === "keys" || (!type && "key" in item)) {
      return (item as EventStoreCollectible).collectible as InventoryItemName;
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

  const getCurrencyIcon = (item: EventStoreItem) => {
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

  const getCurrency = (item: EventStoreItem) => {
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
  const createdAt = Date.now();
  const currentSeason = getCurrentSeason(new Date(createdAt));
  const eventStore = COLORS_EVENT_ITEMS;
  const tiers = tier;

  // Type guard if the requirement exists
  const hasRequirement = (
    tier: any,
  ): tier is { items: EventStoreItem[]; requirement: number } => {
    return "requirement" in tier;
  };

  const tierData = COLORS_EVENT_ITEMS[tier];
  const requirements = hasRequirement(tierData) ? tierData.requirement : 0;

  const eventItemsCrafted =
    Object.keys(
      state.minigames.games["festival-of-colors-2025"]?.shop?.items ?? {},
    ).length +
    Object.keys(
      state.minigames.games["festival-of-colors-2025"]?.shop?.wearables ?? {},
    ).length;

  const isRareUnlocked = tier === "rare" && eventItemsCrafted;
  const isEpicUnlocked = tier === "epic" && eventItemsCrafted;
  const isMegaUnlocked = tier === "mega" && eventItemsCrafted;

  const tierpercentage = eventItemsCrafted;

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
