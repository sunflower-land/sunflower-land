import React from "react";
import trade from "assets/icons/trade.png";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { Box } from "components/ui/Box";
import token from "assets/icons/flower_token.webp";
import { formatNumber } from "lib/utils/formatNumber";
import { Button } from "components/ui/Button";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { PendingTransactionClaimNotice } from "../PendingTransactionClaimNotice";

interface ClaimPurchaseProps {
  /** Listing price; the trading fee (if passed) is deducted from it. */
  sfl: number;
  /** Trading fee taken from `sfl` on claim (see `claimPurchase`). Omit when
   * `sfl` is already the amount received. */
  tax?: number;
  onClaim: () => void;
  onClose: () => void;
  hasPendingTransaction?: boolean;
}

export const ClaimPurchase: React.FC<ClaimPurchaseProps> = ({
  sfl,
  tax = 0,
  onClaim,
  onClose,
  hasPendingTransaction,
}) => {
  const { t } = useAppTranslation();

  if (hasPendingTransaction) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES["hammerin harry"]}>
        <PendingTransactionClaimNotice onClose={onClose} />
      </Panel>
    );
  }

  return (
    <Panel bumpkinParts={NPC_WEARABLES["hammerin harry"]}>
      <div className="p-1">
        <Label className="ml-2 mb-2 mt-1" type="default" icon={trade}>
          {t("marketplace.itemSold")}
        </Label>
        <div className="mb-2 ml-1">
          <InlineDialogue message={t("marketplace.congratulationsItemSold")} />
        </div>
        <div className="flex items-center">
          <Box image={token} />
          <div>
            {/* What actually lands in the balance: the price minus the fee. */}
            <Label type="warning">
              {`${formatNumber(sfl - tax, { decimalPlaces: 4 })} FLOWER`}
            </Label>
            {tax > 0 && (
              <p className="text-xxs mt-0.5">
                {t("marketplace.afterTradingFee", {
                  fee: formatNumber(tax, { decimalPlaces: 4 }),
                })}
              </p>
            )}
            <p className="text-xs mt-0.5">{t("reward.spendWisely")}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("close")}</Button>
        <Button onClick={onClaim}>{t("claim")}</Button>
      </div>
    </Panel>
  );
};
