import React, { useState } from "react";
import Decimal from "decimal.js-light";

import sflIcon from "assets/icons/sfl.webp";
import coinsIcon from "assets/icons/coins.webp";
import blockBucksIcon from "assets/icons/block_buck.png";

import { setPrecision } from "lib/utils/formatNumber";
import { SUNNYSIDE } from "assets/sunnyside";

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
      <div className="flex flex-col absolute space-y-1 items-end z-50 right-3 top-3 text-sm text-stroke">
        <div
          className="flex cursor-pointer items-center space-x-3 relative"
          onClick={onClick}
        >
          <div className="h-9 w-full bg-black opacity-25 absolute coins-bb-hud-backdrop" />
          {/* Coins */}
          <div className="flex items-center space-x-2">
            <span>{coins % 1 !== 0 ? coins.toFixed(2) : coins}</span>
            <img
              src={coinsIcon}
              alt="Coins"
              style={{
                width: 25,
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>{blockBucks.toString()}</span>
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
          className="flex items-center cursor-pointer space-x-2 relative"
          onClick={() => setShowFullBalance(!showFullBalance)}
        >
          <div className="h-9 w-full bg-black opacity-25 absolute sfl-hud-backdrop -z-10" />
          <span>
            {showFullBalance ? sfl.toString() : setPrecision(sfl).toString()}
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
    // <>
    //   <InnerPanel
    //     className={classNames("absolute z-50 flex items-center p-1", {
    //       "cursor-pointer": !!onBalanceClick,
    //     })}
    //     style={{
    //       top: `${PIXEL_SCALE * 3}px`,
    //       right: `${PIXEL_SCALE * 3}px`,
    //     }}
    //     onMouseEnter={() => setShowFullBalance(true)}
    //     onMouseLeave={() => setShowFullBalance(false)}
    //     onClick={onBalanceClick}
    //   >
    //     <img
    //       src={token}
    //       style={{
    //         width: `${PIXEL_SCALE * 10}px`,
    //       }}
    //     />
    //     <span className="text-sm ml-1.5 mb-0.5">
    //       {showFullBalance ? sfl.toString() : setPrecision(sfl).toString()}
    //     </span>
    //   </InnerPanel>
    // </>
  );
};
