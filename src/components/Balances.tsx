import React, { useState } from "react";
import Decimal from "decimal.js-light";

import flowerIcon from "assets/icons/flower_token.webp";
import coinsIcon from "assets/icons/coins.webp";
import gemIcon from "assets/icons/gem.webp";

import { formatNumber } from "lib/utils/formatNumber";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";

interface Props {
  sfl: Decimal;
  coins: number;
  gems: Decimal;
  onClick?: () => void;
}

export const Balances: React.FC<Props> = ({ sfl, coins, gems, onClick }) => {
  const [showFullBalance, setShowFullBalance] = useState(false);

  return (
    <>
      <div className="flex flex-col absolute space-y-1 items-end z-50 right-3 top-3 !text-[28px] text-stroke">
        <div
          className="flex cursor-pointer items-center space-x-3 relative"
          onClick={onClick}
        >
          <div className="flex items-center space-x-1 relative">
            <div className="h-9 w-full bg-black opacity-30 absolute gem-flower-hud-backdrop -z-10" />
            <span className="balance-text mt-0.5">{formatNumber(gems)}</span>
            <img
              src={gemIcon}
              alt="Gems"
              style={{
                marginTop: 2,
                width: 26,
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
        {/* Coins */}
        <div className="flex items-center space-x-1 relative">
          <div className="h-9 w-full bg-black opacity-30 absolute coin-hud-backdrop -z-10" />
          <span className="balance-text mt-0.5">{formatNumber(coins)}</span>
          <img
            src={coinsIcon}
            alt="Coins"
            style={{
              width: 26,
            }}
          />
        </div>
        {/* FLOWER */}
        <div
          className={classNames("flex items-center space-x-1 relative", {
            // show cursor if balance has a decimal place
            "cursor-pointer": sfl.toNumber() % 1 !== 0,
          })}
          onClick={() => setShowFullBalance(!showFullBalance)}
        >
          <div className="h-9 w-full bg-black opacity-30 absolute gem-flower-hud-backdrop -z-10" />
          <span className="balance-text">
            {formatNumber(sfl, { decimalPlaces: showFullBalance ? 4 : 2 })}
          </span>
          <img
            src={flowerIcon}
            alt="FLOWER"
            style={{
              width: 26,
            }}
          />
        </div>
      </div>
    </>
  );
};
