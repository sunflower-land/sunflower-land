import React from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import fanArt from "assets/fanArt/fan_art_1.png";
import fanArt2 from "assets/fanArt/fan_art_2.png";
import fanArt3 from "assets/fanArt/fan_art_3.png";
import fanArt4 from "assets/fanArt/fan_art_4.gif";

import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

const ART: {
  image: string;
  name: string;
  id: number;
}[] = [
  {
    id: 63,
    image: fanArt,
    name: "Vergelsxtn",
  },
  {
    id: 165810,
    image: fanArt2,
    name: "Andando",
  },
  {
    id: 165810,
    image: fanArt3,
    name: "Andando",
  },
  {
    id: 63,
    image: fanArt4,
    name: "Vergelsxtn",
  },
];

export const FanArt: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="flex flex-col items-center overflow-y-auto scrollable ">
        {ART.map((art, index) => {
          return (
            <div key={index} className="w-full relative mb-4">
              <div className="absolute top-2 left-2">
                <Label type={"chill"} icon={SUNNYSIDE.icons.heart}>
                  {t("interactableModals.fanArt.winner")}
                </Label>
                <Label
                  icon={SUNNYSIDE.icons.player}
                  className="mt-2"
                  type={"formula"}
                >
                  {`${art.name} - #${art.id}`}
                </Label>
              </div>
              <img
                className="w-full rounded-md"
                src={art.image}
                alt={art.name}
              />
            </div>
          );
        })}
      </div>
    </CloseButtonPanel>
  );
};
