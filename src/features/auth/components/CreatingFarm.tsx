import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "./Loading";

export const CreatingFarm: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col text-center items-center p-2">
      <Loading text={t("welcome.creatingAccount")} />
      <img
        src={SUNNYSIDE.splash.donating}
        alt="donation loading"
        className="w-full m-2"
      />
    </div>
  );
};
