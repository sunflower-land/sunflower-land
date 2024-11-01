import { Panel } from "components/ui/Panel";
import React from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import pumpkin from "/world/event_island_assets/pumpkin.png";
import donation from "/world/event_island_assets/donateIcon.png";
import portal from "/world/event_island_assets/portalicon.png";
import coin from "assets/icons/sfl.webp";
import gift from "assets/icons/gift.png";
import { BuffLabel } from "features/game/types";
import { Label } from "components/ui/Label";

interface NoticeboardItemProps {
  items: { text: string; icon: string; label?: BuffLabel }[];
  iconWidth?: number;
}

export const NoticeboardItems: React.FC<NoticeboardItemProps> = ({
  items,
  iconWidth = 12,
}) => {
  return (
    <>
      {items.map((item, index) => (
        <div className="pb-2" key={index}>
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
        </div>
      ))}
    </>
  );
};

interface Props {
  onClose: () => void;
}
export const HalloweenNoticeboard: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <NoticeboardItems
        items={[
          {
            text: t("halloween.noticeboard.one"),
            icon: pumpkin,
          },
          {
            text: t("halloween.noticeboard.two"),
            icon: portal,
          },
          {
            text: t("halloween.noticeboard.three"),
            icon: gift,
          },
          {
            text: t("halloween.noticeboard.four"),
            icon: coin,
          },
          {
            text: t("halloween.noticeboard.five"),
            icon: donation,
          },
        ]}
      />
      <Button
        onClick={() => {
          onClose();
        }}
      >
        {t("ok")}
      </Button>
    </Panel>
  );
};
