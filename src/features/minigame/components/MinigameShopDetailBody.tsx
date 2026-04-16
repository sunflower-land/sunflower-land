import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import type { PlayerEconomyConfig } from "../lib/types";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { tokenDisplayName } from "../lib/minigameConfigHelpers";
import { canAffordShopPriceLine } from "../lib/canAffordShopItem";
import { isShopItemMaxCallsReached } from "../lib/minigameShopAvailability";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  config: PlayerEconomyConfig;
  item: MinigameShopItemUi;
  tokenImages: Record<string, string>;
  balances: Record<string, number>;
  shopActionError: string | null;
};

export const MinigameShopDetailBody: React.FC<Props> = ({
  config,
  item,
  tokenImages,
  balances,
  shopActionError,
}) => {
  const { t } = useAppTranslation();
  const purchaseCapped = isShopItemMaxCallsReached(item);
  const supplyBlocked = item.supplyBlocked === true;
  const actionBlocked = purchaseCapped || supplyBlocked;
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
      <div className="mb-2 flex flex-col gap-1.5 text-xs">
        <span>{t("minigame.dashboard.priceLabel")}</span>
        <div className="flex flex-col gap-1">
          {item.prices.map((line) => {
            const lineOk =
              actionBlocked || canAffordShopPriceLine(balances, line);
            return (
              <div
                key={line.token}
                className="flex flex-wrap items-center gap-2"
              >
                <span
                  className={classNames(
                    "tabular-nums font-medium",
                    !actionBlocked && !lineOk && "text-red-700",
                  )}
                >
                  {new Decimal(line.amount).toString()}{" "}
                  {tokenDisplayName(config, line.token)}
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
      {item.supplyRemainingMin !== undefined && (
        <p className="mb-2 text-xs text-[#3e2731]">
          {t("minigame.dashboard.supplyLeft", {
            count: item.supplyRemainingMin,
          })}
        </p>
      )}
      {purchaseCapped && (
        <p className="mb-2 text-xs text-[#3e2731]">
          {t("minigame.dashboard.shopAlreadyPurchased")}
        </p>
      )}
      {supplyBlocked && (
        <p className="mb-2 text-xs text-[#3e2731]">
          {t("minigame.dashboard.supplySoldOut")}
        </p>
      )}
      {shopActionError && (
        <p className="mb-2 text-xs text-red-700">{shopActionError}</p>
      )}
    </>
  );
};
