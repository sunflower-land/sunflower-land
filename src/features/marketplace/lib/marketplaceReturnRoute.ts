import type { MarketplaceNavigationState } from "./navigation";

const isMarketplaceRoute = (path?: string) =>
  path ? /(^|\/)marketplace(?:\/|$)/.test(path) : false;

export const getMarketplaceReturnRoute = ({
  pathname,
  navigation,
  fromRoute,
}: {
  pathname: string;
  navigation?: MarketplaceNavigationState;
  fromRoute?: string;
}) => {
  const defaultRoute = pathname.includes("/world") ? "/world/plaza" : "/";

  return (
    navigation?.returnTo ??
    (isMarketplaceRoute(fromRoute) ? undefined : fromRoute) ??
    defaultRoute
  );
};
