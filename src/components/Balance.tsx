import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";

interface Props {
  balance: Decimal;
  farmAddress?: string;
  onBalanceClick?: () => void;
}

export const Balance: React.FC<Props> = ({ balance, onBalanceClick }) => {
  const [showFullBalance, setShowFullBalance] = useState(false);

  return (
    <>
      <InnerPanel
        className="fixed z-50 flex items-center cursor-pointer p-1"
        style={{
          top: `${PIXEL_SCALE * 3}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
        onMouseEnter={() => setShowFullBalance(true)}
        onMouseLeave={() => setShowFullBalance(false)}
        onClick={onBalanceClick}
      >
        <img
          src={token}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
        <span className="text-sm ml-1.5 mb-0.5">
          {showFullBalance
            ? balance.toString()
            : setPrecision(balance).toString()}
        </span>
      </InnerPanel>
    </>
  );
};
