import React from "react";
import trade from "assets/icons/trade.png";
import { Label } from "components/ui/Label";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

/**
 * Shown instead of the claim UI when the player has a pending withdrawal
 * transaction, since claiming marketplace sales is blocked until that
 * transaction is submitted or expires.
 */
export const PendingTransactionClaimNotice: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <div className="p-1">
      <Label className="ml-2 mb-2 mt-1" type="danger" icon={trade}>
        {t("marketplace.claimBlockedByTransaction.label")}
      </Label>
      <div className="mb-2 ml-1">
        <InlineDialogue
          message={t("marketplace.claimBlockedByTransaction.message")}
        />
      </div>
      <Button onClick={onClose}>{t("gotIt")}</Button>
    </div>
  );
};
