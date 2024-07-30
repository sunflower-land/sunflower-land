import React from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { ITEM_DETAILS } from "features/game/types/images";
import bee from "assets/icons/bee.webp";
import honey from "assets/resources/honey.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const { t } = useAppTranslation();
  const basicGuide: GuideItem[] = [
    {
      icon: ITEM_DETAILS["Sunpetal Seed"].image,
      content: t("flowerBedGuide.buySeeds"),
    },
    {
      icon: ITEM_DETAILS["Sunflower"].image,
      content: t("flowerBedGuide.crossbreedWithCrops"),
    },
    {
      icon: SUNNYSIDE.icons.search,
      content: t("flowerBedGuide.collectAllSpecies"),
    },
  ];

  const advancedGuide: GuideItem[] = [
    {
      icon: bee,
      content: t("flowerBedGuide.beesProduceHoney"),
    },
    {
      icon: honey,
      content: t("flowerBedGuide.fillUpBeehive"),
    },
    {
      icon: powerup,
      content: t("flowerBedGuide.beeSwarmsBoost"),
    },
  ];

  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="flex flex-col gap-y-3 p-2">
        <img
          src={SUNNYSIDE.tutorial.flowersTutorial}
          className="w-full rounded-lg"
        />

        {basicGuide.map((item, i) => (
          <FlowerBedGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <img
          src={SUNNYSIDE.tutorial.beeTutorial}
          className="w-full rounded-lg"
        />

        {advancedGuide.map((item, i) => (
          <FlowerBedGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <Button onClick={onClose} className="mt-2">
          {t("gotIt")}
        </Button>
      </div>
    </div>
  );
};
