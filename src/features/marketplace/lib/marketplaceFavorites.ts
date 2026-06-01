import { useCallback, useEffect, useMemo, useState } from "react";

import type { CollectionName } from "features/game/types/marketplace";
import { readLocalStorageJSON, writeLocalStorageJSON } from "lib/localStorage";

export type MarketplaceFavoriteItem = {
  collection: CollectionName;
  id: number;
  economy?: string;
};

const STORAGE_VERSION = 1;

type MarketplaceFavoritesStorage = {
  version: typeof STORAGE_VERSION;
  items: MarketplaceFavoriteItem[];
};

const memoryFavorites: Record<string, MarketplaceFavoriteItem[]> = {};

function getStorageKey(farmId: number) {
  const host = typeof window === "undefined" ? "unknown" : window.location.host;

  return `marketplace.favorites.${host}.${farmId}`;
}

export function getMarketplaceFavoriteKey(item: MarketplaceFavoriteItem) {
  return `${item.collection}:${item.economy ?? ""}:${item.id}`;
}

function readMarketplaceFavorites(farmId: number): MarketplaceFavoriteItem[] {
  const key = getStorageKey(farmId);
  const value = readLocalStorageJSON<MarketplaceFavoritesStorage | string[]>(
    key,
  );

  if (!value) return memoryFavorites[key] ?? [];

  if (Array.isArray(value)) {
    return value.reduce<MarketplaceFavoriteItem[]>((items, key) => {
      const [collection, economy, id] = key.split(":");

      if (!collection || !id) return items;

      const favorite: MarketplaceFavoriteItem = {
        collection: collection as CollectionName,
        id: Number(id),
      };

      if (economy) {
        favorite.economy = economy;
      }

      if (Number.isFinite(favorite.id)) {
        items.push(favorite);
      }

      return items;
    }, []);
  }

  return value.items ?? [];
}

function writeMarketplaceFavorites(
  farmId: number,
  items: MarketplaceFavoriteItem[],
) {
  const key = getStorageKey(farmId);
  memoryFavorites[key] = items;
  writeLocalStorageJSON(key, {
    version: STORAGE_VERSION,
    items,
  });
}

export function useMarketplaceFavorites(farmId: number) {
  const [items, setItems] = useState<MarketplaceFavoriteItem[]>(() =>
    readMarketplaceFavorites(farmId),
  );

  useEffect(() => {
    setItems(readMarketplaceFavorites(farmId));
  }, [farmId]);

  const favoriteKeys = useMemo(
    () => new Set(items.map(getMarketplaceFavoriteKey)),
    [items],
  );

  const isFavorite = useCallback(
    (item: MarketplaceFavoriteItem) =>
      favoriteKeys.has(getMarketplaceFavoriteKey(item)),
    [favoriteKeys],
  );

  const toggleFavorite = useCallback(
    (item: MarketplaceFavoriteItem) => {
      setItems((current) => {
        const key = getMarketplaceFavoriteKey(item);
        const exists = current.some(
          (favorite) => getMarketplaceFavoriteKey(favorite) === key,
        );
        const next = exists
          ? current.filter(
              (favorite) => getMarketplaceFavoriteKey(favorite) !== key,
            )
          : [...current, item];

        writeMarketplaceFavorites(farmId, next);
        return next;
      });
    },
    [farmId],
  );

  return {
    favoriteKeys,
    favorites: items,
    isFavorite,
    toggleFavorite,
  };
}
