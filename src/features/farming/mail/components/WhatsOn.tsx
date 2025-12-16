import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

import shopIcon from "assets/icons/shop.png";
import trophyIcon from "assets/icons/trophy.png";
import lockIcon from "assets/icons/lock.png";
import promoteIcon from "assets/icons/promote.webp";

export const WhatsOn = () => {
  const { t } = useAppTranslation();

  return (
    <div style={{ maxHeight: "300px" }}>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.betterTogether")}</Label>
            <Label type="formula">{t("whatsOn.betterTogetherText")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.makeFriends"),
                icon: SUNNYSIDE.icons.heart,
              },
            ]}
          />
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.tokenRace")}</Label>
            <Label type="formula">{t("whatsOn.tokenRaceText")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.earnTokens"),
                icon: ITEM_DETAILS["Bracelet"].image,
              },
              {
                text: t("whatsOn.exchangeTokens"),
                icon: shopIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.auctionWeek")}</Label>
            <Label type="formula">{t("whatsOn.auctionWeekText")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.auctionWeek.description"),
                icon: promoteIcon,
              },
              {
                text: t("whatsOn.noBraceletRewardsText"),
                icon: lockIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.competition")}</Label>
            <Label type="formula">{t("whatsOn.competitionText")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.competition.description"),
                icon: trophyIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.newChapter")}</Label>
            <Label type="formula">{t("whatsOn.newChapterDate")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.newChapter.description"),
                icon: SUNNYSIDE.icons.expression_confused,
              },
            ]}
          />
        </div>
      </InnerPanel>
    </div>
  );
};
