import React, { useEffect, useRef } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import fanArt from "assets/fanArt/fan_art_1.png";
import fanArt2 from "assets/fanArt/fan_art_2.png";
import fanArt3 from "assets/fanArt/fan_art_3.png";
import fanArt4 from "assets/fanArt/fan_art_4.gif";

import { FanArtNPC } from "./InteractableModals";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  name: FanArtNPC;
}

const ART: Record<
  FanArtNPC,
  {
    image: string;
    name: string;
    id: number;
  }
> = {
  fan_npc_1: {
    id: 63,
    image: fanArt,
    name: "Vergelsxtn",
  },
  fan_npc_2: {
    id: 165810,
    image: fanArt2,
    name: "Andando",
  },
  fan_npc_3: {
    id: 165810,
    image: fanArt3,
    name: "Andando",
  },
  fan_npc_4: {
    id: 63,
    image: fanArt4,
    name: "Vergelsxtn",
  },
};

export const FanArt: React.FC<Props> = ({ onClose, name }) => {
  // Workaround so image doesn't flash when modal closed
  const selected = useRef(name);
  useEffect(() => {
    if (name) {
      selected.current = name;
    }
  }, [name]);

  const art = ART[selected.current];

  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="w-full relative">
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
          <img className="w-full rounded-md" src={art.image} alt={art.name} />
        </div>
      </div>
    </CloseButtonPanel>
  );
};
