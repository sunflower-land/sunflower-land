import React from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import platform from "public/world/platform.webp";
import tier3_book from "src/assets/icons/tier3_book.webp";
import { Label, type LabelType } from "components/ui/Label";
import { NPC_WEARABLES } from "lib/npcs";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { translate } from "lib/i18n/translate";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  LOVE_DILEMMA_MAX_ATTEMPTS,
  LOVE_DILEMMA_MIN_PLAYERS,
  LOVE_DILEMMA_TIER_PRIZES,
} from "features/world/lib/loveIsland";

/**
 * Bump this key whenever the rules change so every player sees the new
 * guide once. "loveIsland.notice" was the petal puzzle guide.
 */
const NOTICE_KEY = "loveIsland.notice.dilemma";

export function hasReadLoveIslandNotice() {
  return !!localStorage.getItem(NOTICE_KEY);
}

function acknowledgeIntro() {
  return localStorage.setItem(NOTICE_KEY, new Date().toISOString());
}

const platformDetails = [
  {
    color: "sepia(1) saturate(400%) hue-rotate(70deg) brightness(95%)",
    labelType: "success",
    icon: SUNNYSIDE.icons.confirm,
    name: translate("loveDilemma.guide.greenPlatform"),
    text: translate("loveDilemma.guide.greenPlatform.description"),
  },
  {
    color: "sepia(1) saturate(600%) hue-rotate(-30deg) brightness(90%)",
    labelType: "danger",
    icon: SUNNYSIDE.icons.cancel,
    name: translate("loveDilemma.guide.redPlatform"),
    text: translate("loveDilemma.guide.redPlatform.description"),
  },
];

export const LoveIslandNoticeboard: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const bestVip = LOVE_DILEMMA_TIER_PRIZES.vip[0];
  const bestStandard = LOVE_DILEMMA_TIER_PRIZES.standard[0];

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["rocket man"]}
      tabs={[
        {
          name: t("guide"),
          id: "guide",
          icon: tier3_book,
        },
      ]}
    >
      <div className="p-1 pr-1.5">
        <Label type="default" className="mb-1">
          {t("loveDilemma.guide.title")}
        </Label>
        <NoticeboardItems
          items={[
            {
              text: translate("loveDilemma.guide.pick"),
              icon: SUNNYSIDE.icons.player,
            },
            {
              text: translate("loveDilemma.guide.reveal"),
              icon: SUNNYSIDE.icons.stopwatch,
            },
            {
              text: translate("loveDilemma.guide.prizes", {
                vip: bestVip,
                standard: bestStandard,
              }),
              icon: ITEM_DETAILS["Love Charm"].image,
            },
            {
              text: translate("loveDilemma.guide.limits", {
                attempts: LOVE_DILEMMA_MAX_ATTEMPTS,
                players: LOVE_DILEMMA_MIN_PLAYERS,
              }),
              icon: SUNNYSIDE.icons.confirm,
            },
          ]}
        />
      </div>

      <div className="flex flex-col gap-y-3 p-1.5">
        {platformDetails.map((detail, index) => (
          <div className="flex items-center gap-x-2" key={index}>
            <img
              src={platform}
              style={{
                width: 40,
                filter: detail.color,
              }}
            />
            <div className="flex flex-col items-start gap-1">
              <Label type={detail.labelType as LabelType}>
                <p className="text-xxs sm:text-xs text-center">{detail.name}</p>
              </Label>
              <div className="flex gap-x-1">
                <img src={detail.icon} className="w-5 h-5" />
                <p className="text-xs">{detail.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => {
          onClose();
          acknowledgeIntro();
        }}
      >
        {t("ok")}
      </Button>
    </CloseButtonPanel>
  );
};
