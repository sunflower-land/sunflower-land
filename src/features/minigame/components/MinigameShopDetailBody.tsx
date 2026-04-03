import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import type { PlayerEconomyConfig } from "../lib/types";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { capTokenDisplayName } from "../lib/extractProductionSlots";
import { secondsToString } from "lib/utils/time";
import { canAffordShopPriceLine } from "../lib/canAffordShopItem";
import { isShopItemPurchaseLimitedOut } from "../lib/minigameShopAvailability";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type ProductionPreview = {
  outputToken: string;
  amount: number;
  rateDenominatorMs: number;
};

type Props = {
  config: PlayerEconomyConfig;
  item: MinigameShopItemUi;
  shopProductionPreview: ProductionPreview | null;
  tokenImages: Record<string, string>;
  balances: Record<string, number>;
  shopActionError: string | null;
};

export const MinigameShopDetailBody: React.FC<Props> = ({
  config,
  item,
  shopProductionPreview,
  tokenImages,
  balances,
  shopActionError,
}) => {
  const { t } = useAppTranslation();
  const purchaseCapped = isShopItemPurchaseLimitedOut(item);
  return (
    <>
      <div
        className="mx-auto mb-2 flex items-center justify-center"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          maxHeight: `${PIXEL_SCALE * 28}px`,
        }}
      >
        <img
          src={item.listImage}
          alt=""
          className="max-h-full w-full object-contain"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <p className="mb-2 whitespace-pre-line text-xs">{item.description}</p>
      {shopProductionPreview && (
        <div
          className="mb-2 flex w-full min-w-0 flex-row flex-nowrap items-center justify-start gap-1.5 text-xs leading-tight"
          style={{ color: "#181425" }}
        >
          <img
            src={getMinigameTokenImage(
              shopProductionPreview.outputToken,
              tokenImages,
            )}
            alt=""
            className="h-4 w-4 shrink-0 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <span>
            {shopProductionPreview.amount}{" "}
            {capTokenDisplayName(shopProductionPreview.outputToken, config)}
            {" / "}
            {secondsToString(
              Math.max(
                0,
                Math.floor(shopProductionPreview.rateDenominatorMs / 1000),
              ),
              {
                length: "short",
                removeTrailingZeros: true,
              },
            )}
          </span>
        </div>
      )}
      <div className="mb-2 flex flex-col gap-1.5 text-xs">
        <span>{t("minigame.dashboard.priceLabel")}</span>
        <div className="flex flex-col gap-1">
          {item.prices.map((line) => {
            const lineOk =
              purchaseCapped || canAffordShopPriceLine(balances, line);
            return (
              <div
                key={line.token}
                className="flex flex-wrap items-center gap-2"
              >
                <span
                  className={classNames(
                    "tabular-nums font-medium",
                    !lineOk && "text-red-700",
                  )}
                >
                  {new Decimal(line.amount).toString()}{" "}
                  {capTokenDisplayName(line.token, config)}
                </span>
                <img
                  src={getMinigameTokenImage(line.token, tokenImages)}
                  alt=""
                  style={{
                    width: `${PIXEL_SCALE * 5}px`,
                    height: `${PIXEL_SCALE * 5}px`,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      {purchaseCapped && (
        <p className="mb-2 text-xs text-[#3e2731]">
          {t("minigame.dashboard.shopAlreadyPurchased")}
        </p>
      )}
      {shopActionError && (
        <p className="mb-2 text-xs text-red-700">{shopActionError}</p>
      )}
    </>
  );
};
