import { useActor } from "@xstate/react";
import { useContext } from "react";
import useSWRImmutable from "swr/immutable";
import * as Auth from "features/auth/lib/Provider";
import type { Marketplace } from "features/game/types/marketplace";
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
  const filterKey = [...new Set(filters)].sort().join(",");

  const { data } = useSWRImmutable(
    enabled && token ? ["marketplace-tradeables", filterKey, token] : null,
    ([, requestedFilters, authToken]: [string, string, string]) =>
      loadMarketplace({ filters: requestedFilters, token: authToken }),
  );

  return {
    isTradeable: (target: MarketplaceItemTarget) =>
      isMarketplaceTradeable(data, target),
  };
};
