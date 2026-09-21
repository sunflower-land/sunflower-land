import React, { useState } from "react";
import type { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import type { ConversationName } from "features/game/types/announcements";
import { NPC_WEARABLES } from "lib/npcs";
import { OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SeasonalSeeds } from "./SeasonalSeeds";
import { SeasonalCrops } from "./SeasonalCrops";
import book from "assets/icons/tier1_book.webp";
import { CropGuide } from "./CropGuide";

interface Props {
  onClose: () => void;
  conversation?: ConversationName;
  hasSoldBefore?: boolean;
  showBuyHelper?: boolean;
  showSellHelper?: boolean;
  showBuyTabHelper?: boolean;
  cropShortage?: boolean;
}

export const ShopItems: React.FC<Props> = ({
  onClose,
  hasSoldBefore,
  showBuyHelper,
  showSellHelper,
  showBuyTabHelper,
}) => {
  type Tab = "buy" | "sell" | "guide";
  // Open a new player straight onto the Sell tab for their first Sunflowers,
  // the way the Workbench opens onto the scarecrow. The market modal unmounts
  // when closed, so this default re-evaluates on every open.
  const [tab, setTab] = useState<Tab>(showSellHelper ? "sell" : "buy");
  const { t } = useAppTranslation();
  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.betty;

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      tabs={[
        {
          id: "buy",
          icon: SUNNYSIDE.icons.seeds,
          name: t("buy"),
          unread: showBuyHelper,
          helper: showBuyTabHelper,
        },
        {
          id: "sell",
          icon: CROP_LIFECYCLE["Basic Biome"].Sunflower.crop,
          name: t("sell"),
          unread: !hasSoldBefore,
        },
        {
          id: "guide",
          icon: book,
          name: t("guide"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
    >
      {tab === "buy" && <SeasonalSeeds />}
      {tab === "sell" && <SeasonalCrops />}
      {tab === "guide" && <CropGuide />}
    </CloseButtonPanel>
  );
};
