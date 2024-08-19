import React from "react";
import tradeIcon from "assets/icons/trade.png";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const PriceHistory: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="mb-1">
      <div className="p-2">
        <Label icon={tradeIcon} type="default">
          {t("marketplace.priceHistory")}
        </Label>
        <div className="h-32" />
      </div>
    </InnerPanel>
  );
};
