import React from "react";
import flowersTutorial from "assets/tutorials/flowers.webp";
import beeTutorial from "assets/tutorials/bees.webp";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { ITEM_DETAILS } from "features/game/types/images";
import bee from "assets/icons/bee.webp";
import honey from "assets/resources/honey.png";

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
      icon: ITEM_DETAILS["Sunpetal Seed"].image,
      content: "Buy seeds from the Seed Shop.",
    },
    {
      icon: ITEM_DETAILS["Sunflower"].image,
      content:
        "Crossbreed with crops and other flowers to discover new flowers species.",
    },
    {
      icon: SUNNYSIDE.icons.search,
      content: "Collect all species of flowers in the Codex!",
    },
  ];

  const advancedGuide: GuideItem[] = [
    {
      icon: bee,
      content: "Bees produce honey while flowers are growing.",
    },
    {
      icon: honey,
      content:
        "Fill up a beehive completely and collect the honey for a chance of a bee swarm to appear.",
    },
    {
      icon: powerup,
      content: "Bee swarms give +0.2 boost to any planted crops.",
    },
  ];

  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="flex flex-col gap-y-3 p-2">
        <img src={flowersTutorial} className="w-full rounded-lg" />

        {basicGuide.map((item, i) => (
          <FlowerBedGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <img src={beeTutorial} className="w-full rounded-lg" />

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
