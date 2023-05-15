import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import chest from "assets/icons/chest.png";
import { SUNNYSIDE } from "assets/sunnyside";

export const DeliveryHelp: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto flex flex-col">
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img src={ITEM_DETAILS["Pumpkin Soup"].image} className="h-7" />
        </div>
        <p className="text-sm flex-1">
          Gather ingredients and deliver orders for a reward!
        </p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img src={ITEM_DETAILS["Hammer"].image} className="h-7" />
        </div>
        <p className="text-sm flex-1">Expand your land to unlock more slots.</p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img src={SUNNYSIDE.icons.timer} className="h-7" />
        </div>
        <p className="text-sm flex-1">
          Receive new orders every 4 hours on empty slots.
        </p>
      </div>
      <div className="flex mb-2">
        <div className="w-12 flex justify-center">
          <img src={chest} className="h-7" />
        </div>
        <p className="text-sm flex-1">
          Complete multiple orders and unlock a bonus reward.
        </p>
      </div>
      <a
        href="https://docs.sunflower-land.com/player-guides/deliveries"
        target="_blank"
        rel="noopener noreferrer"
        className="underline mx-auto text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
      >
        Read more
      </a>
    </div>
  );
};
