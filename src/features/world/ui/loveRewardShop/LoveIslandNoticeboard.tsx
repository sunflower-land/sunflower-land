import React from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import giant_flower_petal from "public/world/giant_flower_petal.webp";
import tier3_book from "src/assets/icons/tier3_book.webp";
import { Label, LabelType } from "components/ui/Label";
import { NPC_WEARABLES } from "lib/npcs";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { translate } from "lib/i18n/translate";

export function hasReadLoveIslandNotice() {
  return !!localStorage.getItem("loveIsland.notice");
}

function acknowledgeIntro() {
  return localStorage.setItem("loveIsland.notice", new Date().toISOString());
}

const petalDetails = [
  {
    color:
      "sepia(0.79) saturate(450%) hue-rotate(1deg) brightness(88%) contrast(1.12)",
    labelType: "warning",
    name: translate("petalPuzzle.guide.orangePetal"),
    text: translate("petalPuzzle.guide.orangePetal.description"),
  },
  {
    color:
      "brightness(11%) sepia(90%) saturate(6500%) hue-rotate(0deg) contrast(1.2)",
    labelType: "danger",
    name: translate("petalPuzzle.guide.redPetal"),
    text: translate("petalPuzzle.guide.redPetal.description"),
  },
  {
    color: "brightness(85%)",
    labelType: "vibrant",
    name: translate("petalPuzzle.guide.pinkPetal"),
    text: translate("petalPuzzle.guide.pinkPetal.description"),
  },
];

export const LoveIslandNoticeboard: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["rocket man"]}
      tabs={[
        {
          name: t("guide"),
          icon: tier3_book,
        },
      ]}
    >
      <div className="p-1 pr-1.5">
        <NoticeboardItems
          items={[
            {
              text: translate("petalPuzzle.guide.cooperate"),
              icon: SUNNYSIDE.icons.player,
            },
            {
              text: translate("petalPuzzle.guide.solve"),
              icon: SUNNYSIDE.icons.confirm,
            },
          ]}
        />
      </div>

      <div className="flex flex-col gap-y-3 p-1.5">
        {petalDetails.map((petal, index) => (
          <div className="flex items-center" key={index}>
            <img
              src={giant_flower_petal}
              style={{
                width: 70,
                filter: petal.color,
              }}
            />
            <div className="flex flex-col items-start gap-1">
              <Label type={petal.labelType as LabelType}>
                <p className="text-xxs sm:text-xs text-center">{petal.name}</p>
              </Label>
              <div className="flex gap-x-1">
                <img
                  src={
                    index === 0
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel
                  }
                  className="w-5 h-5"
                />
                <p className="text-xs">{petal.text}</p>
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
