import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import flowerIcon from "assets/icons/flower_token.webp";
import type { MinigameFlowerPurchaseItemUi } from "../lib/minigameDashboardTypes";
import Decimal from "decimal.js-light";
import { canAttemptFlowerPurchase } from "../lib/minigameShopAvailability";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { tokenDisplayName } from "../lib/minigameConfigHelpers";
import type { PlayerEconomyConfig } from "../lib/types";

type Props = {
  config: PlayerEconomyConfig;
  item: MinigameFlowerPurchaseItemUi;
  farmBalance: Decimal;
  shopActionError: string | null;
};

export const MinigameFlowerPurchaseDetailBody: React.FC<Props> = ({
  config,
  item,
  farmBalance,
  shopActionError,
}) => {
  const { t } = useAppTranslation();
  const canAfford = canAttemptFlowerPurchase(item.flower, farmBalance);

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
        <span>{t("minigame.dashboard.flowerCost")}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={classNames(
              "tabular-nums font-medium",
              !canAfford && "text-red-700",
            )}
          >
            {item.flower}
          </span>
          <img
            src={flowerIcon}
            alt=""
            style={{
              width: `${PIXEL_SCALE * 6}px`,
              height: `${PIXEL_SCALE * 6}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>
      </div>
      <div className="mb-2 flex flex-col gap-1 text-xs">
        <span>{t("minigame.dashboard.yourFlowerBalance")}</span>
        <span className="tabular-nums font-medium">
          {farmBalance.toFixed(4)}
        </span>
      </div>
      <div className="mb-2 flex flex-col gap-1 text-xs">
        <span>{t("minigame.dashboard.flowerReceive")}</span>
        <span className="font-medium">
          {item.economyAmount} {tokenDisplayName(config, item.tokenKey)}
        </span>
      </div>
      {shopActionError && (
        <p className="mb-2 text-xs text-red-700">{shopActionError}</p>
      )}
    </>
  );
};
