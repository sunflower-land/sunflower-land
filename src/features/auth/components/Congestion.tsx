import React from "react";

import deathAnimation from "assets/npcs/human_death.gif";
import { translate } from "lib/i18n/translate";

export const Congestion: React.FC = () => {
  return (
    <div id="gameerror" className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">{t("error.polygon.cant.connect")}</span>
      <img src={deathAnimation} className="w-1/2 -mt-4 ml-8" />
      <span className="text-shadow text-xs text-center">
        {translate("error.congestion.one")}
      </span>
      <span className="text-shadow text-xs text-center">
        {translate("error.congestion.two")}
      </span>
    </div>
  );
};
