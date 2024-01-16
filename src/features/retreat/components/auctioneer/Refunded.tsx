import React from "react";
import { translate } from "lib/i18n/translate";

import trivia from "assets/npcs/trivia.gif";

export const Refunded: React.FC = () => {
  return (
    <div>
      <div className="p-2 flex flex-col items-center">
        <img src={trivia} className="w-24 mb-2" />

        <p className="text-center mb-1">
          {translate("refunded.itemsReturned")}
        </p>
        <p className="text-sm">{translate("refunded.goodLuck")}</p>
      </div>
    </div>
  );
};
