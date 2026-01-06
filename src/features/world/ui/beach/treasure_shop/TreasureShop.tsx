import React, { SyntheticEvent, useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TreasureShopBuy } from "./TreasureShopBuy";
import { TreasureShopSell } from "./TreasureShopSell";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { PanelTabs } from "features/game/components/CloseablePanel";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const TreasureShop: React.FC<Props> = ({ onClose }) => {
  type Tab = "buy" | "sell";
  const [tab, setTab] = useState<Tab>("buy");
  const { t } = useAppTranslation();

  const buyTab: PanelTabs<Tab> = {
    id: "buy",
    icon: ITEM_DETAILS["Sand Shovel"].image,
    name: t("buy"),
  };
  const sellTab: PanelTabs<Tab> = {
    id: "sell",
    icon: ITEM_DETAILS["Pirate Bounty"].image,
    name: t("sell"),
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.jafar}
      tabs={[buyTab, sellTab]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === "buy" && <TreasureShopBuy />}
      {tab === "sell" && <TreasureShopSell />}
    </CloseButtonPanel>
  );
};
