import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";
import classNames from "classnames";

interface Props {
  balance: Decimal;
  onBalanceClick?: () => void;
}

export const Balance: React.FC<Props> = ({ balance, onBalanceClick }) => {
  const [showFullBalance, setShowFullBalance] = useState(false);

  return (
    <>
      <InnerPanel
        className={classNames("fixed z-50 flex items-center p-1", {
          "cursor-pointer": !!onBalanceClick,
        })}
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
