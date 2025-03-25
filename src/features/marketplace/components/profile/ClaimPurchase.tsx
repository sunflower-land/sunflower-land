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

interface ClaimPurchaseProps {
  sfl: number;
  onClaim: () => void;
  onClose: () => void;
}

export const ClaimPurchase: React.FC<ClaimPurchaseProps> = ({
  sfl,
  onClaim,
  onClose,
}) => {
  const { t } = useAppTranslation();
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
            <Label type="warning">
              {`${formatNumber(sfl, { decimalPlaces: 4 })} SFL`}
            </Label>
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
