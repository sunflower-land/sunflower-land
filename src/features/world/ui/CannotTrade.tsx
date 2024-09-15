import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const CannotTrade: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col items-center p-2">
      <img
        src={SUNNYSIDE.icons.lock}
        className="my-2"
        style={{
          width: `${PIXEL_SCALE * 12}px`,
        }}
      />
      <p className="text-sm">{t("bumpkinTrade.minLevel")}</p>
      <p className="text-xs">{t("statements.lvlUp")}</p>
    </div>
  );
};
