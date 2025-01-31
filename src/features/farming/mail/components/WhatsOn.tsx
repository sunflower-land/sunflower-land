import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

import giftIcon from "assets/icons/gift.png";
import lockIcon from "assets/icons/lock.png";
import upArrow from "assets/icons/level_up.png";
import calendarIcon from "assets/icons/calendar.webp";
import lightningIcon from "assets/icons/lightning.png";
import shopIcon from "assets/icons/shop.png";
import vipIcon from "assets/icons/vip.webp";
import skillIcon from "assets/icons/tier1_book.webp";
export const WhatsOn = () => {
  const { t } = useAppTranslation();

  return (
    <div style={{ maxHeight: "300px" }}>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.windsOfChange")}</Label>
            <Label type="formula">{t("whatsOn.february3rd")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.seasonsArrived"),
                icon: calendarIcon,
              },
              {
                text: t("whatsOn.volcanoIsland"),
                icon: upArrow,
              },
              {
                text: t("whatsOn.ancientClocks"),
                icon: ITEM_DETAILS["Ancient Clock"].image,
              },
              {
                text: t("whatsOn.solarForge"),
                icon: ITEM_DETAILS["Sunstone"].image,
              },
              {
                text: t("whatsOn.weatherEvents"),
                icon: lightningIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="vibrant">{t("whatsOn.nftRace")}</Label>
            <Label type="formula">{t("whatsOn.february10th")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.timeshardsEarning"),
                icon: ITEM_DETAILS.Timeshard.image,
              },
              {
                text: t("whatsOn.timeshardsUsage"),
                icon: shopIcon,
              },
              {
                text: t("whatsOn.vipPass"),
                icon: vipIcon,
              },
              {
                text: t("whatsOn.skillSystem"),
                icon: skillIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.auctionWeek")}</Label>
            <Label type="formula">{t("whatsOn.march31st")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.auctionText"),
                icon: SUNNYSIDE.icons.stopwatch,
              },
              {
                text: t("whatsOn.auction.tickets"),
                icon: lockIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.chapterCompetition")}</Label>
            <Label type="formula">{t("whatsOn.april14th")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.animalCompetitionText"),
                icon: giftIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.mysterySeason")}</Label>
            <Label type="formula">{t("whatsOn.may1st")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.mysteryChapterText"),
                icon: SUNNYSIDE.icons.expression_confused,
              },
            ]}
          />
        </div>
      </InnerPanel>
    </div>
  );
};
