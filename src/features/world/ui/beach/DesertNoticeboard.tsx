import React from "react";

import shop from "assets/icons/shop.png";
import graphic from "assets/announcements/desert.webp";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Panel } from "components/ui/Panel";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";

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
      <img src={graphic} className="w-full mb-2" />
      <NoticeboardItems
        items={[
          {
            text: t("desert.notice.one"),
            icon: ITEM_DETAILS["Sand Shovel"].image,
          },
          {
            text: t("desert.notice.two"),
            icon: ITEM_DETAILS["Scarab"].image,
          },
          {
            text: t("desert.notice.three"),
            icon: shop,
          },
          {
            text: t("desert.notice.four"),
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
