import { useLocation, useNavigate } from "react-router";
import type { InventoryItemName } from "features/game/types/game";
import type { CollectionName } from "features/game/types/marketplace";

export type MarketplaceInterfaceRestore = {
  type: string;
};

export type InventoryMarketplaceRestore = MarketplaceInterfaceRestore & {
  type: "inventory";
  tab: "Basket" | "Chest";
  selectedItem?: InventoryItemName;
};

export type MarketplaceNavigationState = {
  returnTo: string;
  restore?: MarketplaceInterfaceRestore;
};

export type MarketplaceItemTarget = {
  collection: Exclude<CollectionName, "economies">;
  id: number;
};

type LocationState = {
  marketplaceNavigation?: MarketplaceNavigationState;
};

export const getMarketplaceNavigationState = (
  state: unknown,
): MarketplaceNavigationState | undefined =>
  (state as LocationState | null)?.marketplaceNavigation;

/**
 * Opens the marketplace while retaining the route and interface that should be
 * restored when it is closed. The state is intentionally navigation-only: a
 * refresh starts a fresh marketplace session rather than restoring a modal.
 */
export const useMarketplaceNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const openMarketplace = <TRestore extends MarketplaceInterfaceRestore>({
    item,
    restore,
  }: {
    item?: MarketplaceItemTarget;
    restore?: TRestore;
  } = {}) => {
    const marketplaceBase = location.pathname.includes("/world")
      ? "/world/marketplace"
      : "/marketplace";
    const marketplacePath = item
      ? `${marketplaceBase}/${item.collection}/${item.id}`
      : `${marketplaceBase}/hot`;

    navigate(marketplacePath, {
      state: {
        ...(item ? { route: `${marketplaceBase}/hot` } : {}),
        marketplaceNavigation: {
          returnTo: `${location.pathname}${location.search}`,
          restore,
        },
      } satisfies LocationState,
    });
  };

  return { openMarketplace };
};
