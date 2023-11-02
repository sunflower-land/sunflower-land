import React from "react";
import fishingTutorial from "assets/tutorials/fishing.png";
import fishingCodex from "assets/tutorials/fishing_codex.png";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { CROP_LIFECYCLE } from "../plots/lib/plant";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onClose: () => void;
}
export const FishingGuide: React.FC<Props> = ({ onClose }) => {
  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="p-2">
        <img src={fishingTutorial} className="w-full rounded-lg mb-2" />

        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img src={SUNNYSIDE.tools.fishing_rod} className="w-full h-full" />
          </div>
          <p className="text-xs">Craft a rod and gather bait to catch fish.</p>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img
              src={ITEM_DETAILS["Red Wiggler"].image}
              className="w-full h-full"
            />
          </div>
          <p className="text-xs">
            Bait can be earned through composting or crafting lures.
          </p>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img src={powerup} className="w-full h-full" />
          </div>
          <p className="text-xs">
            Eat fish to level up your Bumpkin or perform fish deliveries for
            rewards.
          </p>
        </div>

        <img src={fishingCodex} className="w-full rounded-lg mt-4 mb-2" />

        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img src={SUNNYSIDE.icons.search} className="w-full h-full" />
          </div>
          <p className="text-xs">
            Explore the waters to discover rare fish, complete missions, and
            unlock unique rewards within the Codex.
          </p>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img src={SUNNYSIDE.icons.stopwatch} className="w-full h-full" />
          </div>
          <p className="text-xs">
            Keep track of the changing tide patterns; specific fish species are
            only available during certain conditions.
          </p>
        </div>
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img src={CROP_LIFECYCLE.Carrot.crop} className="w-full h-full" />
          </div>
          <p className="text-xs">
            Experiment with different types of bait and chum combinations to
            maximize your chances of catching various fish species.
          </p>
        </div>

        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6">
            <img src={SUNNYSIDE.icons.stressed} className="w-full h-full" />
          </div>
          <p className="text-xs">
            Beware of legendary fish; they require exceptional skill and
            strength to catch.
          </p>
        </div>
      </div>

      <Button onClick={onClose}>Got it</Button>
    </div>
  );
};
