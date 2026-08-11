import { useActor } from "@xstate/react";
import { useContext, useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import * as Auth from "features/auth/lib/Provider";
import type { Marketplace } from "features/game/types/marketplace";
import { CONFIG } from "lib/config";
import { loadMarketplace } from "../actions/loadMarketplace";
import type { MarketplaceItemTarget } from "./navigation";

export type MarketplaceTradeableFilter =
  | "collectibles"
  | "wearables"
  | "resources"
  | "buds"
  | "pets"
  | "temporary";

const DEFAULT_FILTERS: MarketplaceTradeableFilter[] = [
  "collectibles",
  "resources",
];

export const isMarketplaceTradeable = (
  marketplace: Marketplace | undefined,
  target: MarketplaceItemTarget,
) =>
  marketplace?.items.some(
    (item) =>
      item.collection === target.collection &&
      item.id === target.id &&
      item.isActive,
  ) ?? false;

const fetcher = ([filters, token]: [string, string]) => {
  if (CONFIG.API_URL) return loadMarketplace({ filters, token });
};

/**
 * The API narrows results when multiple filters are sent in one request
 * (e.g. `utility,collectibles`), so each filter is fetched separately and
 * merged. The keys match the marketplace collection page so the cache is
 * shared.
 */
const useFilter = (
  filter: MarketplaceTradeableFilter,
  enabled: boolean,
  token: string | undefined,
) => useSWRImmutable(enabled && token ? [filter, token] : null, fetcher).data;

/** Provides a cached set of active marketplace items for the requested filters. */
export const useMarketplaceTradeables = ({
  filters = DEFAULT_FILTERS,
  enabled = true,
}: {
  filters?: readonly MarketplaceTradeableFilter[];
  enabled?: boolean;
} = {}) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const token = authState.context.user.rawToken as string | undefined;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Let the interface paint before starting the optional marketplace lookup.
    const id = window.setTimeout(() => setReady(true), 0);

    return () => window.clearTimeout(id);
  }, []);

  const isEnabled = (filter: MarketplaceTradeableFilter) =>
    ready && enabled && filters.includes(filter);

  const collectibles = useFilter(
    "collectibles",
    isEnabled("collectibles"),
    token,
  );
  const wearables = useFilter("wearables", isEnabled("wearables"), token);
  const resources = useFilter("resources", isEnabled("resources"), token);
  const buds = useFilter("buds", isEnabled("buds"), token);
  const pets = useFilter("pets", isEnabled("pets"), token);
  const temporary = useFilter("temporary", isEnabled("temporary"), token);

  const items = [
    collectibles,
    wearables,
    resources,
    buds,
    pets,
    temporary,
  ].flatMap((data) => data?.items ?? []);

  return {
    isTradeable: (target: MarketplaceItemTarget) =>
      isMarketplaceTradeable({ items }, target),
  };
};
