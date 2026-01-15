import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React, { useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { FETCHES_BY_CATEGORY, PetResourceName } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import foodIcon from "assets/food/chicken_drumstick.png";

const SECONDARY_RESOURCES = Object.values(FETCHES_BY_CATEGORY);

export const PetLevelsAndPerks: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { t } = useAppTranslation();
  const { arrow_left, xpIcon, lightning } = SUNNYSIDE.icons;
  const [secondaryResource, setSecondaryResource] = useState<PetResourceName>(
    SECONDARY_RESOURCES[0],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondaryResource((current) => {
        const index = SECONDARY_RESOURCES.indexOf(current);
        const nextIndex = (index + 1) % SECONDARY_RESOURCES.length;
        return SECONDARY_RESOURCES[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const perks: {
    level: number;
    icon: string;
    text: string;
  }[] = [
    {
      level: 1,
      icon: ITEM_DETAILS.Acorn.image,
      text: t("petGuide.levelPerks.lvl1"),
    },
    {
      level: 3,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: t("petGuide.levelPerks.lvl3"),
    },
    { level: 5, icon: lightning, text: t("petGuide.levelPerks.lvl5") },
    {
      level: 7,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: t("petGuide.levelPerks.lvl7"),
    },
    {
      level: 10,
      icon: foodIcon,
      text: t("petGuide.levelPerks.lvl10"),
    },
    {
      level: 12,
      icon: ITEM_DETAILS.Moonfur.image,
      text: t("petGuide.levelPerks.lvl12"),
    },
    {
      level: 15,
      icon: ITEM_DETAILS.Acorn.image,
      text: t("petGuide.levelPerks.lvl15"),
    },
    {
      level: 18,
      icon: ITEM_DETAILS.Acorn.image,
      text: t("petGuide.levelPerks.lvl18"),
    },
    {
      level: 20,
      icon: ITEM_DETAILS["Fossil Shell"].image,
      text: t("petGuide.levelPerks.lvl20"),
    },
    {
      level: 25,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: t("petGuide.levelPerks.lvl25"),
    },
    { level: 27, icon: xpIcon, text: t("petGuide.levelPerks.lvl27") },
    {
      level: 30,
      icon: foodIcon,
      text: t("petGuide.levelPerks.lvl30"),
    },
    { level: 35, icon: lightning, text: t("petGuide.levelPerks.lvl35") },
    {
      level: 40,
      icon: xpIcon,
      text: t("petGuide.levelPerks.lvl40"),
    },
    {
      level: 50,
      icon: ITEM_DETAILS.Acorn.image,
      text: t("petGuide.levelPerks.lvl50"),
    },
    {
      level: 60,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: t("petGuide.levelPerks.lvl60"),
    },
    { level: 75, icon: lightning, text: t("petGuide.levelPerks.lvl75") },
    {
      level: 85,
      icon: xpIcon,
      text: t("petGuide.levelPerks.lvl85"),
    },
    {
      level: 100,
      icon: ITEM_DETAILS.Acorn.image,
      text: t("petGuide.levelPerks.lvl100"),
    },
    {
      level: 150,
      icon: ITEM_DETAILS.Moonfur.image,
      text: t("petGuide.levelPerks.lvl150"),
    },
    {
      level: 200,
      icon: foodIcon,
      text: t("petGuide.levelPerks.lvl200"),
    },
  ];

  return (
    <InnerPanel className="relative overflow-y-auto max-h-[350px] scrollable">
      <div className="flex items-center gap-2">
        <img
          src={arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{t("petGuide.levelPerks.title")}</Label>
      </div>
      <p className="text-xs p-1 mb-1">{t("petGuide.levelPerks.description")}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {perks
              .sort((a, b) => a.level - b.level)
              .map((item, index) => (
                <tr
                  key={index}
                  className={classNames("relative", {
                    "bg-[#ead4aa]": index % 2 === 0,
                  })}
                >
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="p-1.5 w-1/5"
                  >
                    {`Lvl ${item.level}`}
                  </td>
                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    <div className="flex items-center gap-1">
                      <img src={item.icon} className="w-6 h-6 object-contain" />
                      <span>{item.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </InnerPanel>
  );
};
