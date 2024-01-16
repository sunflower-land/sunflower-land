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
interface GuideItem {
  icon: string;
  content: string;
}

const FlowerBedGuideItem: React.FC<{ icon: string; content: string }> = ({
  icon,
  content,
}) => {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0 w-5 h-5 pt-0.5">
        <img
          src={icon}
          className="w-full h-full object-contain object-center"
        />
      </div>
      <p className="text-xs">{content}</p>
    </div>
  );
};

export const FlowerBedGuide: React.FC<Props> = ({ onClose }) => {
  const basicGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.tools.fishing_rod,
      content: "Craft a rod and gather bait to catch fish.",
    },
    {
      icon: ITEM_DETAILS["Red Wiggler"].image,
      content: "Bait can be earned through composting or crafting lures.",
    },
    {
      icon: powerup,
      content:
        "Eat fish to level up your Bumpkin or perform fish deliveries for rewards.",
    },
  ];

  const advancedGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.icons.search,
      content:
        "Explore the waters to discover rare fish, complete missions, and unlock unique rewards within the Codex.",
    },
    {
      icon: SUNNYSIDE.icons.stopwatch,
      content:
        "Keep track of the changing tide patterns; specific fish species are only available during certain conditions.",
    },
    {
      icon: CROP_LIFECYCLE.Carrot.crop,
      content:
        "Experiment with different types of bait and chum combinations to maximize your chances of catching various fish species.",
    },
    {
      icon: SUNNYSIDE.icons.stressed,
      content:
        "Beware of legendary fish; they require exceptional skill and strength to catch.",
    },
  ];
  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="flex flex-col gap-y-3 p-2">
        <img src={fishingTutorial} className="w-full rounded-lg" />

        {basicGuide.map((item, i) => (
          <FlowerBedGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <img src={fishingCodex} className="w-full rounded-lg" />

        {advancedGuide.map((item, i) => (
          <FlowerBedGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <Button onClick={onClose} className="mt-2">
          Got it
        </Button>
      </div>
    </div>
  );
};
