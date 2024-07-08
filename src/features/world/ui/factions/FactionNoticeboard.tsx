import { Panel } from "components/ui/Panel";
import React from "react";

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
            text: t("faction.noticeboard.one"),
            icon: ITEM_DETAILS["Mark"].image,
          },
          {
            text: t("faction.noticeboard.two"),
            icon: ITEM_DETAILS["Pumpkin Soup"].image,
          },
          {
            text: t("faction.noticeboard.three"),
            icon: gift,
          },
          {
            text: t("faction.noticeboard.four"),
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
