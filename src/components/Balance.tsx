import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";

interface Props {
  balance: Decimal;
}

export const Balance: React.FC<Props> = ({ balance }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <InnerPanel className="fixed top-2 right-2 z-50 flex items-center cursor-pointer">
      <img
        src={token}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          margin: `${PIXEL_SCALE * 1}px`,
        }}
      />
      <span
        className="text-white text-base h-7 mx-1"
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        {isShown === false ? (
          <small>{setPrecision(balance).toString()}</small>
        ) : (
          <small>{balance.toString()}</small>
        )}
      </span>
    </InnerPanel>
  );
};
