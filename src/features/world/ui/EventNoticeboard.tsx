import { Panel } from "components/ui/Panel";
import React from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import love from "assets/icons/love_charm_small.webp";
import shop from "assets/icons/shop.png";
import calendar from "assets/icons/calendar.webp";
import eventToken from "assets/icons/holidays_token_2025.webp";
import flowerToken from "assets/icons/flower_token.webp";
import { BuffLabel } from "features/game/types";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

interface NoticeboardItemProps {
  contributors: string[];
  items: { text: string; icon: string; label?: BuffLabel }[];
  iconWidth?: number;
  onClose: () => void;
}

const CONTRIBUTORS = [
  "Grith",
  "Maxam",
  "Telk",
  "Poro",
  "kohirabbit",
  "Vergelsxtn",
  "shinon",
  "deefault",
  "Jc",
  "Andando",
  "NetherZapdos",
  "LittleEins",
];

export const NoticeboardItems: React.FC<NoticeboardItemProps> = ({
  contributors,
  items,
  iconWidth = 12,
}) => {
  return (
    <>
      <div className="flex flex-col mb-2">
        <Label type={"info"}>
          <span className="pl-1">{"Event Information"}</span>
        </Label>
      </div>
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
      <div className="flex flex-col mb-2">
        <Label type={"info"}>
          <span className="pl-1">{"Contributors"}</span>
        </Label>
      </div>
      <div className="flex flex-wrap mt-1 mb-4 gap-x-3 gap-y-1 justify-center">
        {contributors.map((name) => (
          <Label key={name} type="formula" icon={SUNNYSIDE.icons.heart}>
            <span className="pl-1">{name}</span>
          </Label>
        ))}
      </div>
    </>
  );
};

interface Props {
  onClose: () => void;
}
export const EventNoticeboard: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Panel>
        <NoticeboardItems
          items={[
            {
              text: t("eventHolidays.noticeboard.one"),
              icon: calendar,
            },
            {
              text: t("event.noticeboard.two"),
              icon: eventToken,
            },
            {
              text: t("event.noticeboard.three"),
              icon: shop,
            },
            {
              text: t("event.noticeboard.four"),
              icon: flowerToken,
            },
            {
              text: t("event.noticeboard.five"),
              icon: love,
            },
          ]}
          contributors={CONTRIBUTORS}
          onClose={onClose}
        />
        <Button
          onClick={() => {
            onClose();
          }}
        >
          {t("ok")}
        </Button>
      </Panel>
    </>
  );
};
