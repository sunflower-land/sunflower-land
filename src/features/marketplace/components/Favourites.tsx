import React, { useCallback, useContext } from "react";
import { useSelector } from "@xstate/react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { isTradeResource } from "features/game/actions/tradeLimits";
import type { MachineState } from "features/game/lib/gameMachine";
import type { InventoryItemName } from "features/game/types/game";
import type { Tradeable } from "features/game/types/marketplace";
import { SUNNYSIDE } from "assets/sunnyside";
import bwHeart from "assets/icons/bw_heart.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Collection } from "./Collection";
import type { TradeableDisplay } from "../lib/tradeables";
import {
  getMarketplaceFavoriteKey,
  useMarketplaceFavorites,
} from "../lib/marketplaceFavorites";

const FAVORITE_COLLECTION_FILTERS = [
  "resources",
  "collectibles",
  "wearables",
  "buds",
  "pets",
];

const _farmId = (state: MachineState) => state.context.farmId ?? 0;

const getFavoriteCategoryRank = (
  item: Tradeable,
  display: TradeableDisplay,
) => {
  const isResourceFavorite =
    item.collection === "collectibles" &&
    (isTradeResource(display.name as InventoryItemName) ||
      display.name === "CluckCoin");
  const isPowerUpFavorite =
    (item.collection === "collectibles" || item.collection === "wearables") &&
    display.buffs.length > 0 &&
    !isResourceFavorite;
  const isCosmeticFavorite =
    (item.collection === "collectibles" || item.collection === "wearables") &&
    display.buffs.length === 0 &&
    !isResourceFavorite;

  if (isResourceFavorite) return 0;
  if (item.expiresAt) return 1;
  if (isPowerUpFavorite) return 2;
  if (isCosmeticFavorite) return 3;
  if (item.collection === "buds") return 4;
  if (item.collection === "pets") return 5;

  return 6;
};

export const Favourites: React.FC<{ hideLimited?: boolean }> = ({
  hideLimited,
}) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const { favoriteKeys, favorites } = useMarketplaceFavorites(farmId);
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const isWorldRoute = useLocation().pathname.includes("/world");
  const filters = favorites.length
    ? [
        ...FAVORITE_COLLECTION_FILTERS,
        ...(!hideLimited ? ["temporary"] : []),
      ].join(",")
    : "";

  const filterFavorite = useCallback(
    (item: Tradeable) => {
      const key = getMarketplaceFavoriteKey({
        collection: item.collection,
        id: item.id,
        economy: item.collection === "economies" ? item.economy : undefined,
      });

      return favoriteKeys.has(key);
    },
    [favoriteKeys],
  );

  const sortFavorites = useCallback(
    (items: Tradeable[], getDisplay: (item: Tradeable) => TradeableDisplay) => {
      items.sort((a, b) => {
        const aDisplay = getDisplay(a);
        const bDisplay = getDisplay(b);
        const rankDifference =
          getFavoriteCategoryRank(a, aDisplay) -
          getFavoriteCategoryRank(b, bDisplay);

        if (rankDifference !== 0) return rankDifference;

        const nameDifference = (aDisplay.translatedName ?? aDisplay.name)
          .toLowerCase()
          .localeCompare(
            (bDisplay.translatedName ?? bDisplay.name).toLowerCase(),
          );

        return nameDifference || a.id - b.id;
      });
    },
    [],
  );

  const emptyState = (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-4 text-center">
      <img src={bwHeart} className="mb-2 h-10" alt="" />
      <p className="mb-1 text-sm">
        {favorites.length === 0
          ? t("marketplace.noFavorites")
          : t("marketplace.noFavoritesInCategories")}
      </p>
      <p className="mb-3 max-w-xs text-xs">
        {favorites.length === 0
          ? t("marketplace.noFavorites.description")
          : t("marketplace.noFavoritesInCategories.description")}
      </p>
      {favorites.length === 0 && (
        <Button
          onClick={() =>
            navigate(`${isWorldRoute ? "/world" : ""}/marketplace/hot`)
          }
        >
          {t("marketplace.browseMarketplace")}
        </Button>
      )}
    </div>
  );

  return (
    <Collection
      hideLimited={hideLimited}
      filtersOverride={filters}
      filterItem={filterFavorite}
      sortItems={sortFavorites}
      rowHeight={250}
      cardVariant="favorites"
      topContent={
        <div className="border-b border-brown-300 p-2">
          <div className="flex items-start gap-2">
            <img
              src={SUNNYSIDE.icons.heart}
              className="h-4 w-4 object-contain"
              alt=""
            />
            <p className="text-xs">{t("marketplace.favorites.beta")}</p>
          </div>
        </div>
      }
      emptyState={emptyState}
    />
  );
};
