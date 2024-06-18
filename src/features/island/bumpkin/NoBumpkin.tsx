import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const NoBumpkin: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex items-center flex-col p-2">
        <span> {t("noBumpkin.missingBumpkin")}</span>
        <img src={SUNNYSIDE.icons.heart} className="w-20 my-2" />
        <p className="text-sm my-2">{t("noBumpkin.bumpkinNFT")}</p>
        <p className="text-sm my-2">{t("noBumpkin.bumpkinHelp")}</p>
      </div>
    </>
  );
};
