import React from "react";
import { CloseButtonPanel } from "../../CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import choreIcon from "assets/icons/chores.webp";
import promoteIcon from "assets/icons/promote.webp";
export const LoveRush: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["rocket man"]}
      onClose={onClose}
    >
      <div className="p-1">
        <Label type="info" className="mb-1" icon={SUNNYSIDE.icons.stopwatch}>
          {t("loveRush.dateRange")}
        </Label>
        <p className="text-xs mb-2">{t("loveRush.description")}</p>
        <NoticeboardItems
          items={[
            {
              text: t("loveRush.deliveries"),
              icon: SUNNYSIDE.icons.player,
            },
            {
              text: t("loveRush.chores"),
              icon: choreIcon,
            },
            {
              text: t("loveRush.giftFlowers"),
              icon: ITEM_DETAILS["Red Clover"].image,
            },
            {
              text: t("loveRush.dailyStreak"),
              icon: SUNNYSIDE.icons.happy,
            },
            {
              text: t("loveRush.treasureChest"),
              icon: SUNNYSIDE.decorations.treasure_chest,
            },
            {
              text: t("loveRush.referral"),
              icon: promoteIcon,
            },
          ]}
        />
      </div>
      <Button
        onClick={() =>
          window.open(
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20/love-rush-earn-flower",
            "_blank",
          )
        }
      >
        {t("read.more")}
      </Button>
    </CloseButtonPanel>
  );
};
