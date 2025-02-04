import { Panel } from "components/ui/Panel";
import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import shop from "assets/icons/shop.png";
import factions from "assets/icons/factions.webp";
import trophy from "assets/icons/trophy.png";
import gift from "assets/icons/gift.png";
import { BuffLabel } from "features/game/types";
import { Label } from "components/ui/Label";

export type NoticeboardItemsElements = {
  text: string;
  icon: string;
  label?: BuffLabel;
};

interface NoticeboardItemProps {
  items: NoticeboardItemsElements[];
  iconWidth?: number;
}

export const NoticeboardItems: React.FC<NoticeboardItemProps> = ({
  items,
  iconWidth = 12,
}) => {
  return (
    <>
      {items.map((item, index) => (
        <div className="flex mb-1 items-center" key={index}>
          <div className={`w-${iconWidth} flex justify-center`}>
            <img src={item.icon} className="h-6 mr-2 object-contain" />
          </div>
          <div className="w-full">
            <p className="text-xs  flex-1">{item.text}</p>
            {item.label && (
              <Label type={item.label.labelType}>
                {item.label.shortDescription}
              </Label>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export function hasReadKingdomNotice() {
  return !!localStorage.getItem("kingdom.notice");
}

function acknowledgeIntro() {
  return localStorage.setItem("kingdom.notice", new Date().toISOString());
}

interface Props {
  onClose: () => void;
}
export const KingdomNoticeboard: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <img src={SUNNYSIDE.announcement.factions} className="w-full mb-2" />
      <NoticeboardItems
        items={[
          {
            text: t("kingdom.noticeboard.one"),
            icon: factions,
          },
          {
            text: t("kingdom.noticeboard.two"),
            icon: trophy,
          },
          {
            text: t("kingdom.noticeboard.three"),
            icon: gift,
          },
          {
            text: t("kingdom.noticeboard.four"),
            icon: shop,
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
