import React, { useState } from "react";
import Decimal from "decimal.js-light";

import sflIcon from "assets/icons/sfl.webp";
import coinsIcon from "assets/icons/coins.webp";
import blockBucksIcon from "assets/icons/block_buck.png";

import { formatNumber } from "lib/utils/formatNumber";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";

interface Props {
  sfl: Decimal;
  coins: number;
  blockBucks: Decimal;
  onClick?: () => void;
}

export const Balances: React.FC<Props> = ({
  sfl,
  coins,
  blockBucks,
  onClick,
}) => {
  const [showFullBalance, setShowFullBalance] = useState(false);

  return (
    <>
      <div className="flex flex-col absolute space-y-1 items-end z-50 right-3 top-3 !text-[28px] text-stroke">
        <div
          className="flex cursor-pointer items-center space-x-3 relative"
          onClick={onClick}
        >
          <div className="h-9 w-full bg-black opacity-30 absolute coins-bb-hud-backdrop" />
          {/* Coins */}
          <div className="flex items-center space-x-2">
            <span className="balance-text mt-0.5">{formatNumber(coins)}</span>
            <img
              src={coinsIcon}
              alt="Coins"
              style={{
                width: 25,
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="balance-text mt-0.5">
              {formatNumber(blockBucks)}
            </span>
            <img
              src={blockBucksIcon}
              alt="Block Bucks"
              style={{
                marginTop: 2,
                width: 28,
              }}
            />
          </div>
          <img
            src={SUNNYSIDE.ui.add_button}
            className="absolute"
            style={{
              width: 20,
              right: -8,
              top: -4,
            }}
          />
        </div>
        {/* SFL */}
        <div
          className={classNames("flex items-center space-x-2 relative", {
            // show cursor if balance has a decimal place
            "cursor-pointer": sfl.toNumber() % 1 !== 0,
          })}
          onClick={() => setShowFullBalance(!showFullBalance)}
        >
          <div className="h-9 w-full bg-black opacity-25 absolute sfl-hud-backdrop -z-10" />
          <span className="balance-text">
            {formatNumber(sfl, { decimalPlaces: showFullBalance ? 8 : 4 })}
          </span>
          <img
            src={sflIcon}
            alt="SFL"
            style={{
              width: 26,
            }}
          />
        </div>
      </div>
    </>
  );
};
