import React from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Panel } from "components/ui/Panel";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import shop from "assets/icons/shop.png";
import { getSeasonalArtefact } from "features/game/types/seasons";

export function hasReadDesertNotice() {
  return !!localStorage.getItem("desert.notice");
}

function acknowledgeIntro() {
  return localStorage.setItem("desert.notice", new Date().toISOString());
}

interface Props {
  onClose: () => void;
}
export const DesertNoticeboard: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <img
        src={SUNNYSIDE.announcement.desert_digging}
        className="w-full mb-2"
      />
      <NoticeboardItems
        items={[
          {
            text: t("desert.notice.one"),
            icon: ITEM_DETAILS["Sand Shovel"].image,
          },
          {
            text: t("desert.notice.two", { ticket: getSeasonalArtefact() }),
            icon: ITEM_DETAILS[getSeasonalArtefact()].image,
          },
          {
            text: t("desert.notice.three"),
            icon: ITEM_DETAILS["Hieroglyph"].image,
          },
          {
            text: t("desert.notice.four"),
            icon: shop,
          },
          {
            text: t("desert.notice.five"),
            icon: SUNNYSIDE.icons.player,
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
