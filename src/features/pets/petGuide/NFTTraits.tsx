import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const NFTTraits: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="relative">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{t("petGuide.nftTraits.title")}</Label>
      </div>
      <p className="text-xs px-2 my-1">{t("petGuide.nftTraits.description")}</p>
      <NoticeboardItems
        items={[
          {
            text: t("petGuide.nftTraits.description2"),
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: t("petGuide.nftTraits.description3"),
            icon: SUNNYSIDE.icons.xpIcon,
          },
          {
            text: t("petGuide.nftTraits.description4"),
            icon: SUNNYSIDE.icons.wardrobe,
          },
          {
            text: t("petGuide.nftTraits.description5"),
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: t("petGuide.nftTraits.description6"),
            icon: SUNNYSIDE.icons.treasure,
          },
        ]}
      />
    </InnerPanel>
  );
};
