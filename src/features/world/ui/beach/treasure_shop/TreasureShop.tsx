import React, { SyntheticEvent, useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TreasureShopBuy } from "./TreasureShopBuy";
import { TreasureShopSell } from "./TreasureShopSell";
import { SUNNYSIDE } from "assets/sunnyside";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { TreasureShopCraft } from "./TreasureShopCraft";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const TreasureShop: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.jafar}
      tabs={[
        { icon: ITEM_DETAILS["Sand Shovel"].image, name: t("tools") },
        { icon: SUNNYSIDE.icons.hammer, name: t("craft") },
        { icon: ITEM_DETAILS["Pirate Bounty"].image, name: t("sell") },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === 0 && <TreasureShopBuy onClose={onClose} />}
      {tab === 1 && <TreasureShopCraft />}
      {tab === 2 && <TreasureShopSell />}
    </CloseButtonPanel>
  );
};
