import { InnerPanel } from "components/ui/Panel";
import React from "react";

import bud from "assets/animals/plaza_bud.gif";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";

export const BudCountdown: React.FC = () => {
  const start = useCountdown(new Date("2023-09-27T01:00:00").getTime());

  return (
    <InnerPanel className="mt-2 flex relative items-center">
      <img
        src={SUNNYSIDE.icons.expression_alerted}
        className="h-6 absolute top-1 right-2"
      />
      <div className="relative">
        <img
          src={bud}
          className="object-contain"
          style={{ width: `${PIXEL_SCALE * 18}px`, transform: "scaleX(-1)" }}
        />
      </div>

      <div className="pl-2 flex-1 pr-1">
        <p className="text-sm pr-2">Bud NFT Drop - 26th September</p>
        <div className="flex justify-between ">
          <TimerDisplay time={start} />
          <a
            href="https://opensea.io/collection/sunflower-land-buds/drop"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xs pb-1 pt-0.5 hover:text-blue-500"
          >
            Open Sea
          </a>
        </div>
      </div>
    </InnerPanel>
  );
};
