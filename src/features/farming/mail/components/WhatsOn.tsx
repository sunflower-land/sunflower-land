import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

import giftIcon from "assets/icons/gift.png";
import lockIcon from "assets/icons/lock.png";
import shopIcon from "assets/icons/shop.png";
import vipIcon from "assets/icons/vip.webp";
import upArrow from "assets/icons/level_up.png";
import promoteIcon from "assets/icons/promote.webp";
import { getSeasonalTicket } from "features/game/types/seasons";

export const WhatsOn = () => {
  const { t } = useAppTranslation();
  const ticket = getSeasonalTicket();

  return (
    <div style={{ maxHeight: "300px" }}>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.greatBloom")}</Label>
            <Label type="formula">{t("whatsOn.may1st")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.floatingIsland"),
                icon: ITEM_DETAILS["Heart Balloons"].image,
              },
              {
                text: t("whatsOn.flowerPuzzle"),
                icon: giftIcon,
              },
              {
                text: t("whatsOn.brokenPillars"),
                icon: ITEM_DETAILS["Broken Pillar"].image,
              },
              {
                text: t("whatsOn.megaBountyBoard"),
                icon: upArrow,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="vibrant">{t("whatsOn.nftRace")}</Label>
            <Label type="formula">{t("whatsOn.may5th")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.genesisEarning"),
                icon: ITEM_DETAILS.Geniseed.image,
              },
              {
                text: t("whatsOn.genesisUsage"),
                icon: shopIcon,
              },
              {
                text: t("whatsOn.flowerBox"),
                icon: ITEM_DETAILS["Gold Flower Box"].image,
              },
              {
                text: t("whatsOn.vipPass"),
                icon: vipIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.auctionWeek")}</Label>
            <Label type="formula">{t("whatsOn.june23rd")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.auctionText"),
                icon: SUNNYSIDE.icons.stopwatch,
              },
              {
                text: t("whatsOn.auction.tickets", { ticket }),
                icon: lockIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.ticketsEnd")}</Label>
            <Label type="formula">{t("whatsOn.july28th")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.ticketPaused", { ticket }),
                icon: ITEM_DETAILS[ticket].image,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.coopSeason")}</Label>
            <Label type="formula">{t("whatsOn.august1st")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.coopSeasonText"),
                icon: SUNNYSIDE.icons.heart,
              },
              {
                text: t("whatsOn.coopSeasonText2"),
                icon: promoteIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>
    </div>
  );
};
