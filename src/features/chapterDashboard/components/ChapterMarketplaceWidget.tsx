import { ColorPanel } from "components/ui/Panel";
import React from "react";

import marketplaceIcon from "assets/icons/trade.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ChapterMarketplaceWidget = () => {
  const { t } = useAppTranslation();
  return (
    <ColorPanel type="chill" className="flex p-1 mb-2">
      <img src={marketplaceIcon} className="w-10 object-contain mr-2" />
      <p className="text-xs flex-1">
        {t("chapterDashboard.marketplaceDescription")}
      </p>
    </ColorPanel>
  );
};
