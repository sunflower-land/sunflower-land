import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import React from "react";
import flowerIcon from "assets/icons/flower_token.webp";
import giftIcon from "assets/icons/gift.png";
import chapterIcon from "assets/icons/chapter_icon_1.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const DashboardProposals: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <ButtonPanel
        className="mb-1 flex w-1/3"
        onClick={() =>
          window.open(
            "https://docs.sunflower-land.com/player-guides/chapters-whats-new/chapter-9-the-great-bloom",
            "_blank",
          )
        }
      >
        <img
          src={SUNNYSIDE.announcement.loveRush}
          className="my-1 rounded-sm w-16 mr-2"
        />
        <div>
          <div className="flex flex-wrap justify-between items-center mb-1">
            <span className="text-xs underline">{t("news.greatBloom")}</span>
          </div>

          <p className="text-xs px-1 text-ellipsis overflow-hidden">
            {t("news.greatBloom.description")}
          </p>
        </div>
      </ButtonPanel>
    </>
  );
};
