import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import React from "react";
import flowerIcon from "assets/icons/flower_token.webp";
import giftIcon from "assets/icons/gift.png";
import chapterIcon from "assets/icons/chapter_icon_1.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const News: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <>
      <ButtonPanel
        className="mb-1"
        onClick={() =>
          window.open(
            "https://docs.sunflower-land.com/player-guides/chapters-whats-new/chapter-9-the-great-bloom",
            "_blank",
          )
        }
      >
        <div className="flex flex-wrap justify-between items-center mb-1">
          <Label type="formula" className=" ml-1" icon={chapterIcon}>
            {t("news.greatBloom")}
          </Label>
          <span className="underline text-xs pr-1">{t("read.more")}</span>
        </div>
        <img
          src={SUNNYSIDE.announcement.loveRush}
          className="w-full my-1 rounded-sm"
        />
        <p className="text-xs px-1">{t("news.greatBloom.description")}</p>
      </ButtonPanel>
      <ButtonPanel
        onClick={() =>
          window.open(
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20",
            "_blank",
          )
        }
        className="mb-1"
      >
        <div className="flex justify-between items-center mb-1">
          <Label type="vibrant" className="ml-1" icon={flowerIcon}>
            {t("news.flower.launch")}
          </Label>
          <span className="underline text-xs pr-1">{t("read.more")}</span>
        </div>
        <div className="w-full relative">
          <img
            src={SUNNYSIDE.announcement.flowerBanner}
            className="w-full mb-2 rounded-sm"
          />
        </div>

        <p className="text-xs px-1 mb-1">
          {t("news.flower.launch.description")}
        </p>
      </ButtonPanel>
      <ButtonPanel
        onClick={() =>
          window.open(
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20/ronin",
            "_blank",
          )
        }
        className="mb-1"
      >
        <div className="flex justify-between items-center mb-1">
          <Label type="info" className="ml-1" icon={giftIcon}>
            {t("news.ronin.network")}
          </Label>
          <span className="underline text-xs pr-1">{t("read.more")}</span>
        </div>
        <div className="w-full relative">
          <img
            src={SUNNYSIDE.announcement.roninBanner}
            className="w-full mb-2 rounded-sm"
          />
        </div>

        <p className="text-xs px-1 mb-1">
          {t("news.ronin.network.description")}
        </p>
      </ButtonPanel>
    </>
  );
};
