import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import chest from "assets/icons/chest.png";

export const DeliveryHelp: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2 pt-3">
      <div className="flex">
        <div className="w-12 flex">
          <img src={ITEM_DETAILS["Pumpkin Soup"].image} className="h-7" />
        </div>
        <p className="text-sm flex-1 justify-center">
          Gather ingredients and take a boat ride to Pumpkin Plaza to deliver
          orders to Bumpkins for a reward!
        </p>
      </div>
      <div className="flex">
        <div className="w-12 flex justify-center">
          <img src={ITEM_DETAILS["Hammer"].image} className="h-7" />
        </div>
        <p className="text-sm flex-1">
          Expand your land to unlock more slots + quicker orders
        </p>
      </div>
      <div className="flex">
        <div className="w-12 flex justify-center">
          <img src={chest} className="h-7" />
        </div>
        <p className="text-sm flex-1">
          Build relationships with Bumpkins by completing multiple orders to
          unlock bonus rewards.
          <span className="italic text-xs ml-1">(Coming soon)</span>
        </p>
      </div>
      <a
        href="https://docs.sunflower-land.com/player-guides/deliveries"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-xxs ml-[10px] pb-1 pt-0.5 hover:text-blue-500"
      >
        Read more
      </a>
    </div>
  );
};
