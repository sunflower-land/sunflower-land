import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getCurrentSeason,
  getSeasonalTicket,
  secondsLeftInSeason,
} from "features/game/types/seasons";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { secondsToString } from "lib/utils/time";
import React from "react";

export const SeasonalNPCModal: React.FC = () => {
  return (
    <div className="p-2 flex flex-col items-center mb-2">
      <img
        src={ITEM_DETAILS[getSeasonalTicket()].image}
        className="w-12 -mt-4 mb-2"
      />
      <Label type="info" className="flex mb-2">
        <img src={SUNNYSIDE.icons.timer} className="w-3 left-0 -top-4 mr-1" />
        <span className="mt-[2px]">{`${secondsToString(secondsLeftInSeason(), {
          length: "medium",
        })} left`}</span>
      </Label>

      <p className="mt-1 text-sm mb-2">
        {`For a limited time, collect ${getCurrentSeason()} tickets and mint rare items.`}
      </p>
      <div className="flex flex-col w-full">
        <a
          href="https://docs.sunflower-land.com/player-guides/seasons#seasonal-tickets"
          target="_blank"
          className="text-sm underline text-white mt-2 mb-2"
          rel="noreferrer"
        >
          How to collect tickets?
        </a>
        <div className="flex mt-2 items-center">
          <img
            src={ITEM_DETAILS["Pumpkin Soup"].image}
            className="w-6 h-6 mr-2 object-contain"
          />
          <p className="text-sm">Fulfill orders at the Grub Shop</p>
        </div>
        <div className="flex mt-0.5 items-center">
          <img
            src={CROP_LIFECYCLE.Sunflower.crop}
            className="w-6 h-6 mr-2 object-contain"
          />
          <p className="text-sm">Complete Hayseed Hank Quests</p>
        </div>
        <div className="flex mt-0.5 items-center">
          <img
            src={SUNNYSIDE.icons.treasure}
            className="w-6 h-6 mr-2 object-contain"
          />
          <p className="text-sm">Collect Daily Rewards</p>
        </div>
      </div>
    </div>
  );
};
