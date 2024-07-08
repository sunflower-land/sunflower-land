import { Panel } from "components/ui/Panel";
import React, { useEffect } from "react";

import gift from "assets/icons/gift.png";
import lightning from "assets/icons/lightning.png";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

export function hasReadFactionNotice() {
  return !!localStorage.getItem("faction.notice");
}

function acknowledgeIntro() {
  return localStorage.setItem("faction.notice", new Date().toISOString());
}

interface Props {
  onClose: () => void;
}
export const FactionNoticeboard: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel className="pt-1">
      <NoticeboardItems
        items={[
          {
            text: "Deliver resources to the kitchen & complete chores to earn Marks.",
            icon: ITEM_DETAILS["Mark"].image,
          },
          {
            text: "Feed our grumpy pet to unlock a bonus XP boost!",
            icon: ITEM_DETAILS["Pumpkin Soup"].image,
          },
          {
            text: "The top players each week will receive a bonus prize.",
            icon: gift,
          },
          {
            text: "Trade emblems to climb the ranks and access bonus perks.",
            icon: lightning,
          },
        ]}
      />
      <Button
        onClick={() => {
          onClose();
          acknowledgeIntro();
        }}
      >
        {t("ok")}
      </Button>
    </Panel>
  );
};
