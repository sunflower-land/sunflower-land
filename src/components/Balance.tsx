import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";

interface Props {
  balance: Decimal;
}

export const Balance: React.FC<Props> = ({ balance }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <InnerPanel className="fixed top-2 right-2 z-50 flex items-center shadow-lg cursor-pointer">
      <img src={token} className="w-8 img-highlight" />
      <span
        className="text-white text-sm text-shadow ml-2"
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        {isShown === false ? (
          balance.toDecimalPlaces(4, Decimal.ROUND_DOWN).toString()
        ) : (
          <small>{balance.toString()}</small>
        )}
      </span>
    </InnerPanel>
  );
};
