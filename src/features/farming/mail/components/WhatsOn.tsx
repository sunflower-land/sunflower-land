import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

import choreIcon from "assets/icons/chores.webp";
import trophyIcon from "assets/icons/trophy.png";
import sflIcon from "assets/icons/sfl.webp";
import giftIcon from "assets/icons/gift.png";

export const WhatsOn = () => {
  const { t } = useAppTranslation();

  return (
    <div style={{ maxHeight: "300px" }}>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.bullRunBegins")}</Label>
            <Label type="formula">{t("whatsOn.date.nov1")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.bullRunText"),
                icon: SUNNYSIDE.icons.heart,
              },
              {
                text: t("whatsOn.cowSkullsText"),
                icon: ITEM_DETAILS["Cow Skull"].image,
              },
              {
                text: t("whatsOn.choreBoardText"),
                icon: choreIcon,
              },
              {
                text: t("whatsOn.poppyShopText"),
                icon: ITEM_DETAILS["Tulip Bulb"].image,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.animalsAndCrafting")}</Label>
            <Label type="formula">{t("whatsOn.date.nov4")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.animalsLiveText"),
                icon: ITEM_DETAILS.Milk.image,
              },
              {
                text: t("whatsOn.craftingBoxText"),
                icon: ITEM_DETAILS["Hammer"].image,
              },
              {
                text: t("whatsOn.bedsText"),
                icon: ITEM_DETAILS["Basic Bed"].image,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="vibrant">{t("whatsOn.theRaceBegins")}</Label>
            <Label type="formula">{t("whatsOn.date.nov6Dec11")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.horseshoesText"),
                icon: ITEM_DETAILS.Horseshoe.image,
              },
              {
                text: t("whatsOn.choresText"),
                icon: choreIcon,
              },
              {
                text: t("whatsOn.megastoreText"),
                icon: trophyIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.sflMarketplace")}</Label>
            <Label type="formula">{t("whatsOn.date.dec2")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.sflMarketplaceText"),
                icon: sflIcon,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="vibrant">{t("whatsOn.auctionWeek")}</Label>
            <Label type="formula">{t("whatsOn.date.dec11Dec18")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.auctionText"),
                icon: SUNNYSIDE.icons.stopwatch,
              },
            ]}
          />
        </div>
      </InnerPanel>

      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("whatsOn.animalCompetition")}</Label>
            <Label type="formula">{t("whatsOn.date.dec18Jan31")}</Label>
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
            <Label type="formula">{t("whatsOn.date.feb1")}</Label>
          </div>
          <NoticeboardItems
            items={[
              {
                text: t("whatsOn.mysterySeasonText"),
                icon: SUNNYSIDE.icons.expression_confused,
              },
            ]}
          />
        </div>
      </InnerPanel>
    </div>
  );
};
