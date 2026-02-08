import { ColorPanel } from "components/ui/Panel";
import React from "react";

import marketplaceIcon from "assets/icons/trade.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ChapterMarketplaceWidget = () => {
  const { t } = useAppTranslation();
  return (
    <ColorPanel type="chill" className="flex p-1">
      <img src={marketplaceIcon} className="h-10 mr-2" />
      <p className="text-xs">{t("chapterDashboard.marketplaceDescription")}</p>
    </ColorPanel>
  );
};
