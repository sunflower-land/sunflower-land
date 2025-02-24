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
      <ButtonPanel className="mb-1">
        <div className="flex justify-between items-center">
          <Label type="vibrant" className="my-1 ml-1" icon={flowerIcon}>
            {t("news.flower.launch")}
          </Label>
          <a
            href="https://docs.sunflower-land.com/fundamentals/syncing-on-chain"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xs pr-1"
          >
            {t("read.more")}
          </a>
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
      <ButtonPanel className="mb-1">
        <div className="flex justify-between items-center">
          <Label type="info" className="my-1 ml-1" icon={giftIcon}>
            {t("news.ronin.network")}
          </Label>
          <a
            href="https://docs.sunflower-land.com/fundamentals/syncing-on-chain"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xs pr-1"
          >
            {t("read.more")}
          </a>
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
      <ButtonPanel>
        <div className="flex flex-wrap justify-between items-center">
          <Label type="formula" className="my-1 ml-1" icon={chapterIcon}>
            {t("news.winds.of.change.chapter")}
          </Label>
          <a
            href="https://docs.sunflower-land.com/fundamentals/syncing-on-chain"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xs pr-1"
          >
            {t("read.more")}
          </a>
        </div>
        <img
          src={SUNNYSIDE.announcement.windsOfChangeSeason}
          className="w-full my-1 rounded-sm"
        />
        <p className="text-xs px-1">{t("news.winds.of.change.description")}</p>
      </ButtonPanel>
    </>
  );
};
