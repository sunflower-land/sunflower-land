import React, { useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import type { EconomyExchange } from "features/game/types/marketplace";

import { ExchangeModal } from "./ExchangeModal";

const PREVIEW_COUNT = 3;

type Props = {
  exchanges: EconomyExchange[];
};

/**
 * Left-column rewards widget.
 *
 * Shows a small preview (up to {@link PREVIEW_COUNT}) of the exchanges the
 * player can currently redeem — icon + "Nx item" + "N reward". Clicking the
 * "Exchange" action in the header opens the full {@link ExchangeModal}.
 *
 * A ✓ tick is rendered in place of the reward line when an exchange has
 * already been claimed.
 */
export const RewardsWidget: React.FC<Props> = ({ exchanges }) => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);

  const preview = exchanges.slice(0, PREVIEW_COUNT);

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <Label type="warning">{t("economyHub.rewards")}</Label>
        </div>

        {preview.length === 0 ? (
          <p className="text-xs p-1 text-brown-700">
            {t("economyHub.noExchanges")}
          </p>
        ) : (
          <div className="flex flex-col gap-1 p-1">
            {preview.map((exchange) => (
              <ExchangePreviewRow key={exchange.id} exchange={exchange} />
            ))}
          </div>
        )}

        <div className="flex justify-end mt-1">
          <p
            className="text-xs underline cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            {t("economyHub.exchange")}
          </p>
        </div>
      </InnerPanel>

      {showModal && (
        <ExchangeModal
          onClose={() => setShowModal(false)}
          exchanges={exchanges}
        />
      )}
    </>
  );
};

type RowProps = {
  exchange: EconomyExchange;
};

/**
 * A compact, non-interactive preview row for the widget.
 *
 *  [ icon ]  5x Chicken Eggs
 *            3 Marks           ✓  (if claimed)
 */
const ExchangePreviewRow: React.FC<RowProps> = ({ exchange }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center flex-none"
        style={{
          width: `${PIXEL_SCALE * 12}px`,
          height: `${PIXEL_SCALE * 12}px`,
        }}
      >
        {exchange.itemImage ? (
          <img
            src={exchange.itemImage}
            alt=""
            className="object-contain"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              imageRendering: "pixelated",
            }}
          />
        ) : (
          <div className="w-full h-full bg-brown-200 rounded-sm" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs truncate leading-tight">
          {t("economyHub.exchangeItemCount", {
            count: exchange.itemAmount,
            item: exchange.itemName,
          })}
        </p>
        <p className="text-xxs text-brown-700 truncate leading-tight">
          {t("economyHub.exchangeRewardCount", {
            count: exchange.rewardAmount,
            reward: exchange.rewardName,
          })}
        </p>
      </div>

      {exchange.claimed && (
        <img
          src={SUNNYSIDE.icons.confirm}
          alt=""
          className="object-contain flex-none"
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            height: `${PIXEL_SCALE * 8}px`,
          }}
        />
      )}
    </div>
  );
};
