import React from "react";

import sflIcon from "assets/icons/sfl.webp";
import bg from "assets/ui/3x3_bg.png";

import { TradeableDisplay } from "../lib/tradeables";

// TODO - move make offer here, signing state + submitting state

export const TradeableSummary: React.FC<{
  display: TradeableDisplay;
  sfl: number;
}> = ({ display, sfl }) => {
  return (
    <div className="flex">
      <div className="h-12 w-12 mr-2 relative">
        <img src={bg} className="w-full rounded" />
        <img
          src={display.image}
          className="w-1/2 absolute"
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
        />
      </div>
      <div>
        <span className="text-sm">{`1 x ${display.name}`}</span>
        <div className="flex items-center">
          <span className="text-sm">{`${sfl} SFL`}</span>
          <img src={sflIcon} className="h-6 ml-1" />
        </div>
      </div>
    </div>
  );
};
