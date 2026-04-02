import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import useSWR from "swr";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { CONFIG } from "lib/config";
import { collectionFetcher } from "features/marketplace/components/Collection";
import type { Tradeable } from "features/game/types/marketplace";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { marketplaceMinigameItemPath } from "features/marketplace/lib/minigameTradePath";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  userToken?: string;
  marketplaceSlug: string;
  marketplaceItemId: number;
  marketplaceItemToken: string;
  tokenImages: Record<string, string>;
};

export const MinigameCurrencyWidget: React.FC<Props> = ({
  userToken,
  marketplaceSlug,
  marketplaceItemId,
  marketplaceItemToken,
  tokenImages,
}) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isWorldRoute = location.pathname.includes("/world");

  const swrKey =
    userToken &&
    CONFIG.API_URL &&
    typeof marketplaceItemId === "number" &&
    Number.isFinite(marketplaceItemId) &&
    marketplaceItemId >= 0
      ? (["economies", userToken] as [string, string])
      : null;

  const { data, isLoading, error } = useSWR(swrKey, collectionFetcher);

  const marketRow = useMemo(() => {
    const items = (data?.items ?? []) as Tradeable[];
    return items.find(
      (item) =>
        item.collection === "economies" &&
        item.economy === marketplaceSlug &&
        item.id === marketplaceItemId,
    ) as Extract<Tradeable, { collection: "economies" }> | undefined;
  }, [data?.items, marketplaceSlug, marketplaceItemId]);

  const openTrade = () => {
    const marketplaceBase = `${isWorldRoute ? "/world" : ""}/marketplace`;
    navigate(
      marketplaceMinigameItemPath(
        marketplaceBase,
        marketplaceSlug,
        marketplaceItemId,
      ),
    );
  };

  const showPriceLoading = Boolean(swrKey) && isLoading && !data && !error;

  const priceDisplay = `$${new Decimal(marketRow?.floor ?? 0).toFixed(4)}`;

  return (
    <InnerPanel className="rounded-sm p-1">
      <div className="flex items-center justify-between pr-1">
        <div className="flex min-h-[1.5rem] items-center gap-2">
          <img
            src={getMinigameTokenImage(marketplaceItemToken, tokenImages)}
            alt=""
            className="h-6 w-6 shrink-0 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <span className="inline-flex min-h-[1.25rem] min-w-[4.25rem] items-center">
            {showPriceLoading ? (
              <span
                className="h-3 w-[4rem] max-w-full rounded-sm bg-[#3e2731]/25 animate-pulse"
                aria-hidden
              />
            ) : (
              <span className="text-sm tabular-nums leading-none">
                {priceDisplay}
              </span>
            )}
          </span>
        </div>
      </div>
      <span
        role="button"
        tabIndex={0}
        className="block cursor-pointer select-none text-xxs italic underline"
        onClick={openTrade}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openTrade();
          }
        }}
      >
        {t("minigame.dashboard.buyOnMarketplace")}
      </span>
    </InnerPanel>
  );
};
