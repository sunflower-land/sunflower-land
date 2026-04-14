import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { pixelOrangeBorderStyle } from "features/game/lib/style";
import classNames from "classnames";
import g3 from "assets/icons/g3.svg";
export const Game3WinnerWidget: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div
      className={classNames(
        `w-full items-center flex  text-xs p-2 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#ffa500",
        color: "#181425",
        ...pixelOrangeBorderStyle,
      }}
    >
      <img src={g3} className="h-5 mr-2" />
      <div>
        <p className="text-xs flex-1">{t("game3WinnerWidget.title")}</p>
        <p className="text-xxs flex-1">{t("game3WinnerWidget.subtitle")}</p>
      </div>
    </div>
  );
};
