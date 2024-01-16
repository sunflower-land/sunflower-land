import React from "react";
import { translate } from "lib/i18n/translate";

import trivia from "assets/npcs/trivia.gif";

export const Pending: React.FC = () => {
  return (
    <div className="p-2 flex flex-col items-center">
      <img src={trivia} className="w-24 mb-2" />
      <p>{translate("pending.calcul")}</p>
      <p className="text-sm">{translate("pending.comeback")}</p>
    </div>
  );
};
