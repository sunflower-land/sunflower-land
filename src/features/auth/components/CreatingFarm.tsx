import React from "react";

import donating from "assets/splash/goblin_donation.gif";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "./Loading";

export const CreatingFarm: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col text-center items-center p-2">
      <Loading text={t("welcome.creatingAccount")} />
      <img src={donating} alt="donation loading" className="w-full m-2" />
    </div>
  );
};
